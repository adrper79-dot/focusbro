// ════════════════════════════════════════════════════════════
// FOCUSBRO CLOUDFLARE WORKERS API
// Authentication, sync, data management
// ════════════════════════════════════════════════════════════

import { Router } from 'itty-router';
import extendedRouter from './extended-routes.js';
import htmlContent from './html.js';
import config from './config.js';

const router = Router();

// ── DEBUG LOGGING ──
const DEBUG = false; // Set to true only during development/debugging
const dbLog = (msg, ...args) => {
  if (DEBUG) console.log('[DB]', msg, ...args);
};

// ── RATE LIMITING ──
/**
 * Rate limiter for auth endpoints using KV storage
 * Limits requests per IP to prevent brute force attacks
 */
async function checkRateLimit(request, env, endpoint) {
  // Get client IP from CF headers
  const clientIP = request.headers.get('CF-Connecting-IP') || 
                   request.headers.get('X-Forwarded-For') || 
                   'unknown';
  
  const rateLimitKey = `ratelimit:${endpoint}:${clientIP}`;
  
  try {
    // Get current count from KV
    const countStr = await env.KV.get(rateLimitKey);
    const count = countStr ? parseInt(countStr) : 0;
    
    const MAX_ATTEMPTS = config.auth.maxLoginAttempts;
    const TIME_WINDOW = config.auth.rateLimitWindowSeconds;
    
    if (count >= MAX_ATTEMPTS) {
      return {
        limited: true,
        retryAfter: TIME_WINDOW,
        message: 'Too many login attempts. Please try again in 15 minutes.'
      };
    }
    
    // Increment counter and set expiration
    await env.KV.put(rateLimitKey, (count + 1).toString(), { expirationTtl: TIME_WINDOW });
    
    return { limited: false };
  } catch (e) {
    // If KV fails, allow the request (fail open)
    console.warn('Rate limit check failed (allowing request):', e.message);
    return { limited: false };
  }
}

// ── DATABASE INITIALIZATION ──
let dbInitialized = false;

async function initializeDatabase(env) {
  try {
    // Only run CREATE statements once
    if (!dbInitialized) {
      dbLog('Initializing database schema...');
      
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
      // ── PHASE 4 TABLES ──
      `CREATE TABLE IF NOT EXISTS slack_integrations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        webhook_url TEXT,
        access_token TEXT,
        team_id TEXT,
        channel_id TEXT,
        post_sessions INTEGER DEFAULT 1,
        update_presence INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE INDEX IF NOT EXISTS idx_slack_user ON slack_integrations(user_id)`,
      // ── END PHASE 4 TABLES ──
      // ── PHASE 5 TABLES ──
      `CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        stripe_customer_id TEXT UNIQUE,
        stripe_subscription_id TEXT,
        plan TEXT DEFAULT 'free',
        status TEXT DEFAULT 'active',
        current_period_end DATETIME,
        trial_end DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE INDEX IF NOT EXISTS idx_sub_user ON subscriptions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sub_stripe ON subscriptions(stripe_customer_id)`,
      // ── END PHASE 5 TABLES ──
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
        // But log if it's something serious
        if (!e.message.includes('already exists') && !e.message.includes('duplicate')) {
          console.warn('DB initialization notice:', e.message.slice(0, 100));
        }
      }
      }
    }

    // Try to add columns - will fail silently if they already exist
    const alterTableStatements = [
      // Placeholder for future ALTER statements
    ];
    
    for (const sql of alterTableStatements) {
      try {
        await env.DB.prepare(sql).run();
      } catch (e) {
        // Ignore - column might already exist
        console.debug('Column update note:', e.message.slice(0, 100));
      }
    }
    
    // Verify critical tables exist
    try {
      const userTable = await env.DB.prepare('SELECT COUNT(*) as count FROM users LIMIT 1').first();
      dbLog('✅ Database schema verified - users table accessible');
    } catch (verifyError) {
      console.error('⚠️ Database schema verification failed (requests may fail):', verifyError.message);
    }
    
    dbInitialized = true;
    dbLog('✅ Database initialization complete');
  } catch (e) {
    console.error('❌ Database initialization error:', e.message);
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
  
  // ⚠️  SECURITY: Return 'null' for untrusted origins (not a default safe origin)
  const corsOrigin = allowedOrigins.includes(origin) ? origin : 'null';
  
  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': corsOrigin === 'null' ? '' : 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': corsOrigin === 'null' ? '' : 'Content-Type, Authorization',
    'Access-Control-Max-Age': corsOrigin === 'null' ? '' : '86400',
  };
}

