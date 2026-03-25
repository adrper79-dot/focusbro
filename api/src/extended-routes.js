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
    const { firstName, lastName, avatarUrl } = await request.json();
    
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
    const { currentPassword, newPassword } = await request.json();
    
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
    const { resetToken, newPassword } = await request.json();
    
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

// ── 404 FALLBACK ──
router.all('*', () => errorResponse('Not found', 404));

export default router;
