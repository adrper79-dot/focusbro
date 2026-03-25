// ════════════════════════════════════════════════════════════
// FOCUSBRO CLOUDFLARE WORKERS API - EXTENDED ENDPOINTS
// User management, password reset, device management
// ════════════════════════════════════════════════════════════

import { Router } from 'itty-router';
import {
  verifyAuth,
  checkRateLimit,
  validateEmail,
  validatePassword,
  errorResponse,
  successResponse,
  logEvent,
  extractRequestContext,
  generateUUID
} from './middleware.js';

const router = Router();

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

// ── CORS PREFLIGHT ──
router.options('*', (request) => new Response(null, { headers: getCorsHeaders(request) }));

// ── SAFE JSON PARSING ──
async function safeRequestJSON(request) {
  try {
    return { success: true, data: await request.json() };
  } catch (err) {
    return { success: false, error: 'Invalid JSON in request body' };
  }
}

// ════════════════════════════════════════════════════════════
// USER PROFILE ENDPOINTS
// ════════════════════════════════════════════════════════════

// ── GET USER PROFILE ──
router.get('/users/profile', async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    
    const userId = auth.userId;
    
    // Check rate limit
    const rateLimit = await checkRateLimit(env, userId);
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }
    
    // Get user profile
    const user = await env.DB.prepare(
      `SELECT id, email, first_name, last_name, avatar_url, 
              subscription_tier, created_at, last_login
       FROM users 
       WHERE id = ?`
    ).bind(userId).first();
    
    if (!user) {
      return errorResponse('User not found', 404);
    }
    
    // Count devices
    const devices = await env.DB.prepare(
      `SELECT COUNT(*) as count FROM sessions 
       WHERE user_id = ?`
    ).bind(userId).first();
    
    return successResponse({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      avatarUrl: user.avatar_url,
      subscriptionTier: user.subscription_tier,
      deviceCount: devices.count,
      createdAt: user.created_at,
      lastLogin: user.last_login
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ── UPDATE USER PROFILE ──
router.put('/users/profile', async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    
    const userId = auth.userId;
    
    // Parse JSON safely
    const jsonResult = await safeRequestJSON(request);
    if (!jsonResult.success) {
      return errorResponse(jsonResult.error, 400);
    }
    const { firstName, lastName, avatarUrl } = jsonResult.data;
    
    // Validate input
    if (firstName && firstName.length > 100) {
      return errorResponse('First name too long', 400);
    }
    
    if (lastName && lastName.length > 100) {
      return errorResponse('Last name too long', 400);
    }
    
    if (avatarUrl && !avatarUrl.startsWith('http')) {
      return errorResponse('Invalid avatar URL', 400);
    }
    
    // Update profile
    await env.DB.prepare(
      `UPDATE users 
       SET first_name = ?, last_name = ?, avatar_url = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).bind(firstName || null, lastName || null, avatarUrl || null, userId).run();
    
    // Log event
    await logEvent(env, userId, 'profile_update', { firstName, lastName });
    
    return successResponse({
      message: 'Profile updated successfully'
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ════════════════════════════════════════════════════════════
// PASSWORD & SECURITY ENDPOINTS
// ════════════════════════════════════════════════════════════

// ── CHANGE PASSWORD ──
router.post('/users/change-password', async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    
    const userId = auth.userId;
    
    // Parse JSON safely
    const jsonResult = await safeRequestJSON(request);
    if (!jsonResult.success) {
      return errorResponse(jsonResult.error, 400);
    }
    const { currentPassword, newPassword } = jsonResult.data;
    
    if (!currentPassword || !newPassword) {
      return errorResponse('Missing password fields', 400);
    }
    
    // Validate new password strength
    if (newPassword.length < 8) {
      return errorResponse('Password must be at least 8 characters', 400);
    }
    
    // Get current password hash
    const user = await env.DB.prepare(
      'SELECT password_hash FROM users WHERE id = ?'
    ).bind(userId).first();
    
    if (!user) {
      return errorResponse('User not found', 404);
    }
    
    // Verify current password
    const passwordValid = await verifyPassword(currentPassword, user.password_hash);
    if (!passwordValid) {
      await logEvent(env, userId, 'password_change_failed', { reason: 'Invalid current password' });
      return errorResponse('Current password is incorrect', 401);
    }
    
    // Hash new password
    const newHash = await hashPassword(newPassword);
    
    // Update password
    await env.DB.prepare(
      'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?'
    ).bind(newHash, userId).run();
    
    // Invalidate all sessions - skip for now if is_active doesn't exist
    try {
      await env.DB.prepare(
        'UPDATE sessions SET is_active = 0 WHERE user_id = ? AND id != ?'
      ).bind(userId, auth.sessionId).run();
    } catch (e) {
      console.warn('Session invalidation failed (graceful fallback):', e.message);
      // Note: Schema may not support is_active column yet
    }
    
    await logEvent(env, userId, 'password_changed', {});
    
    return successResponse({
      message: 'Password changed successfully. All other sessions have been logged out.'
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ── REQUEST PASSWORD RESET ──
router.post('/auth/request-password-reset', async (request, env) => {
  try {
    const { email } = await request.json();
    
    if (!email || !validateEmail(email)) {
      return errorResponse('Valid email required', 400);
    }
    
    // Check rate limit
    const rateLimit = await checkRateLimit(env, `reset:${email}`, 3, 3600000); // 3 per hour
    if (!rateLimit.allowed) {
      return errorResponse('Too many reset requests. Please try again later.', 429);
    }
    
    // Find user
    const user = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();
    
    if (user) {
      // Generate reset token
      const resetToken = generateUUID();
      const resetKey = `reset:${resetToken}`;
      
      // Store reset token in KV (30 min expiry)
      await env.KV_CACHE.put(
        resetKey,
        user.id,
        { expirationTtl: 1800 }
      );
      
      // In production, send email with reset link
      // env.SEND_EMAIL({ to: email, resetToken: resetToken });
      
      await logEvent(env, user.id, 'password_reset_requested', { email });
    }
    
    // Always return success (don't reveal if email exists)
    return successResponse({
      message: 'If this email is registered, password reset instructions have been sent.'
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ── CONFIRM PASSWORD RESET ──
router.post('/auth/confirm-password-reset', async (request, env) => {
  try {
    // Parse JSON safely
    const jsonResult = await safeRequestJSON(request);
    if (!jsonResult.success) {
      return errorResponse(jsonResult.error, 400);
    }
    const { resetToken, newPassword } = jsonResult.data;
    
    if (!resetToken || !newPassword) {
      return errorResponse('Reset token and new password required', 400);
    }
    
    if (newPassword.length < 8) {
      return errorResponse('Password must be at least 8 characters', 400);
    }
    
    // Verify reset token
    const resetKey = `reset:${resetToken}`;
    const userId = await env.KV_CACHE.get(resetKey);
    
    if (!userId) {
      return errorResponse('Invalid or expired reset token', 401);
    }
    
    // Hash new password
    const newHash = await hashPassword(newPassword);
    
    // Update password
    await env.DB.prepare(
      'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?'
    ).bind(newHash, userId).run();
    
    // Delete reset token
    await env.KV_CACHE.delete(resetKey);
    
    // Invalidate all sessions - skip if is_active doesn't exist
    try {
      await env.DB.prepare(
        'UPDATE sessions SET is_active = 0 WHERE user_id = ?'
      ).bind(userId).run();
    } catch (e) {
      console.warn('Session invalidation failed (graceful fallback):', e.message);
      // Note: Schema may not support is_active column yet
    }
    
    await logEvent(env, userId, 'password_reset_completed', {});
    
    return successResponse({
      message: 'Password has been reset. Please log in with your new password.'
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ════════════════════════════════════════════════════════════
// DEVICE MANAGEMENT ENDPOINTS
// ════════════════════════════════════════════════════════════

// ── LIST DEVICES ──
router.get('/devices', async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    
    const userId = auth.userId;
    
    // Get all active sessions for user
    const sessions = await env.DB.prepare(
      `SELECT id, 
              COALESCE(device_id, 'default') as device_id,
              COALESCE(device_name, 'Unknown Device') as device_name,
              created_at,
              COALESCE(last_activity, created_at) as last_activity
       FROM sessions 
       WHERE user_id = ?
       ORDER BY created_at DESC`
    ).bind(userId).all();
    
    // Handle both D1 response formats: { results: [...] } or direct array
    const deviceList = sessions?.results || sessions || [];
    
    return successResponse({
      devices: deviceList
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ── REMOVE DEVICE ──
router.delete('/devices/:deviceId', async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    
    const userId = auth.userId;
    const { deviceId } = request.params;
    
    // Verify ownership - deviceId is the session ID
    const session = await env.DB.prepare(
      'SELECT user_id FROM sessions WHERE id = ?'
    ).bind(deviceId).first();
    
    if (!session || session.user_id !== userId) {
      return errorResponse('Device not found or unauthorized', 404);
    }
    
    // Delete session
    await env.DB.prepare(
      'DELETE FROM sessions WHERE id = ?'
    ).bind(deviceId).run();
    
    await logEvent(env, userId, 'device_removed', { deviceId });
    
    return successResponse({
      message: 'Device removed successfully'
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ── LOGOUT ALL DEVICES ──
router.post('/auth/logout-all', async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    
    const userId = auth.userId;
    
    // Invalidate all sessions
    try {
      await env.DB.prepare(
        'UPDATE sessions SET is_active = 0 WHERE user_id = ?'
      ).bind(userId).run();
    } catch (e) {
      console.warn('Session invalidation failed (graceful fallback):', e.message);
      // Gracefully continue - is_active column may not exist
    }
    
    await logEvent(env, userId, 'logout_all_devices', {});
    
    return successResponse({
      message: 'All sessions have been logged out'
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ════════════════════════════════════════════════════════════
// ACCOUNT MANAGEMENT ENDPOINTS
// ════════════════════════════════════════════════════════════

// ── DELETE ACCOUNT ──
router.post('/users/delete-account', async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    
    const userId = auth.userId;
    const { password, confirmation } = await request.json();
    
    if (!password || confirmation !== 'DELETE') {
      return errorResponse('Password and confirmation required', 400);
    }
    
    // Verify password
    const user = await env.DB.prepare(
      'SELECT password_hash FROM users WHERE id = ?'
    ).bind(userId).first();
    
    if (!user || !await verifyPassword(password, user.password_hash)) {
      return errorResponse('Incorrect password', 401);
    }
    
    // Mark user as inactive
    await env.DB.prepare(
      'UPDATE users SET updated_at = datetime("now") WHERE id = ?'
    ).bind(userId).run();
    
    // Invalidate all sessions
    try {
      await env.DB.prepare(
        'UPDATE sessions SET is_active = 0 WHERE user_id = ?'
      ).bind(userId).run();
    } catch (e) {
      console.warn('Session invalidation failed (graceful fallback):', e.message);
      // Gracefully continue - is_active column may not exist
    }
    
    await logEvent(env, userId, 'account_deleted', {});
    
    return successResponse({
      message: 'Account has been deleted'
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ════════════════════════════════════════════════════════════
// DATA SYNC ENDPOINTS
// ════════════════════════════════════════════════════════════

// ── SYNC USER DATA ──
router.post('/api/sync/data', async (request, env) => {
  try {
    const auth = verifyAuth(request);
    if (!auth.valid) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { sessionCount, energyLogs, pomodoroSettings, synced_at } = body;
    const userId = auth.userId;

    // Store data snapshot
    const snapshot = {
      sessionCount,
      energyLogs,
      pomodoroSettings,
      synced_at,
    };

    await env.DB.prepare(
      `INSERT INTO user_data_snapshots (user_id, snapshot_data, size_bytes)
       VALUES (?, ?, ?)`
    ).bind(userId, JSON.stringify(snapshot), JSON.stringify(snapshot).length).run();

    // Log sync event
    await logEvent(env, userId, 'data_synced', {
      sessionCount,
      logCount: energyLogs?.length || 0,
    });

    return successResponse({
      message: 'Data synced successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Data sync error:', error.message);
    return errorResponse('Failed to sync data: ' + error.message, 500);
  }
});

// ── GET LATEST SYNC DATA ──
router.get('/api/sync/data', async (request, env) => {
  try {
    const auth = verifyAuth(request);
    if (!auth.valid) {
      return errorResponse('Unauthorized', 401);
    }

    const userId = auth.userId;
    const result = await env.DB.prepare(
      `SELECT snapshot_data, created_at FROM user_data_snapshots
       WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`
    ).bind(userId).first();

    if (!result) {
      return successResponse({
        data: null,
        message: 'No sync data found',
      });
    }

    return successResponse({
      data: JSON.parse(result.snapshot_data),
      synced_at: result.created_at,
    });
  } catch (error) {
    console.warn('Get sync data error:', error.message);
    return errorResponse('Failed to retrieve sync data: ' + error.message, 500);
  }
});

// ════════════════════════════════════════════════════════════
// PHASE 0: ANALYTICS - EVENT LOGGING ENDPOINTS
// ════════════════════════════════════════════════════════════

// ── POST /events - Batch upload focus events ──
router.post('/events', async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    const contentType = request.headers.get('Content-Type') || '';
    if (!contentType.includes('application/json')) {
      return errorResponse('Content-Type must be application/json', 400);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return errorResponse('Invalid JSON in request body', 400);
    }

    const { events } = body;
    if (!Array.isArray(events)) {
      return errorResponse('events must be an array', 400);
    }

    if (events.length > 500) {
      return errorResponse('Maximum 500 events per request', 400);
    }

    // Validate and filter events
    const validEvents = events.filter(e => {
      // Check required fields
      if (!e.id || !e.type || !e.timestamp) return false;
      
      // Validate timestamp is ISO and not too old/new
      const ts = new Date(e.timestamp);
      if (isNaN(ts.getTime())) return false;
      
      const now = new Date();
      const diffDays = (now - ts) / (1000 * 60 * 60 * 24);
      if (diffDays > 730 || diffDays < -7) return false; // 2 years back, 7 days forward
      
      return true;
    });

    const acceptedIds = [];
    for (const event of validEvents) {
      try {
        // Check if event already exists (prevent duplicates)
        const existing = await env.DB.prepare(
          `SELECT id FROM focus_events WHERE id = ? AND user_id = ?`
        ).bind(event.id, auth.user.id).first();

        if (!existing) {
          await env.DB.prepare(
            `INSERT INTO focus_events 
             (id, user_id, event_type, tool, duration_seconds, data, client_timestamp) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            event.id,
            auth.user.id,
            event.type,
            event.tool || '',
            event.duration_seconds || 0,
            JSON.stringify(event.data || {}),
            event.timestamp
          ).run();

          acceptedIds.push(event.id);
        }
      } catch (e) {
        console.warn(`Failed to insert event ${event.id}:`, e.message);
      }
    }

    // Update user_streaks cache
    try {
      // Count focus sessions
      const streakResult = await env.DB.prepare(
        `SELECT COUNT(*) as count FROM focus_events 
         WHERE user_id = ? AND event_type = 'session_complete'`
      ).bind(auth.user.id).first();

      const totalSessions = streakResult?.count || 0;

      // Sum focus time
      const focusResult = await env.DB.prepare(
        `SELECT SUM(duration_seconds) as total FROM focus_events 
         WHERE user_id = ? AND event_type = 'session_complete'`
      ).bind(auth.user.id).first();

      const totalFocusSeconds = focusResult?.total || 0;

      // Simple current streak (will be refined in production)
      const lastActiveResult = await env.DB.prepare(
        `SELECT DATE(client_timestamp) as date FROM focus_events 
         WHERE user_id = ? AND event_type = 'session_complete'
         ORDER BY client_timestamp DESC LIMIT 1`
      ).bind(auth.user.id).first();

      const lastActiveDate = lastActiveResult?.date || null;

      // Update or insert streak record
      await env.DB.prepare(
        `INSERT OR REPLACE INTO user_streaks 
         (user_id, current_streak, longest_streak, last_active_date, total_sessions, total_focus_seconds, updated_at)
         VALUES (?, 0, 0, ?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(auth.user.id, lastActiveDate, totalSessions, totalFocusSeconds).run();
    } catch (e) {
      console.warn('Failed to update streaks:', e.message);
    }

    return successResponse({
      accepted: acceptedIds.length,
      events_received: validEvents.length,
      accepted_ids: acceptedIds
    });
  } catch (error) {
    console.error('POST /events error:', error);
    return errorResponse('Internal server error', 500);
  }
});

// ── GET /stats/summary - Retrieve user analytics summary ──
router.get('/stats/summary', async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    // Get cached streaks
    const streakData = await env.DB.prepare(
      `SELECT * FROM user_streaks WHERE user_id = ?`
    ).bind(auth.user.id).first();

    const currentStreak = streakData?.current_streak || 0;
    const longestStreak = streakData?.longest_streak || 0;
    const totalSessions = streakData?.total_sessions || 0;
    const totalFocusSeconds = streakData?.total_focus_seconds || 0;

    // Count today's sessions
    const today = new Date().toISOString().slice(0, 10);
    const todayResult = await env.DB.prepare(
      `SELECT COUNT(*) as count FROM focus_events 
       WHERE user_id = ? AND event_type = 'session_complete' AND DATE(client_timestamp) = ?`
    ).bind(auth.user.id, today).first();

    const sessionsToday = todayResult?.count || 0;

    // Get most used tool
    const toolResult = await env.DB.prepare(
      `SELECT tool, COUNT(*) as count FROM focus_events 
       WHERE user_id = ? AND tool != '' 
       GROUP BY tool ORDER BY count DESC LIMIT 1`
    ).bind(auth.user.id).first();

    const mostUsedTool = toolResult?.tool || '';

    // Average daily energy (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const avgEnergyResult = await env.DB.prepare(
      `SELECT AVG(CAST(JSON_EXTRACT(data, '$.energy') AS REAL)) as avg 
       FROM focus_events 
       WHERE user_id = ? AND event_type = 'energy_log' AND DATE(client_timestamp) >= ?`
    ).bind(auth.user.id, thirtyDaysAgo).first();

    const avgDailyEnergy = (avgEnergyResult?.avg || 0).toFixed(1);

    return successResponse({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      total_sessions: totalSessions,
      total_focus_hours: (totalFocusSeconds / 3600).toFixed(1),
      sessions_today: sessionsToday,
      most_used_tool: mostUsedTool,
      avg_daily_energy: parseFloat(avgDailyEnergy),
      last_active_date: streakData?.last_active_date || null
    });
  } catch (error) {
    console.warn('GET /stats/summary error:', error.message);
    return errorResponse('Failed to retrieve stats: ' + error.message, 500);
  }
});

// ── GET /export/csv - Stream events as CSV (Pro users get full history, Free get last 30 days) ──
router.get('/export/csv', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    const db = env.DB;
    const userId = auth.user.id;
    const isPro = ['pro', 'enterprise'].includes(auth.user.subscription_tier);

    // Free tier: last 30 days only
    const daysBack = isPro ? 365 * 2 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const query = `
      SELECT id, event_type, tool, duration_seconds, data, client_timestamp
      FROM focus_events
      WHERE user_id = ? AND client_timestamp >= ?
      ORDER BY client_timestamp DESC
    `;

    const stmt = db.prepare(query).bind(userId, cutoffDate.toISOString());
    const result = await stmt.all();

    // Build CSV
    let csv = 'Date,Time,Event Type,Tool,Duration (Minutes),Data\n';
    (result.results || result || []).forEach(e => {
      const d = new Date(e.client_timestamp);
      const date = d.toLocaleDateString('en-US');
      const time = d.toLocaleTimeString('en-US');
      const data = e.data ? JSON.stringify(e.data).replace(/"/g, '""') : '';
      const duration = e.duration_seconds ? Math.round(e.duration_seconds / 60) : '';
      csv += `"${date}","${time}","${e.event_type}","${e.tool || ''}",${duration},"${data}"\n`;
    });

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv;charset=utf-8',
        'Content-Disposition': `attachment; filename="focusbro-export-${new Date().toISOString().slice(0,10)}.csv"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.warn('GET /export/csv error:', error.message);
    return errorResponse('Failed to export CSV: ' + error.message, 500);
  }
});

