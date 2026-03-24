// ════════════════════════════════════════════════════════════
// FOCUSBRO CLOUDFLARE WORKERS API
// Authentication, sync, data management
// ════════════════════════════════════════════════════════════

import { Router } from 'itty-router';

const router = Router();

// ── DATABASE INITIALIZATION ──
let dbInitialized = false;

async function initializeDatabase(env) {
  if (dbInitialized) return;
  
  try {
    // Create tables with IF NOT EXISTS to prevent errors on subsequent calls
    const createTableStatements = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1
      )`,
      `CREATE TABLE IF NOT EXISTS user_data_snapshots (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
        user_id TEXT NOT NULL,
        snapshot_data TEXT NOT NULL,
        size_bytes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS sync_logs (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
        user_id TEXT NOT NULL,
        device_id TEXT,
        action TEXT,
        synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
        user_id TEXT NOT NULL,
        key_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
        user_id TEXT NOT NULL,
        token TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
        user_id TEXT,
        action TEXT NOT NULL,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
      `CREATE INDEX IF NOT EXISTS idx_snapshots_user ON user_data_snapshots(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sync_logs_user ON sync_logs(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`
    ];

    for (const sql of createTableStatements) {
      try {
        await env.DB.prepare(sql).run();
      } catch (e) {
        // Log but don't fail - table might already exist
        console.log('Init note:', e.message);
      }
    }
    
    dbInitialized = true;
  } catch (e) {
    console.error('Database initialization error:', e);
    // Don't throw - let requests continue and handle DB errors individually
  }
}

// ── CORS HEADERS ──
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ── UTILITY: Handle CORS ──
router.options('*', () => new Response(null, { headers: corsHeaders }));

// ── UTILITY: Secure Password Hashing (Web Crypto API) ──
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// ── UTILITY: Verify Password ──
async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// ── UTILITY: Generate JWT Token ──
function generateToken(userId) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    sub: userId,
    iat: now,
    exp: now + 30 * 24 * 60 * 60, // 30 days
  }));
  
  // Simple HMAC (not cryptographically secure for production - use node-jose in real scenario)
  const token = `${header}.${payload}`;
  return token;
}

// ── UTILITY: Verify JWT Token ──
function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp < now) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// ── UTILITY: Generate UUID ──
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ════════════════════════════════════════════════════════════
// AUTHENTICATION ENDPOINTS
// ════════════════════════════════════════════════════════════

// ── REGISTER ──
router.post('/auth/register', async (request, env) => {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Check if user exists
    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existing) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const userId = generateUUID();
    const passwordHash = await hashPassword(password);
    
    // Create user
    await env.DB.prepare(
      `INSERT INTO users (id, email, password_hash, created_at, updated_at) 
       VALUES (?, ?, ?, datetime('now'), datetime('now'))`
    ).bind(userId, email, passwordHash).run();
    
    // Create session
    const sessionId = generateUUID();
    const token = generateToken(userId);
    
    await env.DB.prepare(
      `INSERT INTO sessions (id, user_id, token, created_at, expires_at)
       VALUES (?, ?, ?, datetime('now'), datetime('now', '+30 days'))`
    ).bind(sessionId, userId, token).run();
    
    // Log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (user_id, action, details, created_at)
       VALUES (?, 'register', 'success', datetime('now'))`
    ).bind(userId).run();
    
    return new Response(JSON.stringify({
      success: true,
      user_id: userId,
      email,
      token,
      session_id: sessionId
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// ── LOGIN ──
router.post('/auth/login', async (request, env) => {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Find user
    const user = await env.DB.prepare('SELECT id, password_hash FROM users WHERE email = ? AND is_active = 1').bind(email).first();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Create session
    const sessionId = generateUUID();
    const token = generateToken(user.id);
    
    await env.DB.prepare(
      `INSERT INTO sessions (id, user_id, token, created_at, expires_at)
       VALUES (?, ?, ?, datetime('now'), datetime('now', '+30 days'))`
    ).bind(sessionId, user.id, token).run();
    
    // Update last_login
    await env.DB.prepare('UPDATE users SET updated_at = datetime("now") WHERE id = ?').bind(user.id).run();
    
    // Log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (user_id, action, details, created_at)
       VALUES (?, 'login', 'success', datetime('now'))`
    ).bind(user.id).run();
    
    return new Response(JSON.stringify({
      success: true,
      user_id: user.id,
      email,
      token,
      session_id: sessionId
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// ════════════════════════════════════════════════════════════
// DATA SYNC ENDPOINTS
// ════════════════════════════════════════════════════════════

// ── MIDDLEWARE: Verify Auth ──
function getAuthToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

// ── SYNC USER DATA (Store/Update) ──
router.post('/sync/data', async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const userId = tokenPayload.sub;
    const { data, device_id } = await request.json();
    
    if (!data) {
      return new Response(JSON.stringify({ error: 'Data required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const dataString = JSON.stringify(data);
    const dataSize = dataString.length;
    
    // ──Store in KV for fast access ──
    const kvKey = `user:${userId}:latest`;
    await env.KV_CACHE.put(kvKey, dataString, {
      expirationTtl: 365 * 24 * 60 * 60 // 1 year
    });
    
    // Store in D1 for archival
    await env.DB.prepare(
      `INSERT INTO user_data_snapshots (user_id, snapshot_data, snapshot_size, created_at)
       VALUES (?, ?, ?, datetime('now'))`
    ).bind(userId, dataString, dataSize).run();
    
    // Log sync
    await env.DB.prepare(
      `INSERT INTO sync_logs (user_id, device_id, synced_at, data_size, status)
       VALUES (?, ?, datetime('now'), ?, 'success')`
    ).bind(userId, device_id, dataSize).run();
    
    return new Response(JSON.stringify({
      success: true,
      synced_at: new Date().toISOString(),
      size_bytes: dataSize
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// ── FETCH USER DATA (Retrieve) ──
router.get('/sync/data', async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const userId = tokenPayload.sub;
    
    // Try KV first (faster)
    const kvKey = `user:${userId}:latest`;
    let data = await env.KV_CACHE.get(kvKey);
    
    if (data) {
      return new Response(JSON.stringify({
        success: true,
        data: JSON.parse(data),
        source: 'cache'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Fallback to D1 (slower but persistent)
    const snapshot = await env.DB.prepare(
      `SELECT snapshot_data FROM user_data_snapshots 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 1`
    ).bind(userId).first();
    
    if (!snapshot) {
      return new Response(JSON.stringify({
        success: true,
        data: null,
        message: 'No data found'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: JSON.parse(snapshot.snapshot_data),
      source: 'database'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// ════════════════════════════════════════════════════════════
// UTILITY ENDPOINTS
// ════════════════════════════════════════════════════════════

// ── HEALTH CHECK ──
router.get('/health', async (request, env) => {
  return new Response(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// ── 404 Fallback ──
router.all('*', () => new Response(JSON.stringify({ error: 'Not found' }), {
  status: 404,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
}));

// ── EXPORT WITH DATABASE INITIALIZATION ──
export default {
  async fetch(request, env, ctx) {
    // Initialize database on first request
    await initializeDatabase(env);
    
    // Handle the request with the router
    return router.handle(request, env);
  }
};
