/**
 * API Routes for FocusBro
 * Main Cloudflare Workers entry point
 */

import { Router } from 'itty-router';
import { hashPassword, verifyPassword, generateSessionToken, isValidEmail, isStrongPassword } from './auth.js';
import { initializeDatabase, users, sessions, focusSessions, dailyStats, goals } from './db.js';
import { v4 as uuidv4 } from 'uuid';

// Create router
const router = Router();

// Middleware for CORS and JSON
router.all('*', async (request, env, ctx) => {
  ctx.passThroughOnException();
  // CORS headers will be added in response helper
});

// Helper to generate UUID
function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
}

// Helper for JSON responses
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// Helper for error responses
function error(message, status = 400) {
  return json({ error: message }, status);
}

// Helper to get auth user from request
async function getAuthUser(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  const session = await sessions.getByToken(env.DB, token);
  
  if (!session) {
    return null;
  }
  
  return {
    userId: session.user_id,
    email: session.email,
    displayName: session.display_name,
    token: session.token
  };
}

// ============ AUTH ENDPOINTS ============

// POST /auth/register
router.post('/auth/register', async (request, env) => {
  try {
    const body = await request.json();
    const { email, password, displayName } = body;
    
    // Validation
    if (!email || !password) {
      return error('Email and password are required');
    }
    
    if (!isValidEmail(email)) {
      return error('Invalid email format');
    }
    
    if (!isStrongPassword(password)) {
      return error('Password must be at least 8 characters with uppercase, lowercase, and number');
    }
    
    // Check if user exists
    const existing = await users.getByEmail(env.DB, email);
    if (existing) {
      return error('User already exists', 409);
    }
    
    // Create user
    const userId = generateId();
    const passwordHash = await hashPassword(password);
    
    await users.create(env.DB, userId, email, passwordHash, displayName);
    
    // Create session
    const sessionToken = generateSessionToken();
    await sessions.create(env.DB, sessionToken, userId);
    
    return json({
      user: {
        id: userId,
        email,
        displayName: displayName || email.split('@')[0]
      },
      token: sessionToken
    }, 201);
  } catch (err) {
    console.error('Registration error:', err);
    return error('Internal server error', 500);
  }
});

// POST /auth/login
router.post('/auth/login', async (request, env) => {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return error('Email and password are required');
    }
    
    // Get user
    const user = await users.getByEmail(env.DB, email);
    if (!user) {
      return error('Invalid email or password', 401);
    }
    
    // Verify password
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return error('Invalid email or password', 401);
    }
    
    // Create session
    const sessionToken = generateSessionToken();
    await sessions.create(env.DB, sessionToken, user.id);
    
    return json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name
      },
      token: sessionToken
    });
  } catch (err) {
    console.error('Login error:', err);
    return error('Internal server error', 500);
  }
});

// POST /auth/logout
router.post('/auth/logout', async (request, env) => {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return error('Unauthorized', 401);
    }
    
    await sessions.delete(env.DB, user.token);
    
    return json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    return error('Internal server error', 500);
  }
});

// GET /auth/me
router.get('/auth/me', async (request, env) => {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return error('Unauthorized', 401);
    }
    
    return json({
      user: {
        id: user.userId,
        email: user.email,
        displayName: user.displayName
      }
    });
  } catch (err) {
    console.error('Auth check error:', err);
    return error('Internal server error', 500);
  }
});

// ============ FOCUS SESSIONS ENDPOINTS ============

// POST /focus-sessions
router.post('/focus-sessions', async (request, env) => {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return error('Unauthorized', 401);
    }
    
    const body = await request.json();
    const { durationMinutes, category, notes } = body;
    
    if (!durationMinutes || durationMinutes < 1) {
      return error('Duration must be at least 1 minute');
    }
    
    const sessionId = generateId();
    await focusSessions.create(env.DB, sessionId, user.userId, durationMinutes, category, notes);
    
    return json({
      id: sessionId,
      userId: user.userId,
      durationMinutes,
      category,
      notes,
      completed: false,
      startedAt: new Date().toISOString()
    }, 201);
  } catch (err) {
    console.error('Create session error:', err);
    return error('Internal server error', 500);
  }
});