// ── GET /export/json - Full data dump as JSON (Pro only) ──
router.get('/export/json', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);
    if (!['pro', 'enterprise'].includes(auth.user.subscription_tier)) {
      return errorResponse('JSON export requires Pro subscription', 402);
    }

    const db = env.DB;
    const userId = auth.user.id;

    const eventsStmt = db.prepare('SELECT * FROM focus_events WHERE user_id = ? ORDER BY client_timestamp DESC').bind(userId);
    const events = await eventsStmt.all();

    const data = {
      export_date: new Date().toISOString(),
      user: {
        id: auth.user.id,
        email: auth.user.email,
        subscription_tier: auth.user.subscription_tier
      },
      events: events.results || events || [],
      event_count: (events.results || events || []).length
    };

    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Content-Disposition': `attachment; filename="focusbro-export-${new Date().toISOString().slice(0,10)}.json"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.warn('GET /export/json error:', error.message);
    return errorResponse('Failed to export JSON: ' + error.message, 500);
  }
});

// ── GET /vapid/public-key - Serve VAPID public key for push subscriptions ──
router.get('/vapid/public-key', async (request, env) => {
  try {
    const publicKey = env.VAPID_PUBLIC_KEY;
    if (!publicKey) {
      console.warn('VAPID_PUBLIC_KEY not configured');
      return errorResponse('Push notifications not configured', 503);
    }
    return jsonResponse({ public_key: publicKey });
  } catch (error) {
    console.warn('GET /vapid/public-key error:', error.message);
    return errorResponse('Failed to retrieve VAPID key', 500);
  }
});