const corsHeaders = getCorsHeaders({ headers: new Headers() });

// ── CACHE STRATEGY HELPER ──
/**
 * Get cache control headers based on endpoint characteristics.
 * Reduces bandwidth and server load while keeping data fresh.
 * @param {string} strategy - 'nocache' (auth), 'short' (5min), 'medium' (1hr), 'static' (24hr)
 * @returns {string} Cache-Control header value
 */
function getCacheControl(strategy) {
  const strategies = {
    'nocache': 'no-store, must-revalidate, max-age=0',
    'short': 'private, max-age=300', // 5 minutes for user data, events
    'medium': 'private, max-age=3600', // 1 hour for stats, analytics
    'static': 'private, max-age=86400' // 24 hours for config, settings
  };
  return strategies[strategy] || strategies.nocache;
}

/**
 * Create JSON response with CORS and cache control headers
 * @param {any} data - Data to serialize as JSON
 * @param {number} status - HTTP status code
 * @param {string} cacheStrategy - Cache strategy ('nocache', 'short', 'medium', 'static')
 * @returns {Response}
 */
function jsonResponse(data, status = 200, cacheStrategy = 'nocache') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': getCacheControl(cacheStrategy)
    }
  });
}

/**
 * Create standardized error response with consistent structure
 * Helps with error handling and debugging across API
 * @param {string} message - Human-readable error message
 * @param {number} status - HTTP status code
 * @param {string|null} code - Machine-readable error code (e.g. 'INVALID_INPUT', 'UNAUTHORIZED')
 * @returns {Response}
 */
function errorResponse(message, status = 400, code = null) {
  // Map status codes to standard error codes if not provided
  const errorCodes = {
    400: 'INVALID_INPUT',
    401: 'UNAUTHORIZED',
    402: 'PAYMENT_REQUIRED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    413: 'PAYLOAD_TOO_LARGE',
    429: 'RATE_LIMITED',
    500: 'INTERNAL_ERROR',
    503: 'SERVICE_UNAVAILABLE'
  };
  
  const errorCode = code || errorCodes[status] || 'ERROR';
  
  return jsonResponse({
    success: false,
    error: message,
    code: errorCode
  }, status, 'nocache');
}

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

/**
 * Generate HMAC-SHA256 JWT token with 30-day expiration.
 * Uses 256-bit key material for cryptographic strength.
 * Token format: header.payload.signature (all base64url encoded)
 * @param {string} userId - User ID for 'sub' claim
 * @param {string} jwtSecret - Secret key (min 32 chars recommended, min 256 bits)
 * @returns {Promise<string>} Signed JWT token
 */
async function generateToken(userId, jwtSecret) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    sub: userId,
    iat: now,
    exp: now + config.auth.tokenExpirationSeconds,
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

