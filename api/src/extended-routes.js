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
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ── CORS PREFLIGHT ──
router.options('*', () => new Response(null, { headers: corsHeaders }));

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
       WHERE user_id = ? AND is_active = 1`
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
       WHERE id = ? AND is_active = 1`
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
    
    // Invalidate all sessions
    await env.DB.prepare(
      'UPDATE sessions SET is_active = 0 WHERE user_id = ? AND id != ?'
    ).bind(userId, auth.sessionId).run();
    
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
      'SELECT id FROM users WHERE email = ? AND is_active = 1'
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
    
    // Invalidate all sessions
    await env.DB.prepare(
      'UPDATE sessions SET is_active = 0 WHERE user_id = ?'
    ).bind(userId).run();
    
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
      `SELECT id, device_id, device_name, created_at, last_activity
       FROM sessions 
       WHERE user_id = ? AND is_active = 1
       ORDER BY last_activity DESC`
    ).bind(userId).all();
    
    return successResponse({
      devices: sessions.results || []
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
    
    // Verify ownership
    const session = await env.DB.prepare(
      'SELECT user_id FROM sessions WHERE device_id = ? AND is_active = 1'
    ).bind(deviceId).first();
    
    if (!session || session.user_id !== userId) {
      return errorResponse('Device not found or unauthorized', 404);
    }
    
    // Delete session
    await env.DB.prepare(
      'UPDATE sessions SET is_active = 0 WHERE device_id = ?'
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
    await env.DB.prepare(
      'UPDATE sessions SET is_active = 0 WHERE user_id = ?'
    ).bind(userId).run();
    
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
      'UPDATE users SET is_active = 0, updated_at = datetime("now") WHERE id = ?'
    ).bind(userId).run();
    
    // Invalidate all sessions
    await env.DB.prepare(
      'UPDATE sessions SET is_active = 0 WHERE user_id = ?'
    ).bind(userId).run();
    
    await logEvent(env, userId, 'account_deleted', {});
    
    return successResponse({
      message: 'Account has been deleted'
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ── 404 FALLBACK ──
router.all('*', () => errorResponse('Not found', 404));

export default router;