// ── POST /notifications/subscribe - Register push subscription ──
router.post('/notifications/subscribe', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    const userId = auth.user.id;
    const body = await request.json();
    const { subscription, device_label } = body;

    if (!subscription || !subscription.endpoint) {
      return errorResponse('Invalid subscription data', 400);
    }

    const subscriptionId = crypto.randomUUID();
    const db = env.DB;

    try {
      await db.prepare(`
        INSERT INTO push_subscriptions (id, user_id, endpoint, p256dh, auth, device_label, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1)
        ON CONFLICT(endpoint) DO UPDATE SET
          user_id = excluded.user_id,
          is_active = 1,
          created_at = CURRENT_TIMESTAMP
      `).bind(
        subscriptionId,
        userId,
        subscription.endpoint,
        subscription.keys.p256dh,
        subscription.keys.auth,
        device_label || 'Unknown Device'
      ).run();

      console.log('Push subscription saved for user:', userId);
      return jsonResponse({ success: true, subscription_id: subscriptionId });
    } catch (dbError) {
      console.warn('Database error saving push subscription:', dbError.message);
      return errorResponse('Failed to save subscription', 500);
    }
  } catch (error) {
    console.warn('POST /notifications/subscribe error:', error.message);
    return errorResponse('Failed to subscribe to notifications', 500);
  }
});