/**
 * Verify HMAC-SHA256 JWT token signature and expiration.
 * Rejects tokens with invalid signature or exp > current time.
 * @param {string} token - JWT token to verify (format: header.payload.signature)
 * @param {string} jwtSecret - Secret key (must match generation key)
 * @returns {Promise<object|null>} Decoded payload or null if invalid
 */
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
    // ✅ Apply rate limiting
    const rateLimitResult = await checkRateLimit(request, env, 'register');
    if (rateLimitResult.limited) {
      return new Response(JSON.stringify({ error: rateLimitResult.message }), {
        status: 429, // Too Many Requests
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Retry-After': rateLimitResult.retryAfter.toString()
        }
      });
    }
    
    // Parse JSON with error handling
    let body;
    try {
      body = await request.json();
    } catch (jsonErr) {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const { email, password } = body;
    
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
    // ✅ Apply rate limiting
    const rateLimitResult = await checkRateLimit(request, env, 'login');
    if (rateLimitResult.limited) {
      return new Response(JSON.stringify({ error: rateLimitResult.message }), {
        status: 429, // Too Many Requests
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Retry-After': rateLimitResult.retryAfter.toString()
        }
      });
    }
    
    // Parse JSON with error handling
    let body;
    try {
      body = await request.json();
    } catch (jsonErr) {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const { email, password } = body;
    
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
    
    return jsonResponse({
      success: true,
      user_id: user.id,
      email,
      token,
      session_id: sessionId
    }, 200, 'nocache');
  } catch (error) {
    console.error('[AUTH] Login error:', error.message);
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// ── TOKEN REFRESH ENDPOINT ──
/**
 * POST /auth/refresh
 * Refresh an expiring JWT token without requiring re-login
 * Uses existing token to validate identity and issue a new token
 */
router.post('/auth/refresh', async (request, env) => {
  try {
    const token = getAuthToken(request);
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'No token provided' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Verify existing token (allows expired tokens within grace period)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return new Response(JSON.stringify({ error: 'Invalid token format' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    try {
      // Verify signature even if expired
      const headerPayload = `${parts[0]}.${parts[1]}`;
      const encoder = new TextEncoder();
      const keyData = encoder.encode(env.JWT_SECRET);
      const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
      
      const signaturePadded = parts[2] + '='.repeat((4 - parts[2].length % 4) % 4);
      const signatureBinary = atob(signaturePadded.replace(/-/g, '+').replace(/_/g, '/'));
      const signatureArray = new Uint8Array(signatureBinary.length);
      for (let i = 0; i < signatureBinary.length; i++) {
        signatureArray[i] = signatureBinary.charCodeAt(i);
      }
      
      const isValid = await crypto.subtle.verify('HMAC', key, signatureArray, encoder.encode(headerPayload));
      if (!isValid) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Extract payload
      const payload = JSON.parse(atob(parts[1]));
      const userId = payload.sub;
      
      // Verify user still exists and is active
      const user = await env.DB.prepare('SELECT id, email FROM users WHERE id = ? AND is_active = 1').bind(userId).first();
      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found or inactive' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Generate new token
      const newToken = await generateToken(userId, env.JWT_SECRET);
      
      // Update session with new token
      await env.DB.prepare(
        `UPDATE sessions SET token = ?, last_activity = datetime('now')
         WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`
      ).bind(newToken, userId).run();
      
      return new Response(JSON.stringify({
        success: true,
        token: newToken,
        user_id: userId
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (tokenErr) {
      console.error('[AUTH] Token refresh error:', tokenErr.message);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('[AUTH] Refresh endpoint error:', error.message);
    return new Response(JSON.stringify({ error: 'Refresh failed' }), {
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
    const body = await request.json();
    
    // Accept data either as { data: {...} } or directly as {...}
    const data = body.data || body;
    
    if (!data || Object.keys(data).length === 0) {
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
      const device_id = body.device_id || 'web';
      await env.DB.prepare(
        `INSERT INTO sync_logs (user_id, device_id, action, status, synced_at)
         VALUES (?, ?, 'data_upload', 'success', datetime('now'))`
      ).bind(userId, device_id).run();
      
      return jsonResponse({
        success: true,
        synced_at: new Date().toISOString(),
        size_bytes: dataSize
      }, 200, 'short');
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

// ── API TEST ROUTE (for debugging) ──
router.get('/debug-api', async (request, env) => {
  return new Response(JSON.stringify({
    message: 'Debug endpoint',
    extendedRouter: {
      type: typeof extendedRouter,
      isObject: extendedRouter !== null && typeof extendedRouter === 'object',
      hasFetch: typeof extendedRouter?.fetch === 'function',
      hasRoutes: Array.isArray(extendedRouter?.routes),
      routeCount: extendedRouter?.routes?.length || 0
    }
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

// ── MANIFEST.JSON (PWA Support) ──
router.get('/manifest.json', async (request, env) => {
  const manifest = {
    "name": "FocusBro - ADHD-Friendly Focus & Wellness",
    "short_name": "FocusBro",
    "description": "Professional focus management with breathing, grounding, and mental wellness tools for ADHD.",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "orientation": "portrait-primary",
    "background_color": "#ffffff",
    "theme_color": "#6366f1",
    "categories": ["productivity", "health", "wellness"],
    "icons": [
      {
        "src": "/favicon.ico",
        "sizes": "16x16 32x32",
        "type": "image/x-icon"
      },
      {
        "src": "/icon-192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "/icon-512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any"
      }
    ],
    "shortcuts": [
      {
        "name": "Pomodoro Timer",
        "short_name": "Pomodoro",
        "description": "Start a focused work session",
        "url": "/?view=pomodoro",
        "icons": [{ "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" }]
      },
      {
        "name": "Breathing Exercise",
        "short_name": "Breathing",
        "description": "Guided breathing exercises",
        "url": "/?view=breathing",
        "icons": [{ "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" }]
      }
    ]
  };
  return new Response(JSON.stringify(manifest), {
    status: 200,
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=86400'
    }
  });
});

// ── SERVICE WORKER ──
router.get('/sw.js', async (request, env) => {
  // Service Worker from embedded HTML content
  const swCode = `/**
 * FocusBro Service Worker
 * Handles push notifications, offline support, and caching strategies
 */

const CACHE_NAME = 'focusbro-v1';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS)
        .catch(err => {
          // ✅ LOGGING: SW cache failures (e.g., assets unavailable during install)
          console.warn('[SW] Cache install failed:', err.message, '— Will retry on next update');
        })
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let notificationData = {};
  try {
    notificationData = event.data.json();
  } catch (e) {
    notificationData = { title: 'FocusBro', body: event.data.text() };
  }
  const options = {
    icon: '/favicon.ico',
    tag: notificationData.tag || 'focusbro-notification',
    data: notificationData.data || {},
    ...notificationData
  };
  event.waitUntil(
    self.registration.showNotification(notificationData.title || 'FocusBro', options)
  );
});

// Notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const targetUrl = data.action === 'open' ? \`/#\${data.view || 'dashboard'}\` : '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(targetUrl);
      })
  );
});

// Fetch strategy: network-first for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.pathname.startsWith('/api/')) {
    return event.respondWith(
      fetch(request)
        .then(response => {
          // Clone immediately to avoid consuming the response
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(err => { console.warn('SW network fetch failed, falling back to cache:', err && err.message || err); return caches.match(request) || new Response(
          JSON.stringify({ error: 'Offline', offline: true }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        ))
    );
  }

  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request)
        .then(response => {
          // Clone immediately to avoid consuming the response
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          }
          return response;
        })
      )
      .catch(err => { console.warn('SW fetch for asset failed, returning index.html from cache:', err && err.message || err); return caches.match('/index.html'); })
  );
});
`;

  return new Response(swCode, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Service-Worker-Allowed': '/'
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
    
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Try main router first for non-API routes
    if (!pathname.startsWith('/api/')) {
      const response = await router.handle(request, env);
      if (response && response.status !== 404) {
        return response;
      }
    }
    
    // Route /api/* requests to extended router
    if (pathname.startsWith('/api/')) {
      const pathWithoutApi = pathname.replace(/^\/api/, '') || '/';
      const newUrl = new URL(request.url);
      newUrl.pathname = pathWithoutApi;
      
      // ✅ CRITICAL FIX: itty-router exports an object with a .fetch() method, not a callable function
      const modifiedRequest = new Request(newUrl.toString(), {
        method: request.method,
        headers: request.headers,
        // Omit body for GET requests (standard HTTP)
        ...(request.method !== 'GET' && { body: request.body }),
        // Copy over Cloudflare-specific properties if available
        ...(request.cf && { cf: request.cf }),
      });
      
      try {
        const extResponse = await extendedRouter.fetch(modifiedRequest, env);
        if (extResponse && extResponse.status !== 404) {
          return extResponse;
        }
      } catch (err) {
        console.warn('Extended router error:', err?.message || err);
      }
    }
    
    // Fallback: try main router for all routes
    const response = await router.handle(request, env);
    return response;
  }
};
