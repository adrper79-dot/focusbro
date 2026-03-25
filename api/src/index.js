// ════════════════════════════════════════════════════════════
// FOCUSBRO CLOUDFLARE WORKERS API
// Authentication, sync, data management
// ════════════════════════════════════════════════════════════

import { Router } from 'itty-router';
import extendedRouter from './extended-routes.js';
import htmlContent from './html.js';

const router = Router();

// ── DATABASE INITIALIZATION ──
let dbInitialized = false;

async function initializeDatabase(env) {
  try {
    // Only run CREATE statements once
    if (!dbInitialized) {
      
    const createTableStatements = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        avatar_url TEXT,
        subscription_tier TEXT DEFAULT 'free',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
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
        device_id TEXT,
        device_name TEXT,
        token TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        is_active INTEGER DEFAULT 1,
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
      // ── PHASE 0: ANALYTICS INFRASTRUCTURE ──
      `CREATE TABLE IF NOT EXISTS focus_events (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
        user_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        tool TEXT,
        duration_seconds INTEGER DEFAULT 0,
        data TEXT DEFAULT '{}',
        client_timestamp DATETIME NOT NULL,
        server_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS user_streaks (
        user_id TEXT PRIMARY KEY,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_active_date TEXT,
        total_sessions INTEGER DEFAULT 0,
        total_focus_seconds INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE INDEX IF NOT EXISTS idx_events_user_time ON focus_events(user_id, client_timestamp)`,
      `CREATE INDEX IF NOT EXISTS idx_events_type ON focus_events(user_id, event_type)`,
      // ── PHASE 3 TABLES ──
      `CREATE TABLE IF NOT EXISTS push_subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        device_label TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS notification_prefs (
        user_id TEXT PRIMARY KEY,
        morning_motivation INTEGER DEFAULT 0,
        morning_time TEXT DEFAULT '08:00',
        break_reminders INTEGER DEFAULT 1,
        medication_reminders INTEGER DEFAULT 1,
        milestones INTEGER DEFAULT 1,
        custom_schedule TEXT DEFAULT '{}',
        timezone TEXT DEFAULT 'UTC',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE INDEX IF NOT EXISTS idx_push_user ON push_subscriptions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_notif_prefs_user ON notification_prefs(user_id)`,
      // ── END PHASE 3 TABLES ──
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
      `CREATE INDEX IF NOT EXISTS idx_snapshots_user ON user_data_snapshots(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sync_logs_user ON sync_logs(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`
    ];

    // Add missing columns to users table
    const alterTableStatements = [
      `ALTER TABLE users ADD COLUMN avatar_url TEXT`,
      `ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT 'free'`,
      `ALTER TABLE users ADD COLUMN last_login DATETIME`,
      `ALTER TABLE sessions ADD COLUMN is_active INTEGER DEFAULT 1`,
      `ALTER TABLE sessions ADD COLUMN device_id TEXT`,
      `ALTER TABLE sessions ADD COLUMN device_name TEXT`,
      `ALTER TABLE sessions ADD COLUMN last_activity DATETIME DEFAULT CURRENT_TIMESTAMP`
    ];

    for (const sql of createTableStatements) {
      try {
        await env.DB.prepare(sql).run();
      } catch (e) {
        // Table might already exist - this is expected
        console.debug('DB init note:', e.message);
      }
      }
    }

    // Try to add columns - will fail silently if they already exist
    for (const sql of alterTableStatements) {
      try {
        await env.DB.prepare(sql).run();
      } catch (e) {
        // Ignore - column might already exist
        console.debug('Column already exists or other error:', e.message);
      }
    }
    
    dbInitialized = true;
  } catch (e) {
    console.error('Database initialization error:', e);
    // Don't throw - let requests continue and handle DB errors individually
  }
}

// ── CORS HEADERS ──
// Restrict to specific origins to prevent CSRF and unauthorized API access
function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'https://focusbro.net',
    'https://www.focusbro.net',
    'http://localhost:3000',
    'http://localhost:8787',
  ];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://focusbro.net',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

const corsHeaders = getCorsHeaders({ headers: new Headers() });

// ── UTILITY: Handle CORS ──
router.options('*', (request) => new Response(null, { headers: getCorsHeaders(request) }));

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

// ── EXPORT UTILITIES FOR OTHER MODULES ──
export { hashPassword, verifyPassword, generateToken, verifyToken, generateUUID };