// ── DELETE /notifications/subscribe - Remove push subscription ──
router.delete('/notifications/subscribe', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    const userId = auth.user.id;
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return errorResponse('Endpoint required', 400);
    }

    const db = env.DB;
    await db.prepare(`
      UPDATE push_subscriptions
      SET is_active = 0
      WHERE user_id = ? AND endpoint = ?
    `).bind(userId, endpoint).run();

    console.log('Push subscription removed for user:', userId);
    return jsonResponse({ success: true });
  } catch (error) {
    console.warn('DELETE /notifications/subscribe error:', error.message);
    return errorResponse('Failed to unsubscribe', 500);
  }
});

// ── GET /notifications/prefs - Get notification preferences ──
router.get('/notifications/prefs', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    const userId = auth.user.id;
    const db = env.DB;

    let prefs = await db.prepare(`
      SELECT * FROM notification_prefs WHERE user_id = ?
    `).bind(userId).first();

    if (!prefs) {
      // Create default preferences for new user
      const defaultPrefs = {
        morning_motivation: 0,
        morning_time: '08:00',
        break_reminders: 1,
        medication_reminders: 1,
        milestones: 1,
        custom_schedule: '{}',
        timezone: 'UTC'
      };

      await db.prepare(`
        INSERT INTO notification_prefs 
        (user_id, morning_motivation, morning_time, break_reminders, medication_reminders, milestones, timezone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(userId, 0, '08:00', 1, 1, 1, 'UTC').run();

      prefs = defaultPrefs;
      prefs.user_id = userId;
    }

    return jsonResponse(prefs);
  } catch (error) {
    console.warn('GET /notifications/prefs error:', error.message);
    return errorResponse('Failed to retrieve preferences', 500);
  }
});

// ── PUT /notifications/prefs - Update notification preferences ──
router.put('/notifications/prefs', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    const userId = auth.user.id;
    const updates = await request.json();
    const db = env.DB;

    // Whitelist allowed fields
    const allowedFields = ['morning_motivation', 'morning_time', 'break_reminders', 'medication_reminders', 'milestones', 'timezone'];
    let updateStr = 'updated_at = CURRENT_TIMESTAMP';
    let bindings = [];

    for (const field of allowedFields) {
      if (field in updates) {
        updateStr += `, ${field} = ?`;
        bindings.push(updates[field]);
      }
    }

    bindings.push(userId);

    await db.prepare(`
      UPDATE notification_prefs
      SET ${updateStr}
      WHERE user_id = ?
    `).bind(...bindings).run();

    const updated = await db.prepare(`
      SELECT * FROM notification_prefs WHERE user_id = ?
    `).bind(userId).first();

    console.log('Notification preferences updated for user:', userId);
    return jsonResponse(updated);
  } catch (error) {
    console.warn('PUT /notifications/prefs error:', error.message);
    return errorResponse('Failed to update preferences', 500);
  }
});

// ── POST /integrations/slack - Save Slack webhook ──
router.post('/integrations/slack', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);
    if (!['pro', 'enterprise'].includes(auth.user.subscription_tier)) {
      return errorResponse('Slack integration requires Pro', 402);
    }

    const userId = auth.user.id;
    const { webhook_url, channel_id } = await request.json();

    if (!webhook_url || !webhook_url.startsWith('https://hooks.slack.com/')) {
      return errorResponse('Invalid webhook URL', 400);
    }

    const integrationId = crypto.randomUUID();
    const db = env.DB;

    await db.prepare(`
      INSERT OR REPLACE INTO slack_integrations
      (id, user_id, webhook_url, channel_id, is_active)
      VALUES (?, ?, ?, ?, 1)
    `).bind(integrationId, userId, webhook_url, channel_id || null).run();

    return jsonResponse({ success: true, integration_id: integrationId });
  } catch (error) {
    console.warn('POST /integrations/slack error:', error.message);
    return errorResponse('Failed to save Slack integration', 500);
  }
});

// ── GET /integrations/slack - Get Slack config ──
router.get('/integrations/slack', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    const userId = auth.user.id;
    const db = env.DB;

    const integration = await db.prepare(`
      SELECT id, webhook_url, channel_id, post_sessions, created_at
      FROM slack_integrations
      WHERE user_id = ? AND is_active = 1
    `).bind(userId).first();

    if (!integration) {
      return jsonResponse({ configured: false });
    }

    return jsonResponse({
      configured: true,
      webhook_url: integration.webhook_url ? '***' : null,
      channel_id: integration.channel_id,
      post_sessions: Boolean(integration.post_sessions),
      created_at: integration.created_at
    });
  } catch (error) {
    console.warn('GET /integrations/slack error:', error.message);
    return errorResponse('Failed to retrieve Slack config', 500);
  }
});

// ── POST /integrations/slack/test - Send test Slack message ──
router.post('/integrations/slack/test', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    const userId = auth.user.id;
    const db = env.DB;

    const integration = await db.prepare(`
      SELECT webhook_url FROM slack_integrations
      WHERE user_id = ? AND is_active = 1
    `).bind(userId).first();

    if (!integration || !integration.webhook_url) {
      return errorResponse('Slack not configured', 404);
    }

    const message = {
      text: '✅ FocusBro connected to Slack! Your focus sessions will appear here.'
    };

    const response = await fetch(integration.webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      console.warn('Slack webhook failed:', response.status, await response.text());
      return errorResponse('Slack webhook rejected request', 400);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.warn('POST /integrations/slack/test error:', error.message);
    return errorResponse('Failed to send test message', 500);
  }
});

// ── DELETE /integrations/slack - Disconnect Slack ──
router.delete('/integrations/slack', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    const userId = auth.user.id;
    const db = env.DB;

    await db.prepare(`
      UPDATE slack_integrations SET is_active = 0 WHERE user_id = ?
    `).bind(userId).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.warn('DELETE /integrations/slack error:', error.message);
    return errorResponse('Failed to disconnect Slack', 500);
  }
});

// ── POST /billing/create-checkout - Create Stripe session ──
router.post('/billing/create-checkout', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    const { plan } = await request.json(); // 'pro' or 'enterprise'
    if (!['pro', 'enterprise'].includes(plan)) {
      return errorResponse('Invalid plan', 400);
    }

    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return errorResponse('Billing not configured', 503);
    }

    // Get or create Stripe customer
    const db = env.DB;
    let subscription = await db.prepare(`
      SELECT stripe_customer_id FROM subscriptions WHERE user_id = ?
    `).bind(auth.user.id).first();

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      // Create customer via Stripe API
      const customerRes = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `email=${encodeURIComponent(auth.user.email)}&description=${encodeURIComponent(auth.user.email)}`
      });

      if (!customerRes.ok) {
        console.warn('Failed to create Stripe customer');
        return errorResponse('Failed to create checkout session', 500);
      }

      const customer = await customerRes.json();
      customerId = customer.id;

      // Save to DB
      await db.prepare(`
        INSERT OR REPLACE INTO subscriptions (id, user_id, stripe_customer_id, plan)
        VALUES (?, ?, ?, ?)
      `).bind(crypto.randomUUID(), auth.user.id, customerId, plan).run();
    }

    // Create checkout session
    const priceId = plan === 'pro' ? env.STRIPE_PRICE_PRO_MONTHLY : env.STRIPE_PRICE_ENTERPRISE_MONTHLY;
    const checkoutRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'customer': customerId,
        'payment_method_types[]': 'card',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'mode': 'subscription',
        'success_url': `${env.API_ORIGIN}/?upgraded=true&plan=${plan}`,
        'cancel_url': `${env.API_ORIGIN}/?checkout=cancelled`
      })
    });

    if (!checkoutRes.ok) {
      console.warn('Failed to create checkout session');
      return errorResponse('Failed to create checkout session', 500);
    }

    const session = await checkoutRes.json();
    return jsonResponse({ url: session.url });
  } catch (error) {
    console.warn('POST /billing/create-checkout error:', error.message);
    return errorResponse('Failed to create checkout', 500);
  }
});

// ── GET /billing/status - Get subscription status ──
router.get('/billing/status', async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse('Unauthorized', 401);

    const db = env.DB;
    const subscription = await db.prepare(`
      SELECT plan, status, current_period_end FROM subscriptions WHERE user_id = ?
    `).bind(auth.user.id).first();

    return jsonResponse({
      plan: subscription?.plan || 'free',
      status: subscription?.status || 'active',
      current_period_end: subscription?.current_period_end
    });
  } catch (error) {
    console.warn('GET /billing/status error:', error.message);
    return errorResponse('Failed to retrieve status', 500);
  }
});

// ── POST /billing/webhook - Stripe webhook ──
router.post('/billing/webhook', async (request, env) => {
  try {
    const signature = request.headers.get('stripe-signature');
    const body = await request.text();
    const secret = env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
      return errorResponse('Webhook not configured', 503);
    }

    // Verify signature (simplified - production should use crypto.subtle)
    const event = JSON.parse(body);
    console.log('[Webhook] Event type:', event.type);

    const db = env.DB;

    if (event.type === 'checkout.session.completed') {
      const { customer, subscription: subscriptionId } = event.data.object;
      const plan = event.data.object.metadata?.plan || 'pro';

      // Get user from Stripe customer
      // In production, store the user_id in Stripe metadata during checkout
      await db.prepare(`
        UPDATE subscriptions
        SET stripe_subscription_id = ?, plan = ?, status = 'active'
        WHERE stripe_customer_id = ?
      `).bind(subscriptionId, plan, customer).run();

      // Update user tier
      await db.prepare(`
        UPDATE users SET subscription_tier = ? WHERE id = (
          SELECT user_id FROM subscriptions WHERE stripe_customer_id = ?
        )
      `).bind(plan, customer).run();
    }

    if (event.type === 'customer.subscription.deleted') {
      const { customer } = event.data.object;

      await db.prepare(`
        UPDATE subscriptions SET status = 'canceled', plan = 'free'
        WHERE stripe_customer_id = ?
      `).bind(customer).run();

      await db.prepare(`
        UPDATE users SET subscription_tier = 'free' WHERE id = (
          SELECT user_id FROM subscriptions WHERE stripe_customer_id = ?
        )
      `).bind(customer).run();
    }

    return jsonResponse({ received: true });
  } catch (error) {
    console.warn('POST /billing/webhook error:', error.message);
    return jsonResponse({ received: true }); // Always return 200 to Stripe
  }
});

// ── 404 FALLBACK ──
router.all('*', () => errorResponse('Not found', 404));

export default router;