// POST /focus-sessions/:id/complete
router.post('/focus-sessions/:id/complete', async (request, env) => {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return error('Unauthorized', 401);
    }
    
    const { id } = request.params;
    const session = await focusSessions.getById(env.DB, id);
    
    if (!session || session.user_id !== user.userId) {
      return error('Session not found', 404);
    }
    
    await focusSessions.complete(env.DB, id);
    
    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    const today_sessions = await focusSessions.getTodaySessions(env.DB, user.userId);
    const totalMinutes = today_sessions.reduce((sum, s) => sum + (s.completed ? s.duration_minutes : 0), 0);
    const sessionsCompleted = today_sessions.filter(s => s.completed).length;
    
    await dailyStats.upsert(env.DB, generateId(), user.userId, today, {
      totalFocusMinutes: totalMinutes,
      sessionsCompleted: sessionsCompleted
    });
    
    return json({ success: true });
  } catch (err) {
    console.error('Complete session error:', err);
    return error('Internal server error', 500);
  }
});

// GET /focus-sessions
router.get('/focus-sessions', async (request, env) => {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return error('Unauthorized', 401);
    }
    
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    const sessionsData = await focusSessions.getByUser(env.DB, user.userId, limit, offset);
    
    return json({
      sessions: sessionsData,
      limit,
      offset
    });
  } catch (err) {
    console.error('Get sessions error:', err);
    return error('Internal server error', 500);
  }
});

// ============ DAILY STATS ENDPOINTS ============

// GET /stats/today
router.get('/stats/today', async (request, env) => {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return error('Unauthorized', 401);
    }
    
    const today = new Date().toISOString().split('T')[0];
    const sessionsData = await focusSessions.getTodaySessions(env.DB, user.userId);
    
    const totalMinutes = sessionsData.reduce((sum, s) => sum + (s.completed ? s.duration_minutes : 0), 0);
    const sessionsCompleted = sessionsData.filter(s => s.completed).length;
    
    return json({
      date: today,
      totalFocusMinutes: totalMinutes,
      sessionsCompleted: sessionsCompleted,
      sessions: sessionsData
    });
  } catch (err) {
    console.error('Get today stats error:', err);
    return error('Internal server error', 500);
  }
});

// GET /stats/range
router.get('/stats/range', async (request, env) => {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return error('Unauthorized', 401);
    }
    
    const url = new URL(request.url);
    const startDate = url.searchParams.get('start');
    const endDate = url.searchParams.get('end');
    
    if (!startDate || !endDate) {
      return error('start and end query parameters are required');
    }
    
    const statsData = await dailyStats.getByDateRange(env.DB, user.userId, startDate, endDate);
    
    return json({
      startDate,
      endDate,
      stats: statsData
    });
  } catch (err) {
    console.error('Get stats range error:', err);
    return error('Internal server error', 500);
  }
});

// ============ GOALS ENDPOINTS ============

// POST /goals
router.post('/goals', async (request, env) => {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return error('Unauthorized', 401);
    }
    
    const body = await request.json();
    const { title, description, targetMinutes, deadline } = body;
    
    if (!title) {
      return error('Title is required');
    }
    
    const goalId = generateId();
    await goals.create(env.DB, goalId, user.userId, title, description, targetMinutes, deadline);
    
    return json({
      id: goalId,
      userId: user.userId,
      title,
      description,
      targetMinutes,
      deadline,
      status: 'active'
    }, 201);
  } catch (err) {
    console.error('Create goal error:', err);
    return error('Internal server error', 500);
  }
});

// GET /goals
router.get('/goals', async (request, env) => {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return error('Unauthorized', 401);
    }
    
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'active';
    
    const goalsData = await goals.getByUser(env.DB, user.userId, status);
    
    return json({ goals: goalsData });
  } catch (err) {
    console.error('Get goals error:', err);
    return error('Internal server error', 500);
  }
});

// PUT /goals/:id
router.put('/goals/:id', async (request, env) => {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return error('Unauthorized', 401);
    }
    
    const body = await request.json();
    const { id } = request.params;
    
    await goals.update(env.DB, id, body);
    
    return json({ success: true });
  } catch (err) {
    console.error('Update goal error:', err);
    return error('Internal server error', 500);
  }
});

// DELETE /goals/:id
router.delete('/goals/:id', async (request, env) => {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return error('Unauthorized', 401);
    }
    
    const { id } = request.params;
    
    await goals.delete(env.DB, id);
    
    return json({ success: true });
  } catch (err) {
    console.error('Delete goal error:', err);
    return error('Internal server error', 500);
  }
});

// ============ OPTIONS FOR CORS ============
router.options('*', () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
});

// ============ 404 HANDLER ============
router.all('*', () => {
  return error('Not found', 404);
});

// ============ WORKER EXPORT ============
export default {
  async fetch(request, env, ctx) {
    // Initialize database on first request
    if (!env.dbInitialized) {
      await initializeDatabase(env.DB);
      env.dbInitialized = true;
    }
    
    return router.handle(request, env, ctx);
  }
};