// ── UTILITY: Generate JWT Token with HMAC-SHA256 ──
async function generateToken(userId, jwtSecret) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    sub: userId,
    iat: now,
    exp: now + 30 * 24 * 60 * 60, // 30 days
  }));
  
  // Create HMAC-SHA256 signature
  const headerPayload = `${header}.${payload}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(jwtSecret);
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(headerPayload));
  
  // Convert signature to base64url
  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return `${headerPayload}.${signatureBase64}`;
}

// ── UTILITY: Verify JWT Token ──
async function verifyToken(token, jwtSecret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Re-create signature to verify
    const headerPayload = `${parts[0]}.${parts[1]}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(jwtSecret);
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    
    // Convert base64url signature back to binary
    const signaturePadded = parts[2] + '='.repeat((4 - parts[2].length % 4) % 4);
    const signatureBinary = atob(signaturePadded.replace(/-/g, '+').replace(/_/g, '/'));
    const signatureArray = new Uint8Array(signatureBinary.length);
    for (let i = 0; i < signatureBinary.length; i++) {
      signatureArray[i] = signatureBinary.charCodeAt(i);
    }
    
    // Verify signature
    const isValid = await crypto.subtle.verify('HMAC', key, signatureArray, encoder.encode(headerPayload));
    if (!isValid) return null;
    
    // Check expiration
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;
    
    return payload;
  } catch (e) {
    console.error('Token verification error:', e.message);
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
    
    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (!password || password.length < 8) {
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
    
    // Create session with proper JWT
    const sessionId = generateUUID();
    const token = await generateToken(userId, env.JWT_SECRET);
    
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
    console.error('[AUTH] Registration error:', error.message);
    return new Response(JSON.stringify({ error: 'Registration failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// ── LOGIN ──
router.post('/auth/login', async (request, env) => {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Find user
    const user = await env.DB.prepare('SELECT id, password_hash FROM users WHERE email = ? AND is_active = 1').bind(email).first();
    
    if (!user) {
      // Generic error to prevent email enumeration attacks
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
    
    // Create session with proper JWT
    const sessionId = generateUUID();
    const token = await generateToken(user.id, env.JWT_SECRET);
    
    await env.DB.prepare(
      `INSERT INTO sessions (id, user_id, token, created_at, expires_at)
       VALUES (?, ?, ?, datetime('now'), datetime('now', '+30 days'))`
    ).bind(sessionId, user.id, token).run();
    
    // Update last_login
    await env.DB.prepare('UPDATE users SET last_login = datetime("now"), updated_at = datetime("now") WHERE id = ?').bind(user.id).run();
    
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
    console.error('[AUTH] Login error:', error.message);
    return new Response(JSON.stringify({ error: 'Login failed' }), {
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
    
    const tokenPayload = await verifyToken(token, env.JWT_SECRET);
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
    
    // Limit data size (avoid abuse - max 10MB per sync)
    const MAX_SYNC_SIZE = 10 * 1024 * 1024;
    if (dataSize > MAX_SYNC_SIZE) {
      return new Response(JSON.stringify({ error: 'Data too large (max 10MB)' }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    try {
      // Store in KV for fast access
      const kvKey = `user:${userId}:latest`;
      await env.KV_CACHE.put(kvKey, dataString, {
        expirationTtl: 365 * 24 * 60 * 60 // 1 year
      });
      
      // Store in D1 for archival
      await env.DB.prepare(
        `INSERT INTO user_data_snapshots (user_id, snapshot_data, size_bytes, created_at)
         VALUES (?, ?, ?, datetime('now'))`
      ).bind(userId, dataString, dataSize).run();
      
      // Log sync
      await env.DB.prepare(
        `INSERT INTO sync_logs (user_id, device_id, action, status, synced_at)
         VALUES (?, ?, 'data_upload', 'success', datetime('now'))`
      ).bind(userId, device_id).run();
      
      return new Response(JSON.stringify({
        success: true,
        synced_at: new Date().toISOString(),
        size_bytes: dataSize
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('[SYNC] Data upload error:', error.message);
      return new Response(JSON.stringify({ error: 'Failed to sync data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
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
    
    const tokenPayload = await verifyToken(token, env.JWT_SECRET);
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
      try {
        return new Response(JSON.stringify({
          success: true,
          data: JSON.parse(data),
          source: 'cache'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (parseError) {
        console.error('[SYNC] Failed to parse cached data:', parseError.message);
        // Fall through to DB if cache is corrupt
      }
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
    
    try {
      const parsedData = JSON.parse(snapshot.snapshot_data);
      return new Response(JSON.stringify({
        success: true,
        data: parsedData,
        source: 'database'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (parseError) {
      console.error('[SYNC] Failed to parse database snapshot:', parseError.message);
      return new Response(JSON.stringify({
        success: true,
        data: null,
        message: 'Data corrupted, please resync'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('[SYNC] Data retrieval error:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to retrieve data' }), {
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

// ── ROOT PAGE (Serve HTML) ──
router.get('/', async (request, env) => {
  return new Response(htmlContent, {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
  });
});

// ── FAVICON ──
router.get('/favicon.ico', async (request, env) => {
  // Serve professional SVG favicon (monogram "FB")
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect fill="#1e40af" width="64" height="64"/><text x="32" y="45" font-size="36" font-weight="700" font-family="Inter, sans-serif" fill="#ffffff" text-anchor="middle">FB</text></svg>`;
  return new Response(svgFavicon, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
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
    
    // Try main router first
    const response = await router.handle(request, env);
    
    // If main router returns 404, try extended router
    if (response.status === 404) {
      const extendedResponse = await extendedRouter.handle(request, env);
      if (extendedResponse.status !== 404) {
        return extendedResponse;
      }
    }
    
    // Return response from routers
    return response;
  }
};
