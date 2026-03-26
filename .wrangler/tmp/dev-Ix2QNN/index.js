var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// .wrangler/tmp/bundle-zsxWKd/checked-fetch.js
var require_checked_fetch = __commonJS({
  ".wrangler/tmp/bundle-zsxWKd/checked-fetch.js"() {
    var urls = /* @__PURE__ */ new Set();
    function checkURL(request, init) {
      const url = request instanceof URL ? request : new URL(
        (typeof request === "string" ? new Request(request, init) : request).url
      );
      if (url.port && url.port !== "443" && url.protocol === "https:") {
        if (!urls.has(url.toString())) {
          urls.add(url.toString());
          console.warn(
            `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
          );
        }
      }
    }
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// .wrangler/tmp/bundle-zsxWKd/middleware-loader.entry.ts
var import_checked_fetch14 = __toESM(require_checked_fetch());

// wrangler-modules-watch:wrangler:modules-watch
var import_checked_fetch = __toESM(require_checked_fetch());

// .wrangler/tmp/bundle-zsxWKd/middleware-insertion-facade.js
var import_checked_fetch12 = __toESM(require_checked_fetch());

// api/src/index.js
var import_checked_fetch9 = __toESM(require_checked_fetch(), 1);

// api/node_modules/itty-router/index.mjs
var import_checked_fetch2 = __toESM(require_checked_fetch(), 1);
var e = /* @__PURE__ */ __name(({ base: e2 = "", routes: t = [], ...o2 } = {}) => ({ __proto__: new Proxy({}, { get: /* @__PURE__ */ __name((o3, s2, r, n) => "handle" == s2 ? r.fetch : (o4, ...a) => t.push([s2.toUpperCase?.(), RegExp(`^${(n = (e2 + o4).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), a, n]) && r, "get") }), routes: t, ...o2, async fetch(e3, ...o3) {
  let s2, r, n = new URL(e3.url), a = e3.query = { __proto__: null };
  for (let [e4, t2] of n.searchParams) a[e4] = a[e4] ? [].concat(a[e4], t2) : t2;
  for (let [a2, c2, i2, l2] of t) if ((a2 == e3.method || "ALL" == a2) && (r = n.pathname.match(c2))) {
    e3.params = r.groups || {}, e3.route = l2;
    for (let t2 of i2) if (null != (s2 = await t2(e3.proxy ?? e3, ...o3))) return s2;
  }
} }), "e");
var o = /* @__PURE__ */ __name((e2 = "text/plain; charset=utf-8", t) => (o2, { headers: s2 = {}, ...r } = {}) => void 0 === o2 || "Response" === o2?.constructor.name ? o2 : new Response(t ? t(o2) : o2, { headers: { "content-type": e2, ...s2.entries ? Object.fromEntries(s2) : s2 }, ...r }), "o");
var s = o("application/json; charset=utf-8", JSON.stringify);
var c = o("text/plain; charset=utf-8", String);
var i = o("text/html");
var l = o("image/jpeg");
var p = o("image/png");
var d = o("image/webp");

// api/src/extended-routes.js
var import_checked_fetch5 = __toESM(require_checked_fetch(), 1);

// api/src/config.js
var import_checked_fetch3 = __toESM(require_checked_fetch(), 1);
var config = {
  // ── Authentication ──
  auth: {
    // JWT token expiration (30 days)
    tokenExpirationSeconds: 30 * 24 * 60 * 60,
    // Max password attempts per IP per window
    maxLoginAttempts: 10,
    // Rate limit window (15 minutes)
    rateLimitWindowSeconds: 15 * 60
  },
  // ── API Validation ──
  api: {
    // Maximum events per batch request
    maxEventsPerRequest: 500,
    // Maximum payload size (1MB)
    maxPayloadSize: 1048576,
    // Valid event types (whitelist)
    validEventTypes: [
      "session_complete",
      "meditation",
      "focus_session",
      "break",
      "energy_log",
      "task_created",
      "task_completed",
      "streak_milestone",
      "medication_logged",
      "movement_completed"
    ],
    // Maximum individual event data size (5KB)
    maxEventDataSize: 5e3,
    // Maximum tool name length
    maxToolNameLength: 50,
    // Maximum duration per session (1 day in seconds)
    maxSessionDuration: 86400,
    // Maximum event age (2 years back)
    maxEventAgeDays: 730,
    // Maximum future event age (7 days forward)
    maxFutureEventDays: 7
  },
  // ── Data Limits ──
  data: {
    // Maximum stored data size per user
    maxUserDataSize: 10485760,
    // 10MB
    // Maximum daily sync operations
    maxSyncsPerDay: 1e3,
    // Pagination limits
    maxPageSize: 100,
    defaultPageSize: 20
  },
  // ── Streaks & Tracking ──
  streaks: {
    // Maximum days to check for streak (no need to iterate beyond 2 years)
    maxStreakLookbackDays: 730,
    // Streak reset hour (UTC)
    streakResetHourUTC: 0
  },
  // ── Error Recovery ──
  retry: {
    // Maximum retry attempts for transient failures
    maxRetries: 3,
    // Base retry delay (ms)
    baseDelayMs: 1e3,
    // Exponential backoff multiplier
    backoffMultiplier: 2
  },
  // ── Timeouts ──
  timeouts: {
    // Database operation timeout (10 seconds)
    dbOperationMs: 1e4,
    // API response timeout (30 seconds)
    apiResponseMs: 3e4,
    // Webhook delivery timeout (15 seconds)
    webhookTimeoutMs: 15e3
  },
  // ── Feature Flags (Per-Tier Access & Experimental Features) ──
  features: {
    // ── Infrastructure Features ──
    webhookRetries: true,
    compression: true,
    caching: false,
    // ── Pro-Only Features ──
    slackIntegration: {
      enabled: true,
      minTier: "pro"
      // 'free', 'pro', 'enterprise'
    },
    advancedAnalytics: {
      enabled: true,
      minTier: "pro"
    },
    customReports: {
      enabled: true,
      minTier: "pro"
    },
    conflictResolution: {
      enabled: false,
      // Experimental
      minTier: "enterprise"
    },
    // ── Experimental Features (Beta) ──
    darkModeApi: {
      enabled: true,
      minTier: "free",
      experimental: true
    },
    offlineSyncV2: {
      enabled: false,
      minTier: "free",
      experimental: true
    },
    aiInsights: {
      enabled: false,
      minTier: "pro",
      experimental: true
    }
  },
  // ── CORS ──
  cors: {
    // Allowed origins (set in production)
    allowedOrigins: [
      "http://localhost:3000",
      "http://localhost:8000",
      "https://focusbro.app",
      "https://www.focusbro.app"
    ]
  },
  // ── Logging ──
  logging: {
    // Enable debug logging (set via DEBUG env var in production)
    debug: false,
    // Will be overridden at runtime from env.DEBUG
    // Log sensitive data (NEVER in production)
    logSensitiveData: false
  }
};
var config_default = config;

// api/src/middleware.js
var import_checked_fetch4 = __toESM(require_checked_fetch(), 1);
async function verifyAuth(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      valid: false,
      error: "Missing or invalid Authorization header"
    };
  }
  const token = authHeader.slice(7);
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid token format (must be 3 parts)" };
    }
    let payload;
    try {
      const decodedPayload = atob(parts[1]);
      payload = JSON.parse(decodedPayload);
    } catch (parseError) {
      return { valid: false, error: "Invalid token payload" };
    }
    const now = Math.floor(Date.now() / 1e3);
    if (payload.exp < now) {
      return { valid: false, error: "Token expired" };
    }
    return {
      valid: true,
      userId: payload.sub,
      token,
      issuedAt: payload.iat,
      expiresAt: payload.exp
    };
  } catch (error) {
    return {
      valid: false,
      error: "Token verification failed"
    };
  }
}
__name(verifyAuth, "verifyAuth");
async function checkRateLimit(env, userId, limit = 100, windowMs = 6e4) {
  const key = `ratelimit:${userId}`;
  const count = await env.KV_CACHE.get(key);
  const currentCount = count ? parseInt(count) : 0;
  if (currentCount >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + windowMs).toISOString()
    };
  }
  await env.KV_CACHE.put(key, (currentCount + 1).toString(), {
    expirationTtl: Math.ceil(windowMs / 1e3)
  });
  return {
    allowed: true,
    remaining: limit - currentCount - 1,
    resetAt: new Date(Date.now() + windowMs).toISOString()
  };
}
__name(checkRateLimit, "checkRateLimit");
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
__name(validateEmail, "validateEmail");
function validatePassword(password) {
  return password && password.length >= 8;
}
__name(validatePassword, "validatePassword");
function errorResponse(message, status = 400, details = null) {
  const body = {
    success: false,
    error: message,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (details) {
    body.details = details;
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(errorResponse, "errorResponse");
function successResponse(data, status = 200) {
  return new Response(JSON.stringify({
    success: true,
    data,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(successResponse, "successResponse");
async function logEvent(env, userId, action, details = {}) {
  try {
    await env.DB.prepare(
      `INSERT INTO audit_logs (user_id, action, status, details, created_at)
       VALUES (?, ?, 'success', ?, datetime('now'))`
    ).bind(userId, action, JSON.stringify(details)).run();
  } catch (error) {
    console.debug("Audit log failed:", error.message);
  }
}
__name(logEvent, "logEvent");
function generateUUID2() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c2) {
    const r = Math.random() * 16 | 0;
    const v = c2 === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
__name(generateUUID2, "generateUUID");

// api/src/extended-routes.js
var router = e();
function getCorsHeaders(request) {
  const origin = request.headers.get("Origin");
  const allowedOrigins = [
    "https://focusbro.net",
    "https://www.focusbro.net"
  ];
  const isDevelopment = false;
  if (isDevelopment) {
    allowedOrigins.push("http://localhost:3000", "http://localhost:8787");
  }
  if (!origin || !allowedOrigins.includes(origin)) {
    return {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
    };
  }
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
  };
}
__name(getCorsHeaders, "getCorsHeaders");
var corsHeaders = getCorsHeaders({ headers: new Headers() });
function validateInput(value, type, opts = {}) {
  const { min = 0, max = 1e3, required = false, maxSize = 1e4 } = opts;
  if (required && (value === null || value === void 0 || value === "")) {
    return { valid: false, error: "Field is required" };
  }
  if (value === null || value === void 0) {
    return { valid: true };
  }
  if (typeof value !== type) {
    return { valid: false, error: `Expected ${type}, got ${typeof value}` };
  }
  if (type === "string") {
    if (value.length < min || value.length > max) {
      return { valid: false, error: `Length must be between ${min} and ${max}` };
    }
  } else if (type === "array") {
    if (value.length < min || value.length > max) {
      return { valid: false, error: `Array length must be between ${min} and ${max}` };
    }
    const size = JSON.stringify(value).length;
    if (size > maxSize) {
      return { valid: false, error: `Data exceeds maximum size of ${maxSize} bytes` };
    }
  } else if (type === "number") {
    if (value < min || value > max) {
      return { valid: false, error: `Number must be between ${min} and ${max}` };
    }
  }
  return { valid: true };
}
__name(validateInput, "validateInput");
function checkTierAccess(userTier, requiredTier) {
  const tierHierarchy = { "free": 0, "pro": 1, "enterprise": 2 };
  const userLevel = tierHierarchy[userTier] ?? 0;
  if (Array.isArray(requiredTier)) {
    return requiredTier.some(
      (tier) => (tierHierarchy[tier] ?? 0) <= userLevel
    );
  }
  const requiredLevel = tierHierarchy[requiredTier] ?? 0;
  return userLevel >= requiredLevel;
}
__name(checkTierAccess, "checkTierAccess");
function isFeatureEnabled(featureName, userTier = "free") {
  const feature = config_default.features[featureName];
  if (!feature) return false;
  if (typeof feature === "boolean") return feature;
  if (feature && typeof feature === "object") {
    if (!feature.enabled) return false;
    if (feature.minTier) {
      return checkTierAccess(userTier, feature.minTier);
    }
    return true;
  }
  return false;
}
__name(isFeatureEnabled, "isFeatureEnabled");
router.options("*", (request) => new Response(null, { headers: getCorsHeaders(request) }));
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(jsonResponse, "jsonResponse");
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
__name(verifyPassword, "verifyPassword");
async function safeRequestJSON(request) {
  try {
    return { success: true, data: await request.json() };
  } catch (err) {
    return { success: false, error: "Invalid JSON in request body" };
  }
}
__name(safeRequestJSON, "safeRequestJSON");
router.get("/users/profile", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    const userId = auth.userId;
    const rateLimit = await checkRateLimit(env, userId);
    if (!rateLimit.allowed) {
      return errorResponse("Rate limit exceeded", 429);
    }
    const user = await env.DB.prepare(
      `SELECT id, email, first_name, last_name, avatar_url, 
              subscription_tier, created_at, last_login
       FROM users 
       WHERE id = ?`
    ).bind(userId).first();
    if (!user) {
      return errorResponse("Profile not found", 404);
    }
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
router.put("/users/profile", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    const userId = auth.userId;
    const jsonResult = await safeRequestJSON(request);
    if (!jsonResult.success) {
      return errorResponse(jsonResult.error, 400);
    }
    const { firstName, lastName, avatarUrl } = jsonResult.data;
    if (firstName !== null && firstName !== void 0) {
      if (typeof firstName !== "string") {
        return errorResponse("firstName must be a string", 400);
      }
      if (firstName.length > 100) {
        return errorResponse("firstName too long (max 100 characters)", 400);
      }
    }
    if (lastName !== null && lastName !== void 0) {
      if (typeof lastName !== "string") {
        return errorResponse("lastName must be a string", 400);
      }
      if (lastName.length > 100) {
        return errorResponse("lastName too long (max 100 characters)", 400);
      }
    }
    if (avatarUrl !== null && avatarUrl !== void 0) {
      if (typeof avatarUrl !== "string") {
        return errorResponse("avatarUrl must be a string", 400);
      }
      if (!avatarUrl.startsWith("http") || avatarUrl.length > 2048) {
        return errorResponse("Invalid avatar URL", 400);
      }
    }
    await env.DB.prepare(
      `UPDATE users 
       SET first_name = ?, last_name = ?, avatar_url = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).bind(firstName || null, lastName || null, avatarUrl || null, userId).run();
    await logEvent(env, userId, "profile_update", { firstName, lastName });
    return successResponse({
      message: "Profile updated successfully"
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});
router.post("/users/change-password", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    const userId = auth.userId;
    const jsonResult = await safeRequestJSON(request);
    if (!jsonResult.success) {
      return errorResponse(jsonResult.error, 400);
    }
    const { currentPassword, newPassword } = jsonResult.data;
    if (typeof currentPassword !== "string" || !currentPassword.trim()) {
      return errorResponse("Current password must be a non-empty string", 400);
    }
    if (typeof newPassword !== "string" || !newPassword) {
      return errorResponse("New password must be a non-empty string", 400);
    }
    if (newPassword.length < 8 || newPassword.length > 256) {
      return errorResponse("New password must be 8-256 characters", 400);
    }
    const user = await env.DB.prepare(
      "SELECT password_hash FROM users WHERE id = ?"
    ).bind(userId).first();
    if (!user) {
      return errorResponse("User not found", 404);
    }
    const passwordValid = await verifyPassword(currentPassword, user.password_hash);
    if (!passwordValid) {
      await logEvent(env, userId, "password_change_failed", { reason: "Invalid current password" });
      return errorResponse("Invalid password", 401);
    }
    const newHash = await hashPassword(newPassword);
    await env.DB.prepare(
      'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?'
    ).bind(newHash, userId).run();
    try {
      await env.DB.prepare(
        "UPDATE sessions SET is_active = 0 WHERE user_id = ? AND id != ?"
      ).bind(userId, auth.sessionId).run();
    } catch (e2) {
      console.warn("Session invalidation failed (graceful fallback):", e2.message);
    }
    await logEvent(env, userId, "password_changed", {});
    return successResponse({
      message: "Password changed successfully. All other sessions have been logged out."
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});
router.post("/auth/request-password-reset", async (request, env) => {
  try {
    const jsonResult = await safeRequestJSON(request);
    if (!jsonResult.success) {
      return errorResponse(jsonResult.error, 400);
    }
    const { email } = jsonResult.data;
    if (!email || typeof email !== "string" || !email.trim()) {
      return errorResponse("Email address required", 400);
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      return errorResponse("Valid email required", 400);
    }
    const rateLimitKey = `reset:${normalizedEmail}`;
    const rateLimit = await checkRateLimit(env, rateLimitKey, 3, 36e5);
    if (!rateLimit.allowed) {
      return successResponse({
        message: "If this email is registered, password reset instructions have been sent. Please check your email."
      });
    }
    const user = await env.DB.prepare(
      "SELECT id FROM users WHERE email = ?"
    ).bind(normalizedEmail).first();
    if (user) {
      const resetToken = generateUUID2();
      const resetKey = `reset:${resetToken}`;
      await env.KV_CACHE.put(
        resetKey,
        user.id,
        { expirationTtl: 1800 }
      );
      if (env.DEBUG) console.log(`Password reset requested for ${normalizedEmail} (token expires in 30 min)`);
      await logEvent(env, user.id, "password_reset_requested", { email: normalizedEmail });
    }
    return successResponse({
      message: "If this email is registered, password reset instructions have been sent. Please check your email."
    });
  } catch (error) {
    console.error("Password reset request error:", error.message);
    return errorResponse("error processing request", 500);
  }
});
router.post("/auth/confirm-password-reset", async (request, env) => {
  try {
    const jsonResult = await safeRequestJSON(request);
    if (!jsonResult.success) {
      return errorResponse(jsonResult.error, 400);
    }
    const { resetToken, newPassword } = jsonResult.data;
    if (typeof resetToken !== "string" || !resetToken.trim()) {
      return errorResponse("Reset token must be a non-empty string", 400);
    }
    if (typeof newPassword !== "string" || !newPassword) {
      return errorResponse("New password must be a non-empty string", 400);
    }
    if (!validatePassword(newPassword)) {
      return errorResponse("Password must be at least 8 characters", 400);
    }
    if (newPassword.length > 256) {
      return errorResponse("Password must be less than 256 characters", 400);
    }
    const cleanToken = resetToken.trim();
    const resetKey = `reset:${cleanToken}`;
    const userId = await env.KV_CACHE.get(resetKey);
    if (!userId) {
      return errorResponse("Invalid or expired reset token", 401);
    }
    if (typeof userId !== "string" || !userId.trim()) {
      if (env.DEBUG) console.warn("Corrupted reset token in KV cache");
      return errorResponse("Invalid or expired token", 401);
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(newPassword);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const newHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    const updateResult = await env.DB.prepare(
      'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?'
    ).bind(newHash, userId).run();
    if (!updateResult.success) {
      if (DEBUG) console.error("[PasswordReset] Database update failed");
      return errorResponse("Failed to reset password", 500);
    }
    await env.KV_CACHE.delete(resetKey);
    try {
      await env.DB.prepare(
        "UPDATE sessions SET is_active = 0 WHERE user_id = ?"
      ).bind(userId).run();
    } catch (e2) {
      console.warn("Session invalidation failed (graceful fallback):", e2.message);
    }
    await logEvent(env, userId, "password_reset_completed", {});
    return successResponse({
      message: "Password has been reset successfully. Please log in with your new password."
    });
  } catch (error) {
    console.error("Password reset confirmation error:", error.message);
    return errorResponse("Failed to reset password", 500);
  }
});
router.get("/devices", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    const userId = auth.userId;
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
    const deviceList = sessions?.results || sessions || [];
    return successResponse({
      devices: deviceList
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});
router.delete("/devices/:deviceId", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    const userId = auth.userId;
    const { deviceId } = request.params;
    const session = await env.DB.prepare(
      "SELECT user_id FROM sessions WHERE id = ?"
    ).bind(deviceId).first();
    if (!session || session.user_id !== userId) {
      return errorResponse("Device not found or unauthorized", 404);
    }
    await env.DB.prepare(
      "DELETE FROM sessions WHERE id = ?"
    ).bind(deviceId).run();
    await logEvent(env, userId, "device_removed", { deviceId });
    return successResponse({
      message: "Device removed successfully"
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});
router.post("/auth/logout-all", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    const userId = auth.userId;
    try {
      await env.DB.prepare(
        "UPDATE sessions SET is_active = 0 WHERE user_id = ?"
      ).bind(userId).run();
    } catch (e2) {
      console.warn("Session invalidation failed (graceful fallback):", e2.message);
    }
    await logEvent(env, userId, "logout_all_devices", {});
    return successResponse({
      message: "All sessions have been logged out"
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});
router.post("/users/delete-account", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }
    const userId = auth.userId;
    const { password, confirmation } = await request.json();
    if (!password || confirmation !== "DELETE") {
      return errorResponse("Password and confirmation required", 400);
    }
    const user = await env.DB.prepare(
      "SELECT password_hash FROM users WHERE id = ?"
    ).bind(userId).first();
    if (!user || !await verifyPassword(password, user.password_hash)) {
      return errorResponse("Incorrect password", 401);
    }
    await env.DB.prepare(
      'UPDATE users SET updated_at = datetime("now") WHERE id = ?'
    ).bind(userId).run();
    try {
      await env.DB.prepare(
        "UPDATE sessions SET is_active = 0 WHERE user_id = ?"
      ).bind(userId).run();
    } catch (e2) {
      console.warn("Session invalidation failed (graceful fallback):", e2.message);
    }
    await logEvent(env, userId, "account_deleted", {});
    return successResponse({
      message: "Account has been deleted"
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});
router.post("/sync/data", async (request, env) => {
  try {
    const auth = verifyAuth(request, env);
    if (!auth.valid) {
      return errorResponse("Unauthorized", 401);
    }
    const body = await request.json();
    const { sessionCount, energyLogs, pomodoroSettings, synced_at } = body;
    const userId = auth.userId;
    const sessionCountValidation = validateInput(sessionCount, "number", {
      min: 0,
      max: 999999,
      required: true
    });
    if (!sessionCountValidation.valid) {
      return errorResponse(`sessionCount: ${sessionCountValidation.error}`, 400);
    }
    const energyLogsValidation = validateInput(energyLogs, "array", {
      min: 0,
      max: 500,
      required: true,
      maxSize: 5e4
    });
    if (!energyLogsValidation.valid) {
      return errorResponse(`energyLogs: ${energyLogsValidation.error}`, 400);
    }
    const pomodoroValidation = validateInput(pomodoroSettings, "object", {
      required: false,
      maxSize: 500
    });
    if (!pomodoroValidation.valid) {
      return errorResponse(`pomodoroSettings: ${pomodoroValidation.error}`, 400);
    }
    if (pomodoroSettings) {
      const durationValidation = validateInput(pomodoroSettings.duration, "number", {
        min: 5,
        max: 60
      });
      if (!durationValidation.valid) {
        return errorResponse(`pomodoroSettings.duration: ${durationValidation.error}`, 400);
      }
      const breakValidation = validateInput(pomodoroSettings.breakDuration, "number", {
        min: 1,
        max: 30
      });
      if (!breakValidation.valid) {
        return errorResponse(`pomodoroSettings.breakDuration: ${breakValidation.error}`, 400);
      }
    }
    if (synced_at) {
      try {
        const ts = new Date(synced_at);
        if (isNaN(ts.getTime())) {
          return errorResponse("Invalid timestamp format", 400);
        }
      } catch (e2) {
        return errorResponse("Invalid timestamp format", 400);
      }
    }
    const snapshot = {
      sessionCount,
      energyLogs,
      pomodoroSettings,
      synced_at
    };
    await env.DB.prepare(
      `INSERT INTO user_data_snapshots (user_id, snapshot_data, size_bytes)
       VALUES (?, ?, ?)`
    ).bind(userId, JSON.stringify(snapshot), JSON.stringify(snapshot).length).run();
    await logEvent(env, userId, "data_synced", {
      sessionCount,
      logCount: energyLogs?.length || 0
    });
    return successResponse({
      message: "Data synced successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.warn("Data sync error:", error.message);
    return errorResponse("Failed to sync data", 500);
  }
});
router.get("/sync/data", async (request, env) => {
  try {
    const auth = verifyAuth(request);
    if (!auth.valid) {
      return errorResponse("Unauthorized", 401);
    }
    const userId = auth.userId;
    const result = await env.DB.prepare(
      `SELECT snapshot_data, created_at FROM user_data_snapshots
       WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`
    ).bind(userId).first();
    if (!result) {
      return successResponse({
        data: null,
        message: "No sync data found"
      });
    }
    return successResponse({
      data: JSON.parse(result.snapshot_data),
      synced_at: result.created_at
    });
  } catch (error) {
    console.warn("Get sync data error:", error.message);
    return errorResponse("Failed to retrieve sync data: " + error.message, 500);
  }
});
router.post("/events", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.includes("application/json")) {
      return errorResponse("Content-Type must be application/json", 400);
    }
    let body;
    try {
      body = await request.json();
    } catch (e2) {
      return errorResponse("Invalid JSON in request body", 400);
    }
    const { events } = body;
    if (!Array.isArray(events)) {
      return errorResponse("events must be an array", 400);
    }
    if (events.length === 0) {
      return errorResponse("events array cannot be empty", 400);
    }
    if (events.length > config_default.api.maxEventsPerRequest) {
      return errorResponse(`Maximum ${config_default.api.maxEventsPerRequest} events per request`, 400);
    }
    const payloadSize = JSON.stringify(body).length;
    if (payloadSize > config_default.api.maxPayloadSize) {
      return errorResponse("Payload too large (max 1MB)", 413);
    }
    const validEvents = events.filter((e2) => {
      if (typeof e2 !== "object" || !e2) return false;
      if (typeof e2.id !== "string" || !e2.id.trim()) return false;
      if (typeof e2.type !== "string" || !e2.type.trim()) return false;
      if (typeof e2.timestamp !== "string") return false;
      if (!config_default.api.validEventTypes.includes(e2.type)) return false;
      const ts = new Date(e2.timestamp);
      if (isNaN(ts.getTime())) return false;
      const now = /* @__PURE__ */ new Date();
      const diffDays = (now - ts) / (1e3 * 60 * 60 * 24);
      if (diffDays > config_default.api.maxEventAgeDays || diffDays < -config_default.api.maxFutureEventDays) return false;
      if (e2.tool && (typeof e2.tool !== "string" || e2.tool.length > config_default.api.maxToolNameLength)) return false;
      if (e2.duration_seconds && (typeof e2.duration_seconds !== "number" || e2.duration_seconds < 0 || e2.duration_seconds > config_default.api.maxSessionDuration)) return false;
      if (e2.data && (typeof e2.data !== "object" || JSON.stringify(e2.data).length > config_default.api.maxEventDataSize)) return false;
      return true;
    });
    const acceptedIds = [];
    for (const event of validEvents) {
      try {
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
            event.tool || "",
            event.duration_seconds || 0,
            JSON.stringify(event.data || {}),
            event.timestamp
          ).run();
          acceptedIds.push(event.id);
        }
      } catch (e2) {
        console.warn(`Failed to insert event ${event.id}:`, e2.message);
      }
    }
    try {
      const streakResult = await env.DB.prepare(
        `SELECT COUNT(*) as count FROM focus_events 
         WHERE user_id = ? AND event_type = 'session_complete'`
      ).bind(auth.user.id).first();
      const totalSessions = streakResult?.count || 0;
      const focusResult = await env.DB.prepare(
        `SELECT SUM(duration_seconds) as total FROM focus_events 
         WHERE user_id = ? AND event_type = 'session_complete'`
      ).bind(auth.user.id).first();
      const totalFocusSeconds = focusResult?.total || 0;
      const lastActiveResult = await env.DB.prepare(
        `SELECT DATE(client_timestamp) as date FROM focus_events 
         WHERE user_id = ? AND event_type = 'session_complete'
         ORDER BY client_timestamp DESC LIMIT 1`
      ).bind(auth.user.id).first();
      const lastActiveDate = lastActiveResult?.date || null;
      await env.DB.prepare(
        `INSERT OR REPLACE INTO user_streaks 
         (user_id, current_streak, longest_streak, last_active_date, total_sessions, total_focus_seconds, updated_at)
         VALUES (?, 0, 0, ?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(auth.user.id, lastActiveDate, totalSessions, totalFocusSeconds).run();
    } catch (e2) {
      console.warn("Failed to update streaks:", e2.message);
    }
    return successResponse({
      accepted: acceptedIds.length,
      accepted_ids: acceptedIds,
      rejected: events.length - validEvents.length
    });
  } catch (error) {
    console.error("POST /events error:", error);
    return errorResponse("Internal server error", 500);
  }
});
router.get("/events", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const url = new URL(request.url);
    const page = Math.max(0, parseInt(url.searchParams.get("page") || "0"));
    const limit = Math.min(500, Math.max(10, parseInt(url.searchParams.get("limit") || "100")));
    const days = parseInt(url.searchParams.get("days") || "30");
    const now = /* @__PURE__ */ new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1e3).toISOString();
    const countResult = await env.DB.prepare(
      `SELECT COUNT(*) as total FROM focus_events 
       WHERE user_id = ? AND client_timestamp >= ?`
    ).bind(auth.user.id, cutoffDate).first();
    const totalItems = countResult?.total || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = page * limit;
    const events = await env.DB.prepare(
      `SELECT * FROM focus_events 
       WHERE user_id = ? AND client_timestamp >= ?
       ORDER BY client_timestamp DESC
       LIMIT ? OFFSET ?`
    ).bind(auth.user.id, cutoffDate, limit, offset).all();
    return successResponse({
      events: events.results || events || [],
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNext: page < totalPages - 1
      }
    });
  } catch (error) {
    console.error("GET /events error:", error);
    return errorResponse("Internal server error", 500);
  }
});
router.get("/stats/summary", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const streakData = await env.DB.prepare(
      `SELECT * FROM user_streaks WHERE user_id = ?`
    ).bind(auth.user.id).first();
    const currentStreak = streakData?.current_streak || 0;
    const longestStreak = streakData?.longest_streak || 0;
    const totalSessions = streakData?.total_sessions || 0;
    const totalFocusSeconds = streakData?.total_focus_seconds || 0;
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const todayResult = await env.DB.prepare(
      `SELECT COUNT(*) as count FROM focus_events 
       WHERE user_id = ? AND event_type = 'session_complete' AND DATE(client_timestamp) = ?`
    ).bind(auth.user.id, today).first();
    const sessionsToday = todayResult?.count || 0;
    const toolResult = await env.DB.prepare(
      `SELECT tool, COUNT(*) as count FROM focus_events 
       WHERE user_id = ? AND tool != '' 
       GROUP BY tool ORDER BY count DESC LIMIT 1`
    ).bind(auth.user.id).first();
    const mostUsedTool = toolResult?.tool || "";
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString().slice(0, 10);
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
    console.warn("GET /stats/summary error:", error.message);
    return errorResponse("Failed to retrieve stats: " + error.message, 500);
  }
});
router.get("/export/csv", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const db = env.DB;
    const userId = auth.user.id;
    const isPro = ["pro", "enterprise"].includes(auth.user.subscription_tier);
    const daysBack = isPro ? 365 * 2 : 30;
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    const query = `
      SELECT id, event_type, tool, duration_seconds, data, client_timestamp
      FROM focus_events
      WHERE user_id = ? AND client_timestamp >= ?
      ORDER BY client_timestamp DESC
    `;
    const stmt = db.prepare(query).bind(userId, cutoffDate.toISOString());
    const result = await stmt.all();
    let csv = "Date,Time,Event Type,Tool,Duration (Minutes),Data\n";
    (result.results || result || []).forEach((e2) => {
      const d2 = new Date(e2.client_timestamp);
      const date = d2.toLocaleDateString("en-US");
      const time = d2.toLocaleTimeString("en-US");
      const data = e2.data ? JSON.stringify(e2.data).replace(/"/g, '""') : "";
      const duration = e2.duration_seconds ? Math.round(e2.duration_seconds / 60) : "";
      csv += `"${date}","${time}","${e2.event_type}","${e2.tool || ""}",${duration},"${data}"
`;
    });
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv;charset=utf-8",
        "Content-Disposition": `attachment; filename="focusbro-export-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.warn("GET /export/csv error:", error.message);
    return errorResponse("Failed to export CSV: " + error.message, 500);
  }
});
router.get("/export/json", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    if (!["pro", "enterprise"].includes(auth.user.subscription_tier)) {
      return errorResponse("JSON export requires Pro subscription", 402);
    }
    const db = env.DB;
    const userId = auth.user.id;
    const eventsStmt = db.prepare("SELECT * FROM focus_events WHERE user_id = ? ORDER BY client_timestamp DESC").bind(userId);
    const events = await eventsStmt.all();
    const data = {
      export_date: (/* @__PURE__ */ new Date()).toISOString(),
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
        "Content-Type": "application/json;charset=utf-8",
        "Content-Disposition": `attachment; filename="focusbro-export-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json"`,
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.warn("GET /export/json error:", error.message);
    return errorResponse("Failed to export JSON: " + error.message, 500);
  }
});
router.get("/vapid/public-key", async (request, env) => {
  try {
    const publicKey = env.VAPID_PUBLIC_KEY;
    if (!publicKey) {
      console.warn("VAPID_PUBLIC_KEY not configured");
      return errorResponse("Push notifications not configured", 503);
    }
    return jsonResponse({ public_key: publicKey });
  } catch (error) {
    console.warn("GET /vapid/public-key error:", error.message);
    return errorResponse("Failed to retrieve VAPID key", 500);
  }
});
router.post("/notifications/subscribe", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const userId = auth.user.id;
    const body = await request.json();
    const { subscription, device_label } = body;
    if (!subscription || !subscription.endpoint) {
      return errorResponse("Invalid subscription data", 400);
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
        device_label || "Unknown Device"
      ).run();
      return jsonResponse({ success: true, subscription_id: subscriptionId });
    } catch (dbError) {
      console.warn("Database error saving push subscription:", dbError.message);
      return errorResponse("Failed to save subscription", 500);
    }
  } catch (error) {
    console.warn("POST /notifications/subscribe error:", error.message);
    return errorResponse("Failed to subscribe to notifications", 500);
  }
});
router.delete("/notifications/subscribe", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const userId = auth.user.id;
    const body = await request.json();
    const { endpoint } = body;
    if (!endpoint) {
      return errorResponse("Endpoint required", 400);
    }
    const db = env.DB;
    await db.prepare(`
      UPDATE push_subscriptions
      SET is_active = 0
      WHERE user_id = ? AND endpoint = ?
    `).bind(userId, endpoint).run();
    return jsonResponse({ success: true });
  } catch (error) {
    console.warn("DELETE /notifications/subscribe error:", error.message);
    return errorResponse("Failed to unsubscribe", 500);
  }
});
router.get("/notifications/prefs", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const userId = auth.user.id;
    const db = env.DB;
    let prefs = await db.prepare(`
      SELECT * FROM notification_prefs WHERE user_id = ?
    `).bind(userId).first();
    if (!prefs) {
      const defaultPrefs = {
        morning_motivation: 0,
        morning_time: "08:00",
        break_reminders: 1,
        medication_reminders: 1,
        milestones: 1,
        custom_schedule: "{}",
        timezone: "UTC"
      };
      await db.prepare(`
        INSERT INTO notification_prefs 
        (user_id, morning_motivation, morning_time, break_reminders, medication_reminders, milestones, timezone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(userId, 0, "08:00", 1, 1, 1, "UTC").run();
      prefs = defaultPrefs;
      prefs.user_id = userId;
    }
    return jsonResponse(prefs);
  } catch (error) {
    console.warn("GET /notifications/prefs error:", error.message);
    return errorResponse("Failed to retrieve preferences", 500);
  }
});
router.put("/notifications/prefs", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const userId = auth.user.id;
    const updates = await request.json();
    const db = env.DB;
    const allowedFields = ["morning_motivation", "morning_time", "break_reminders", "medication_reminders", "milestones", "timezone"];
    let updateStr = "updated_at = CURRENT_TIMESTAMP";
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
    return jsonResponse(updated);
  } catch (error) {
    console.warn("PUT /notifications/prefs error:", error.message);
    return errorResponse("Failed to update preferences", 500);
  }
});
router.post("/integrations/slack", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    if (!checkTierAccess(auth.user.subscription_tier, ["pro", "enterprise"])) {
      return errorResponse("Slack integration requires Pro subscription", 402);
    }
    const userId = auth.user.id;
    const { webhook_url, channel_id } = await request.json();
    if (!webhook_url || !webhook_url.startsWith("https://hooks.slack.com/")) {
      return errorResponse("Invalid webhook URL", 400);
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
    console.warn("POST /integrations/slack error:", error.message);
    return errorResponse("Failed to save Slack integration", 500);
  }
});
router.get("/integrations/slack", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
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
      webhook_url: integration.webhook_url ? "***" : null,
      channel_id: integration.channel_id,
      post_sessions: Boolean(integration.post_sessions),
      created_at: integration.created_at
    });
  } catch (error) {
    console.warn("GET /integrations/slack error:", error.message);
    return errorResponse("Failed to retrieve Slack config", 500);
  }
});
router.post("/integrations/slack/test", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const userId = auth.user.id;
    const db = env.DB;
    const integration = await db.prepare(`
      SELECT webhook_url FROM slack_integrations
      WHERE user_id = ? AND is_active = 1
    `).bind(userId).first();
    if (!integration || !integration.webhook_url) {
      return errorResponse("Slack not configured", 404);
    }
    const message = {
      text: "\u2705 FocusBro connected to Slack! Your focus sessions will appear here."
    };
    const response = await fetch(integration.webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });
    if (!response.ok) {
      console.warn("Slack webhook failed:", response.status, await response.text());
      return errorResponse("Slack webhook rejected request", 400);
    }
    return jsonResponse({ success: true });
  } catch (error) {
    console.warn("POST /integrations/slack/test error:", error.message);
    return errorResponse("Failed to send test message", 500);
  }
});
router.delete("/integrations/slack", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const userId = auth.user.id;
    const db = env.DB;
    await db.prepare(`
      UPDATE slack_integrations SET is_active = 0 WHERE user_id = ?
    `).bind(userId).run();
    return jsonResponse({ success: true });
  } catch (error) {
    console.warn("DELETE /integrations/slack error:", error.message);
    return errorResponse("Failed to disconnect Slack", 500);
  }
});
router.post("/billing/create-checkout", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const { plan } = await request.json();
    if (!["pro", "enterprise"].includes(plan)) {
      return errorResponse("Invalid plan", 400);
    }
    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return errorResponse("Billing not configured", 503);
    }
    const db = env.DB;
    let subscription = await db.prepare(`
      SELECT stripe_customer_id FROM subscriptions WHERE user_id = ?
    `).bind(auth.user.id).first();
    let customerId = subscription?.stripe_customer_id;
    if (!customerId) {
      const customerRes = await fetch("https://api.stripe.com/v1/customers", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `email=${encodeURIComponent(auth.user.email)}&description=${encodeURIComponent(auth.user.email)}`
      });
      if (!customerRes.ok) {
        console.warn("Failed to create Stripe customer");
        return errorResponse("Failed to create checkout session", 500);
      }
      const customer = await customerRes.json();
      customerId = customer.id;
      await db.prepare(`
        INSERT OR REPLACE INTO subscriptions (id, user_id, stripe_customer_id, plan)
        VALUES (?, ?, ?, ?)
      `).bind(crypto.randomUUID(), auth.user.id, customerId, plan).run();
    }
    const priceId = plan === "pro" ? env.STRIPE_PRICE_PRO_MONTHLY : env.STRIPE_PRICE_ENTERPRISE_MONTHLY;
    const checkoutRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        "customer": customerId,
        "payment_method_types[]": "card",
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        "mode": "subscription",
        "success_url": `${env.API_ORIGIN}/?upgraded=true&plan=${plan}`,
        "cancel_url": `${env.API_ORIGIN}/?checkout=cancelled`
      })
    });
    if (!checkoutRes.ok) {
      console.warn("Failed to create checkout session");
      return errorResponse("Failed to create checkout session", 500);
    }
    const session = await checkoutRes.json();
    return jsonResponse({ url: session.url });
  } catch (error) {
    console.warn("POST /billing/create-checkout error:", error.message);
    return errorResponse("Failed to create checkout", 500);
  }
});
router.get("/billing/status", async (request, env) => {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) return errorResponse("Unauthorized", 401);
    const db = env.DB;
    const subscription = await db.prepare(`
      SELECT plan, status, current_period_end FROM subscriptions WHERE user_id = ?
    `).bind(auth.user.id).first();
    return jsonResponse({
      plan: subscription?.plan || "free",
      status: subscription?.status || "active",
      current_period_end: subscription?.current_period_end
    });
  } catch (error) {
    console.warn("GET /billing/status error:", error.message);
    return errorResponse("Failed to retrieve status", 500);
  }
});
router.post("/billing/webhook", async (request, env) => {
  try {
    const signature = request.headers.get("stripe-signature");
    const body = await request.text();
    const secret = env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      console.warn("\u26A0\uFE0F Stripe webhook secret not configured");
      return errorResponse("Webhook not configured", 503);
    }
    if (!signature) {
      console.warn("\u26A0\uFE0F Stripe webhook signature missing");
      return errorResponse("Webhook signature required", 401);
    }
    const encoder = new TextEncoder();
    const timestampedBody = signature.split(",").find((s2) => s2.startsWith("t="))?.slice(2);
    const signatureValue = signature.split(",").find((s2) => s2.startsWith("v1="))?.slice(3);
    if (!timestampedBody || !signatureValue) {
      console.warn("\u26A0\uFE0F Stripe webhook signature format invalid");
      return errorResponse("Invalid webhook signature format", 401);
    }
    const timestamp = parseInt(timestampedBody);
    const now = Math.floor(Date.now() / 1e3);
    if (Math.abs(now - timestamp) > 300) {
      console.warn("\u26A0\uFE0F Stripe webhook timestamp too old:", now - timestamp, "seconds ago");
      return errorResponse("Webhook timestamp expired", 401);
    }
    try {
      const keyData = encoder.encode(secret);
      const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
      const messageData = encoder.encode(`${timestampedBody}.${body}`);
      const signatureBytes = new Uint8Array(signatureValue.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
      const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, messageData);
      if (!isValid) {
        console.warn("\u26A0\uFE0F Stripe webhook signature verification failed");
        return errorResponse("Webhook signature invalid", 401);
      }
    } catch (cryptoError) {
      console.warn("\u26A0\uFE0F Webhook signature verification error:", cryptoError.message);
      return errorResponse("Signature verification failed", 401);
    }
    let event;
    try {
      event = JSON.parse(body);
    } catch (parseError) {
      console.warn("\u26A0\uFE0F Stripe webhook body malformed");
      return errorResponse("Invalid webhook body", 400);
    }
    if (env.DEBUG === "1") {
      console.log("Webhook verified - Event type:", event.type);
    }
    const db = env.DB;
    if (event.type === "checkout.session.completed") {
      const { customer, subscription: subscriptionId } = event.data.object;
      const plan = event.data.object.metadata?.plan || "pro";
      if (!customer || !subscriptionId) {
        console.warn("\u26A0\uFE0F Webhook missing customer or subscription data");
        return jsonResponse({ received: true });
      }
      await db.prepare(`
        UPDATE subscriptions
        SET stripe_subscription_id = ?, plan = ?, status = 'active'
        WHERE stripe_customer_id = ?
      `).bind(subscriptionId, plan, customer).run();
      await db.prepare(`
        UPDATE users SET subscription_tier = ? WHERE id = (
          SELECT user_id FROM subscriptions WHERE stripe_customer_id = ?
        )
      `).bind(plan, customer).run();
      if (env.DEBUG === "1") {
        console.log("Webhook: Subscription updated");
      }
    }
    if (event.type === "customer.subscription.deleted") {
      const { customer } = event.data.object;
      if (!customer) {
        console.warn("\u26A0\uFE0F Webhook missing customer data for subscription.deleted");
        return jsonResponse({ received: true });
      }
      await db.prepare(`
        UPDATE subscriptions SET status = 'canceled', plan = 'free'
        WHERE stripe_customer_id = ?
      `).bind(customer).run();
      await db.prepare(`
        UPDATE users SET subscription_tier = 'free' WHERE id = (
          SELECT user_id FROM subscriptions WHERE stripe_customer_id = ?
        )
      `).bind(customer).run();
      if (env.DEBUG === "1") {
        console.log("Webhook: Subscription canceled");
      }
    }
    return jsonResponse({ received: true });
  } catch (error) {
    console.error("\u274C Webhook processing error:", error.message);
    return jsonResponse({ received: true, error: error.message });
  }
});
router.get("/gallery", async (request, env) => {
  try {
    const url = new URL(request.url);
    const seed = url.searchParams.get("seed") || Math.random().toString();
    let category = url.searchParams.get("category") || "focus";
    const limit = Math.min(20, Math.max(5, parseInt(url.searchParams.get("limit") || "10")));
    const safeKeywords = {
      focus: ["focus work", "concentration", "productivity", "mindfulness", "deep work"],
      adhd: ["neurodiversity", "colorful", "creative chaos", "vibrant energy", "flowing"],
      energy: ["lightning", "electricity", "bright light", "glowing", "power"],
      growth: ["mountain climb", "progress", "success", "achievement", "growth"],
      brain: ["brain circuits", "neurons", "neural", "mind", "intelligence"],
      nature: ["forest", "water", "calm nature", "peaceful landscape", "zen"],
      motivation: ["inspiration", "celebration", "success", "achievement", "victory"]
    };
    if (category === "random") {
      const categories = Object.keys(safeKeywords);
      const hash = seed.split("").reduce((a, c2) => a + c2.charCodeAt(0), 0);
      category = categories[hash % categories.length];
    }
    if (!safeKeywords[category]) {
      return errorResponse("Invalid category", 400);
    }
    const keywords = safeKeywords[category];
    const cacheKey = `gallery:${category}`;
    const cached = await env.KV_CACHE.get(cacheKey);
    let images = [];
    if (cached) {
      images = JSON.parse(cached);
    } else {
      for (const keyword of keywords) {
        try {
          const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=80&page=1`, {
            headers: {
              "Authorization": env.PEXELS_API_KEY || "PexelsSignup-Optional"
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
              images = images.concat(data.photos.map((p2) => {
                return {
                  url: p2?.src?.medium || p2?.src?.small || "",
                  alt: p2?.photographer || "Photo",
                  source: "pexels"
                };
              }).filter((img) => img.url));
            }
          }
        } catch (e2) {
          if (env.DEBUG) console.warn(`Pexels API error for "${keyword}":`, e2.message);
        }
      }
      if (images.length < 50) {
        try {
          const keyword = keywords[0];
          const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=80&page=1`, {
            headers: {
              "Authorization": "Client-ID " + (env.UNSPLASH_ACCESS_KEY || "demo")
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.results && Array.isArray(data.results) && data.results.length > 0) {
              images = images.concat(data.results.map((p2) => {
                return {
                  url: p2?.urls?.regular || p2?.urls?.full || "",
                  alt: p2?.user?.name || "Photo",
                  source: "unsplash"
                };
              }).filter((img) => img.url));
            }
          }
        } catch (e2) {
          if (env.DEBUG) console.warn("Unsplash API error:", e2.message);
        }
      }
      if (images.length > 0) {
        await env.KV_CACHE.put(cacheKey, JSON.stringify(images), { expirationTtl: 86400 });
      }
    }
    const seededShuffle = /* @__PURE__ */ __name((arr, seed2) => {
      const result = [...arr];
      let hash = seed2.split("").reduce((a, c2) => a + c2.charCodeAt(0), 0);
      for (let i2 = result.length - 1; i2 > 0; i2--) {
        hash = (hash * 9301 + 49297) % 233280;
        const j = Math.floor(hash / 233280 * (i2 + 1));
        [result[i2], result[j]] = [result[j], result[i2]];
      }
      return result;
    }, "seededShuffle");
    const shuffled = seededShuffle(images, seed);
    const selected = shuffled.slice(0, limit);
    return successResponse({
      images: selected,
      category,
      count: selected.length,
      total: images.length,
      seed: seed.substring(0, 8)
      // Return truncated seed
    });
  } catch (error) {
    if (env.DEBUG) console.error("Gallery endpoint error:", error.message);
    return successResponse({
      images: [],
      error: "Gallery service temporarily unavailable",
      count: 0
    });
  }
});
router.get("/billing/status", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth) return errorResponse("Unauthorized", 401);
    return successResponse({
      plan: "free",
      subscription_id: null,
      next_billing_date: null,
      can_upgrade: true
    });
  } catch (error) {
    if (env.DEBUG) console.error("Billing status error:", error.message);
    return errorResponse("Failed to fetch billing status", 500);
  }
});
router.post("/billing/create-checkout", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth) return errorResponse("Unauthorized", 401);
    const { plan } = await request.json();
    if (!plan || !["pro", "enterprise"].includes(plan)) {
      return errorResponse("Invalid plan", 400);
    }
    return successResponse({
      message: "Billing system coming soon",
      plan,
      status: "not_configured"
    });
  } catch (error) {
    if (env.DEBUG) console.error("Checkout error:", error.message);
    return errorResponse("Failed to create checkout", 500);
  }
});
router.get("/billing/portal", async (request, env) => {
  try {
    const auth = await verifyAuth(request, env);
    if (!auth) return errorResponse("Unauthorized", 401);
    return successResponse({
      message: "Billing portal coming soon",
      status: "not_configured"
    });
  } catch (error) {
    if (env.DEBUG) console.error("Billing portal error:", error.message);
    return errorResponse("Failed to open billing portal", 500);
  }
});
router.get("/features", async (request, env) => {
  try {
    let userTier = "free";
    const auth = await verifyAuth(request, env);
    if (auth.valid) {
      const user = await env.DB.prepare(
        "SELECT subscription_tier FROM users WHERE id = ?"
      ).bind(auth.userId).first();
      if (user?.subscription_tier) {
        userTier = user.subscription_tier;
      }
    }
    const features = {};
    for (const [featureName] of Object.entries(config_default.features)) {
      features[featureName] = isFeatureEnabled(featureName, userTier);
    }
    return successResponse({
      features,
      tier: userTier,
      message: "Feature flags retrieved successfully"
    });
  } catch (error) {
    return errorResponse("Failed to retrieve feature flags", 500);
  }
});
router.all("*", () => errorResponse("Not found", 404));
var extended_routes_default = router;

// api/src/html.js
var import_checked_fetch6 = __toESM(require_checked_fetch(), 1);
var htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FocusBro - ADHD-Friendly Focus & Wellness</title>
<meta name="description" content="Professional focus management with breathing, grounding, and mental wellness tools.">
<link rel="icon" href="/favicon.ico">
<link rel="manifest" href="/manifest.json">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="FocusBro">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --white: #ffffff;
    --gray-50: #fafbfc;
    --gray-100: #f0f4f8;
    --gray-200: #e1e8f0;
    --gray-300: #cad3e4;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #0f1419;
    --primary: #6366f1;
    --primary-light: #818cf8;
    --primary-dark: #4f46e5;
    --primary-bg: #eef2ff;
    --accent: #ec4899;
    --accent-light: #f472b6;
    --accent-dark: #be185d;
    --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    --gradient-accent: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
    --gradient-success: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
    --success: #10b981;
    --success-bg: #ecfdf5;
    --warning: #f59e0b;
    --warning-bg: #fffbeb;
    --danger: #ef4444;
    --danger-bg: #fef2f2;
    --font: 'Inter', sans-serif;
    --mono: 'IBM Plex Mono', monospace;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04);
    --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.12);
    --shadow-lg: 0 12px 24px -4px rgba(0, 0, 0, 0.15);
    --shadow-xl: 0 20px 40px -6px rgba(0, 0, 0, 0.2);
  }

  /* \u2500\u2500 DARK MODE SUPPORT \u2500\u2500 */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --gray-50: #0f1419;
      --gray-100: #1a1f2e;
      --gray-200: #2a2f3e;
      --gray-300: #3a3f4e;
      --gray-400: #4a4f5e;
      --gray-500: #6b7280;
      --gray-600: #8b92a8;
      --gray-700: #a8b0c8;
      --gray-800: #c8d0e8;
      --gray-900: #e8f0ff;
      --white: #0f1419;
      --primary-bg: #1a2f5c;
      --success-bg: #0a3a2a;
      --warning-bg: #3a2a0a;
      --danger-bg: #3a1a1a;
    }
  }

  [data-theme="dark"] {
    --gray-50: #0f1419;
    --gray-100: #1a1f2e;
    --gray-200: #2a2f3e;
    --gray-300: #3a3f4e;
    --gray-400: #4a4f5e;
    --gray-500: #6b7280;
    --gray-600: #8b92a8;
    --gray-700: #a8b0c8;
    --gray-800: #c8d0e8;
    --gray-900: #e8f0ff;
    --white: #0f1419;
    --primary-bg: #1a2f5c;
    --success-bg: #0a3a2a;
    --warning-bg: #3a2a0a;
    --danger-bg: #3a1a1a;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; overflow: hidden; }
  body { font-family: var(--font); background: var(--white); color: var(--gray-900); line-height: 1.6; }
  
  .app { display: flex; height: 100vh; }
  .sidebar { width: 280px; background: var(--gray-900); color: var(--white); overflow-y: auto; display: flex; flex-direction: column; border-right: 1px solid rgba(99, 102, 241, 0.1); box-shadow: var(--shadow-md); }
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: linear-gradient(135deg, #fafbfc 0%, #f0f4f8 100%); }
  .header { background: var(--white); border-bottom: 1px solid var(--gray-200); padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow); min-height: 70px; }
  .content { flex: 1; overflow-y: auto; padding: 32px 40px; }
  
  .logo { 
    padding: 24px; 
    border-bottom: 1px solid rgba(99, 102, 241, 0.15);
    font-size: 18px; 
    font-weight: 800; 
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .logo::before {
    content: '\u{1F9E0}';
    font-size: 24px;
    -webkit-text-fill-color: unset;
    background: none;
  }
  .nav { flex: 1; padding: 20px 0; }
  .nav-item { 
    padding: 11px 20px; 
    margin: 4px 12px;
    color: var(--gray-400); 
    cursor: pointer; 
    font-size: 13px; 
    font-weight: 500; 
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 3px solid transparent;
    border-radius: 8px 0 0 8px;
    display: flex; 
    align-items: center; 
    gap: 8px;
  }
  .nav-item:hover { 
    background: rgba(99, 102, 241, 0.1);
    color: var(--primary-light);
    border-left-color: var(--primary-light);
    transform: translateX(4px);
  }
  .nav-item.active { 
    color: var(--white);
    border-left-color: var(--primary-light);
    background: rgba(99, 102, 241, 0.2);
    font-weight: 600;
  }
  .nav-label { 
    font-size: 11px; 
    text-transform: uppercase; 
    letter-spacing: 0.6px; 
    color: var(--gray-600); 
    padding: 16px 20px 8px 20px; 
    font-weight: 700; 
  }
  .sidebar-footer { padding: 16px 24px; border-top: 1px solid rgba(99, 102, 241, 0.1); }
  
  .header-title { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .header-actions { display: flex; gap: 12px; align-items: center; }
  
  .btn { 
    padding: 10px 18px; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
    font-size: 13px; 
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
    text-decoration: none;
  }
  .btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .btn-primary { 
    background: var(--gradient-primary);
    color: var(--white);
  }
  .btn-primary:hover { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); }
  .btn-success { 
    background: var(--gradient-success);
    color: var(--white);
  }
  .btn-success:hover { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); }
  .btn-secondary { 
    background: var(--gray-100);
    color: var(--gray-900);
  }
  .btn-secondary:hover { background: var(--gray-200); }
  .btn-danger { 
    background: var(--danger);
    color: var(--white);
  }
  .btn-danger:hover { background: #dc2626; }
  .btn-warning { 
    background: var(--warning);
    color: var(--white);
  }
  .btn-warning:hover { background: #d97706; }
  .btn-sm { padding: 8px 12px; font-size: 12px; }
  .btn-lg { padding: 14px 24px; font-size: 14px; }
  .btn-block { width: 100%; }
  
  .card { 
    background: var(--white);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
    border: 1px solid var(--gray-200);
    box-shadow: var(--shadow);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); }
  .card h3 { 
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 700;
    color: var(--gray-900);
  }
  .card-success { border-top: 4px solid var(--success); }
  .card-warning { border-top: 4px solid var(--warning); }
  .card-danger { border-top: 4px solid var(--danger); }
  .card-primary { border-top: 4px solid var(--primary); }
  .header-actions { display: flex; gap: 12px; align-items: center; }
  .user-badge { font-size: 12px; background: var(--primary-bg); color: var(--primary); padding: 6px 12px; border-radius: 6px; font-weight: 600; }
  .keyboard-hint { font-size: 10px; color: var(--gray-400); background: var(--gray-100); padding: 4px 8px; border-radius: 4px; }
  
  .btn { padding: 10px 18px; border: none; border-radius: 6px; font-family: var(--font); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; position: relative; overflow: hidden; }
  .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn.loading::after { content: ''; position: absolute; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; right: 8px; }
  @keyframes spin { 100% { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  
  .btn-primary { background: var(--primary); color: var(--white); }
  .btn-primary:hover:not(:disabled) { background: var(--primary-dark); box-shadow: var(--shadow); }
  .btn-secondary { background: var(--gray-200); color: var(--gray-900); }
  .btn-secondary:hover:not(:disabled) { background: var(--gray-300); }
  .btn-success { background: var(--success); color: var(--white); }
  .btn-success:hover:not(:disabled) { background: #0d9488; }
  .btn-danger { background: var(--danger); color: var(--white); }
  .btn-danger:hover:not(:disabled) { background: #b91c1c; }
  
  .btn-lg { padding: 14px 24px; font-size: 14px; }
  .btn-block { width: 100%; justify-content: center; }
  .btn-sm { padding: 6px 12px; font-size: 11px; }
  
  .grid { 
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 28px;
  }

  /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 GALLERY HERO \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
  .gallery-hero {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 32px;
    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
  }
  .gallery-container {
    position: relative;
    height: 320px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    text-align: center;
  }
  .gallery-image {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.4;
    background-size: cover;
    background-position: center;
    filter: brightness(0.7) saturate(1.2);
    z-index: 1;
  }
  .gallery-quote {
    position: relative;
    z-index: 2;
    max-width: 600px;
  }
  .gallery-quote h2 {
    font-size: 28px;
    font-weight: 800;
    color: var(--white);
    margin-bottom: 12px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  .gallery-quote p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    font-style: italic;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
  .gallery-nav {
    position: relative;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
  }
  .gallery-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: var(--white);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .gallery-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }
  .gallery-dots {
    display: flex;
    gap: 8px;
  }
  .gallery-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .gallery-dot.active {
    background: var(--white);
    width: 24px;
    border-radius: 4px;
  }
  .gallery-dot:hover {
    background: rgba(255, 255, 255, 0.6);
  }
  
  .card-header { 
    font-size: 11px;
    font-weight: 700;
    color: var(--gray-500);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }
  .card-value { 
    font-size: 36px;
    font-weight: 800;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
    font-family: var(--mono);
  }
  .card-subtext {
    font-size: 12px;
    color: var(--gray-500);
  }
  
  .panel {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    box-shadow: var(--shadow);
    margin-bottom: 24px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .panel:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
  .panel-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--gray-100);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #fafbfc 0%, #f0f4f8 100%);
  }
  .panel-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--gray-900);
  }
  .panel-body { padding: 24px; }
  
  .form-group { margin-bottom: 18px; }
  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 8px;
  }
  .form-label.required::after { content: ' *'; color: var(--danger); }
  .form-input, .form-textarea {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid var(--gray-300);
    border-radius: 8px;
    font-family: var(--font);
    font-size: 13px;
    color: var(--gray-900);
    background: var(--white);
    transition: all 0.2s ease;
  }
  .form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  .form-input.error { border-color: var(--danger); }
  .form-error {
    font-size: 12px;
    color: var(--danger);
    margin-top: 6px;
  }
  
  .breathing-circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: var(--gradient-primary);
    margin: 40px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    color: var(--white);
    animation: breathe-scale 8s ease-in-out infinite;
    box-shadow: var(--shadow-xl);
    touch-action: manipulation;
  }
  .breathing-circle.box-breath { animation: box-breath-scale 16s ease-in-out infinite; }
  .breathing-circle.tactical { animation: tactical-breath-scale 8s ease-in-out infinite; }
  @keyframes breathe-scale { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.25); } 50% { transform: scale(1.35); } 75% { transform: scale(1.15); } }
  @keyframes box-breath-scale { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.2); } 50% { transform: scale(1.2); } 75% { transform: scale(1); } }
  @keyframes tactical-breath-scale { 0%, 100% { transform: scale(1); } 12.5% { transform: scale(1.15); } 25% { transform: scale(1.15); } 37.5% { transform: scale(1); } }
  
  .breathing-text {
    font-size: 14px;
    color: var(--gray-600);
    text-align: center;
    margin-top: 20px;
    font-weight: 500;
  }
  
  .grounding-section {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
    margin: 24px 0;
  }
  .grounding-item {
    padding: 18px;
    background: var(--gray-50);
    border: 2px solid var(--gray-200);
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    font-weight: 600;
    font-size: 13px;
  }
  .grounding-item:hover {
    border-color: var(--primary);
    background: var(--primary-bg);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
  .grounding-item.completed { border-color: var(--success); background: var(--success-bg); color: var(--success); font-weight: 600; }
  .grounding-number { font-size: 24px; font-weight: 700; color: var(--primary); display: block; margin-bottom: 4px; }
  .grounding-label { font-size: 11px; color: var(--gray-600); font-weight: 600; }
  
  .energy-slider { width: 100%; margin: 16px 0; accent-color: var(--primary); }
  .slider-track { display: flex; gap: 8px; margin: 16px 0; }
  .slider-item { flex: 1; padding: 12px; text-align: center; border: 2px solid var(--gray-200); border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.2s ease; user-select: none; touch-action: manipulation; }
  .slider-item:hover { border-color: var(--primary); background: var(--primary-bg); }
  .slider-item.active { border-color: var(--primary); background: var(--primary-bg); color: var(--primary); }
  
  .dopamine-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px;
    margin: 20px 0;
  }
  .dopamine-item {
    padding: 16px;
    background: var(--gradient-accent);
    color: var(--white);
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 600;
    font-size: 13px;
    box-shadow: var(--shadow-md);
    user-select: none;
    touch-action: manipulation;
  }
  .dopamine-item:hover {
    transform: scale(1.08) translateY(-4px);
    box-shadow: var(--shadow-xl);
  }
  
  .fidget-spinner {
    width: 140px;
    height: 140px;
    margin: 40px auto;
    border-radius: 50%;
    background: conic-gradient(from 45deg, #6366f1, #8b5cf6, #ec4899, #6366f1);
    animation: spin 2s linear infinite;
    box-shadow: var(--shadow-xl);
  }
  .particle-canvas {
    width: 100%;
    height: 300px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08));
    border-radius: 10px;
    border: 1px solid var(--gray-200);
  }
  
  .modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 20, 25, 0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
  .modal.active { display: flex; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-content { background: var(--white); border-radius: 16px; box-shadow: var(--shadow-xl); width: 90%; max-width: 520px; max-height: 80vh; overflow-y: auto; animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid var(--gray-200); }
  @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-header { 
    padding: 28px 32px;
    border-bottom: 1px solid var(--gray-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #fafbfc 0%, #f0f4f8 100%);
  }
  .modal-title { 
    font-size: 20px;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .close-btn { 
    background: var(--gray-100);
    border: none;
    font-size: 20px;
    color: var(--gray-500);
    cursor: pointer;
    padding: 8px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  .close-btn:hover { 
    background: var(--gray-200);
    color: var(--gray-900);
  }
  .modal-body { padding: 32px; }
  .modal-footer { 
    padding: 20px 32px;
    border-top: 1px solid var(--gray-200);
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    background: linear-gradient(135deg, #fafbfc 0%, #f0f4f8 100%);
  }
  
  input, textarea, select {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid var(--gray-300);
    border-radius: 8px;
    font-family: var(--font);
    font-size: 13px;
    transition: all 0.2s ease;
    background: var(--white);
  }
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  input::placeholder, textarea::placeholder {
    color: var(--gray-400);
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  .form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 8px;
  }
  .form-error {
    color: var(--danger);
    font-size: 12px;
    margin-top: 4px;
  }
  .form-success {
    color: var(--success);
    font-size: 12px;
    margin-top: 4px;
  }
  
  .toast { 
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--white);
    border-left: 4px solid var(--primary);
    border-radius: 10px;
    padding: 16px 20px;
    box-shadow: var(--shadow-xl);
    z-index: 2000;
    animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 360px;
  }
  @keyframes slideInRight { from { transform: translateX(420px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .toast.success { border-left-color: var(--success); }
  .toast.error { border-left-color: var(--danger); }
  .toast.warning { border-left-color: var(--warning); }
  .toast-message { 
    font-size: 13px;
    color: var(--gray-900);
    font-weight: 500;
  }
  .toast-close { 
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: var(--gray-400);
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    width: 24px;
    height: 24px;
  }
  
  .mini-chart { width: 100%; height: 80px; background: linear-gradient(to right, var(--primary-bg), var(--success-bg)); border-radius: 6px; }
  
  .table { width: 100%; font-size: 12px; }
  .table th { padding: 12px 0; text-align: left; font-weight: 700; color: var(--gray-600); text-transform: uppercase; letter-spacing: 0.3px; font-size: 10px; border-bottom: 1px solid var(--gray-200); }
  .table td { padding: 12px 0; border-bottom: 1px solid var(--gray-100); color: var(--gray-700); }
  
  @media (max-width: 768px) {
    .app { flex-direction: column; }
    .sidebar { 
      position: fixed; 
      left: -280px; 
      width: 280px; 
      height: 100vh; 
      z-index: 999;
      transition: left 0.3s ease;
      overflow-y: auto;
    }
    .sidebar.open { left: 0; }
    .content { padding: 16px 20px; }
    .grounding-section { grid-template-columns: repeat(2, 1fr); }
    .dopamine-list { grid-template-columns: repeat(2, 1fr); }
  }
  
  .hamburger {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    gap: 5px;
  }
  
  .hamburger span {
    width: 24px;
    height: 2px;
    background: var(--gray-900);
    transition: all 0.3s ease;
    border-radius: 2px;
  }
  
  .hamburger.open span:nth-child(1) {
    transform: rotate(45deg) translateY(10px);
  }
  
  .hamburger.open span:nth-child(2) {
    opacity: 0;
  }
  
  .hamburger.open span:nth-child(3) {
    transform: rotate(-45deg) translateY(-10px);
  }
  
  @media (max-width: 768px) {
    .hamburger { display: flex; }
    .sidebar { box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1); }
  }
  
  .menu-backdrop {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    animation: fadeIn 0.2s ease;
  }
  
  .menu-backdrop.open {
    display: block;
  }
  
  @media (max-width: 768px) {
    .menu-backdrop.open { display: block; }
  }
</style>
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7015938501859914" crossorigin="anonymous"><\/script>
</head>
<body>

<div class="app">
  <div class="sidebar">
    <div class="logo">FocusBro</div>
    <nav class="nav" id="appNav">
      <div class="nav-label">Priority</div>
      <div class="nav-item active" onclick="switchView('dashboard')">Dashboard</div>
      <div class="nav-item" onclick="switchView('keep-alive')">\u26A1 Keep Alive</div>
      <div class="nav-label">Focus</div>
      <div class="nav-item" onclick="switchView('pomodoro')">Pomodoro (P)</div>
      <div class="nav-item" onclick="switchView('task-difficulty')">Task Difficulty</div>
      <div class="nav-label">Wellness</div>
      <div class="nav-item" onclick="switchView('breathing')">Breathing (B)</div>
      <div class="nav-item" onclick="switchView('grounding')">Grounding (G)</div>
      <div class="nav-item" onclick="switchView('body-scan')">Body Scan</div>
      <div class="nav-item" onclick="switchView('meditation')">Meditation</div>
      <div class="nav-label">Health</div>
      <div class="nav-item" onclick="switchView('medication')">Medication</div>
      <div class="nav-item" onclick="switchView('movement')">Movement Breaks</div>
      <div class="nav-label">Energy</div>
      <div class="nav-item" onclick="switchView('energy')">Mood/Energy</div>
      <div class="nav-item" onclick="switchView('dopamine-menu')">Dopamine Menu</div>
      <div class="nav-item" onclick="switchView('fidget')">Fidget Tools</div>
      <div class="nav-label">Insights</div>
      <div class="nav-item" onclick="switchView('analytics')">\u{1F4CA} Analytics</div>
      <div class="nav-label">Account</div>
      <div class="nav-item" onclick="switchView('settings')">Settings</div>
    </nav>
    <div class="sidebar-footer">
      <button class="btn btn-primary btn-block" id="authBtn" onclick="openModal('authModal')" style="display:block;">Sign In</button>
      <button class="btn btn-secondary btn-block" id="logoutBtn" onclick="logout()" style="display:none; margin-top: 8px;">Logout</button>
    </div>
  </div>

  <div class="menu-backdrop" id="menuBackdrop"></div>

  <div class="main">
    <div class="header">
      <button class="hamburger" id="menuToggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="header-title" id="viewTitle">FocusBro</div>
      <div class="header-actions">
        <span id="offlineIndicator" style="display:none; background: #ff6b6b; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;" aria-label="Offline status">\u{1F534} Offline</span>
        <span id="userDisplay" style="display:none;" class="user-badge" aria-label="User email">Logged in</span>
        <span class="keyboard-hint" id="keyboardHint" style="display:none;">Press ? for help</span>
      </div>
    </div>

    <div class="content" id="mainContent">
      <!-- DASHBOARD -->
      <div id="dashboard-view" class="view">
        <!-- MOTIVATIONAL GALLERY HERO -->
        <div class="gallery-hero" id="galleryHero">
          <div class="gallery-container">
            <div class="gallery-image" id="galleryImage"></div>
            <div class="gallery-quote" id="galleryQuote"></div>
            <div class="gallery-nav">
              <button class="gallery-btn prev" onclick="rotateGallery(-1)" aria-label="Previous image">\u2190</button>
              <div class="gallery-dots" id="galleryDots"></div>
              <button class="gallery-btn next" onclick="rotateGallery(1)" aria-label="Next image">\u2192</button>
            </div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-header">Energy Level</div>
            <div class="card-value" id="currentEnergy">--</div>
            <div class="card-subtext">1-10 scale</div>
          </div>
          <div class="card">
            <div class="card-header">Last Med Dose</div>
            <div class="card-value" id="medDisplay">--:--</div>
            <div class="card-subtext" id="medStatus">No dose logged</div>
          </div>
          <div class="card">
            <div class="card-header">Today's Sessions</div>
            <div class="card-value" id="sessionCount">0</div>
            <div class="card-subtext">Pomodoro cycles</div>
          </div>
          <div class="card">
            <div class="card-header">Current Streak</div>
            <div class="card-value" id="dashboardStreak">0</div>
            <div class="card-subtext">days \u{1F525}</div>
          </div>
          <div class="card">
            <div class="card-header">Total Sessions</div>
            <div class="card-value" id="dashboardTotalSessions">0</div>
            <div class="card-subtext">all time</div>
          </div>
          <div class="card">
            <div class="card-header">Total Focus Time</div>
            <div class="card-value" id="dashboardFocusHours">0h</div>
            <div class="card-subtext">hours</div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Quick Access</div></div>
          <div class="panel-body">
            <button class="btn btn-success btn-lg btn-block" onclick="switchView('pomodoro')">Start Pomodoro</button>
            <button class="btn btn-primary btn-lg btn-block" style="margin-top: 8px;" onclick="switchView('breathing')">Breathing Exercise</button>
            <button class="btn btn-secondary btn-lg btn-block" style="margin-top: 8px;" onclick="switchView('grounding')">Grounding (5-4-3-2-1)</button>
          </div>
        </div>
      </div>

      <!-- KEEP ALIVE - STAY ACTIVE -->
      <div id="keep-alive-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">\u26A1 Keep Awake - Avoid AFK Status</div></div>
          <div class="panel-body">
            <div style="background: var(--primary-bg); border: 1px solid var(--primary); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <div style="font-size: 12px; color: var(--gray-700);">
                <strong>\u{1F3AF} Purpose:</strong> Prevents your PC from going to sleep and keeps your status active on Teams/Slack<br>
                <strong>\u2699\uFE0F How it works:</strong> Simulates realistic activity (mouse movements, typing) every 5 seconds to avoid detection
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
              <div style="background: var(--white); border: 1px solid var(--gray-200); border-radius: 8px; padding: 16px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">Screen Wake Lock</div>
                <div style="font-size: 24px; margin-bottom: 12px;" id="wakeStatus">\xB7</div>
                <button class="btn btn-success btn-block" id="wakeStartBtn" onclick="startWakeLock()">Enable</button>
                <button class="btn btn-danger btn-block" id="wakeStopBtn" onclick="stopWakeLock()" style="display:none; margin-top: 8px;">Stop</button>
              </div>
              
              <div style="background: var(--white); border: 1px solid var(--gray-200); border-radius: 8px; padding: 16px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">Activity Simulation</div>
                <div style="font-size: 24px; margin-bottom: 12px;" id="activityStatus">\xB7</div>
                <button class="btn btn-success btn-block" id="activityStartBtn" onclick="startActivitySimulation()">Enable</button>
                <button class="btn btn-danger btn-block" id="activityStopBtn" onclick="stopActivitySimulation()" style="display:none; margin-top: 8px;">Stop</button>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, var(--success-bg), var(--primary-bg)); border: 1px solid var(--success); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 12px;">Presence Status</div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--success); animation: pulse 2s infinite;"></div>
                <span style="font-size: 14px; font-weight: 600; color: var(--gray-900);" id="presenceText">Ready to activate</span>
              </div>
              <div style="font-size: 12px; color: var(--gray-600);">Active for: <span id="activeTimer" style="font-weight: 600; color: var(--gray-900);">00:00:00</span></div>
            </div>

            <div style="background: var(--warning-bg); border: 1px solid var(--warning); border-radius: 8px; padding: 16px;">
              <div style="font-size: 12px; color: var(--gray-700);">
                <strong>\u26A0\uFE0F Important Notes:</strong>
                <ul style="margin: 8px 0 0 20px;">
                  <li>Works best with browser tab always visible</li>
                  <li>Screen may still lock if system idle timeout is very short</li>
                  <li>Browser cannot move OS cursor (system limitation)</li>
                  <li>Safe to use during work hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- POMODORO -->
      <div id="pomodoro-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Pomodoro Timer</div></div>
          <div class="panel-body">
            <div style="text-align: center; margin: 30px 0;">
              <div style="font-family: var(--mono); font-size: 72px; font-weight: 700; color: var(--primary); margin: 20px 0;" id="pomodoroDisplay">25:00</div>
              <div style="margin: 20px 0;">
                <button class="btn btn-success btn-lg" id="pomodoroStartBtn" onclick="startPomodoro()">Start</button>
                <button class="btn btn-danger btn-lg" id="pomodoroStopBtn" onclick="stopPomodoro()" style="display:none;">Stop</button>
              </div>
            </div>
            <div id="pomodoroEnergyForm" style="display:none;">
              <div class="form-group">
                <label class="form-label">Energy After Session (1-10)</label>
                <input type="range" min="1" max="10" id="pomodoroEnergy" class="energy-slider" value="5">
                <div style="text-align: center; font-size: 12px; color: var(--gray-600);" id="pomodoroEnergyValue">5</div>
              </div>
              <button class="btn btn-primary btn-lg btn-block" onclick="recordPomodoroSession()">Record Session</button>
            </div>
          </div>
        </div>
      </div>

      <!-- BREATHING -->
      <div id="breathing-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Breathing Exercises</div></div>
          <div class="panel-body">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
              <button class="btn btn-primary btn-block" onclick="startBreathing('4-7-8')">4-7-8</button>
              <button class="btn btn-primary btn-block" onclick="startBreathing('box')">Box (4-4-4-4)</button>
              <button class="btn btn-primary btn-block" onclick="startBreathing('tactical')">Tactical</button>
            </div>
            <div id="breathing-display" style="display:none;">
              <div class="breathing-circle" id="breathingCircle">Breathe</div>
              <div class="breathing-text" id="breathingText">Follow the circle's movement</div>
              <div style="text-align: center; margin-top: 16px;">
                <button class="btn btn-secondary" onclick="stopBreathing()">Stop</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GROUNDING -->
      <div id="grounding-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">5-4-3-2-1 Grounding Exercise</div></div>
          <div class="panel-body">
            <p style="font-size: 12px; color: var(--gray-600); margin-bottom: 16px;">Click each item as you notice it. Use when feeling overwhelmed.</p>
            <div style="margin-bottom: 20px;">
              <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">5 Things You See</div>
              <div class="grounding-section" id="groundingSee"></div>
            </div>
            <div style="margin-bottom: 20px;">
              <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">4 Things You Touch</div>
              <div class="grounding-section" id="groundingTouch"></div>
            </div>
            <div style="margin-bottom: 20px;">
              <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">3 Things You Hear</div>
              <div class="grounding-section" id="groundingHear"></div>
            </div>
            <div style="margin-bottom: 20px;">
              <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">2 Things You Smell</div>
              <div class="grounding-section" id="groundingSmell"></div>
            </div>
            <div style="margin-bottom: 20px;">
              <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">1 Thing You Taste</div>
              <div class="grounding-section" id="groundingTaste"></div>
            </div>
            <div id="groundingComplete" style="display:none; text-align: center; padding: 20px; background: var(--success-bg); border-radius: 8px; color: var(--success);">
              <div style="font-weight: 700;">Grounding complete! You're anchored.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- BODY SCAN -->
      <div id="body-scan-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Quick Body Scan (60-90 sec)</div></div>
          <div class="panel-body">
            <div style="text-align: center; margin: 20px 0;">
              <button class="btn btn-success btn-lg" id="bodyScanStart" onclick="startBodyScan()">Start Scan</button>
              <button class="btn btn-secondary btn-lg" id="bodyScanStop" onclick="stopBodyScan()" style="display:none;">Stop</button>
            </div>
            <div id="bodyScanDisplay" style="display:none; font-family: var(--mono); font-size: 12px; line-height: 1.8; color: var(--gray-700); margin: 16px 0; background: var(--gray-50); padding: 16px; border-radius: 6px;"></div>
            <div style="background: var(--primary-bg); border: 1px solid var(--primary); border-radius: 8px; padding: 16px; margin-top: 16px;">
              <div style="font-size: 12px; color: var(--gray-700);">Check:
                <br>\u2022 Posture - Shoulders back?
                <br>\u2022 Shoulders - Tense or relaxed?
                <br>\u2022 Jaw - Clenched or loose?
                <br>\u2022 Back - Pain or stiffness?
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MEDITATION -->
      <div id="meditation-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Micro-Meditation Timer</div></div>
          <div class="panel-body">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
              <button class="btn btn-primary btn-block" onclick="startMeditation(1)">1 min</button>
              <button class="btn btn-primary btn-block" onclick="startMeditation(3)">3 min</button>
              <button class="btn btn-primary btn-block" onclick="startMeditation(5)">5 min</button>
              <button class="btn btn-primary btn-block" onclick="startMeditation(10)">10 min</button>
            </div>
            <div id="meditationDisplay" style="display:none;">
              <div style="font-family: var(--mono); font-size: 48px; font-weight: 700; color: var(--primary); margin: 30px 0; text-align: center;" id="meditationTimer">5:00</div>
              <div style="text-align: center;">
                <button class="btn btn-secondary" onclick="stopMeditation()">Stop</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ENERGY -->
      <div id="energy-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Energy & Mood Tracker</div></div>
          <div class="panel-body">
            <div class="form-group">
              <label class="form-label">Current Energy Level (1-10)</label>
              <input type="range" min="1" max="10" class="energy-slider" id="energyLevel" oninput="updateEnergyDisplay()" value="5">
              <div style="text-align: center; font-size: 32px; font-weight: 700; color: var(--primary);" id="energyValue">5</div>
            </div>
            <div class="form-group">
              <label class="form-label">Mood</label>
              <div class="slider-track">
                <div class="slider-item" onclick="setMood('stressed')">Stressed</div>
                <div class="slider-item" onclick="setMood('neutral')">Neutral</div>
                <div class="slider-item" onclick="setMood('good')">Good</div>
                <div class="slider-item" onclick="setMood('great')">Great</div>
              </div>
            </div>
            <button class="btn btn-primary btn-lg btn-block" onclick="saveEnergyLog()">Save Log</button>
            <div style="margin-top: 20px; padding: 16px; background: var(--gray-50); border-radius: 8px;">
              <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 12px;">Energy History</div>
              <div class="mini-chart"></div>
              <div style="font-size: 12px; color: var(--gray-600); margin-top: 8px; text-align: center;">Log sessions to see trends</div>
            </div>
          </div>
        </div>
      </div>

      <!-- DOPAMINE MENU -->
      <div id="dopamine-menu-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Dopamine Menu - Quick Breaks</div></div>
          <div class="panel-body">
            <p style="font-size: 12px; color: var(--gray-600); margin-bottom: 16px;">Click for a quick dopamine hit during breaks:</p>
            <div class="dopamine-list" id="dopamineList"></div>
            <div style="margin-top: 20px; padding: 16px; background: var(--warning-bg); border-radius: 8px;">
              <div style="font-weight: 700; margin-bottom: 8px; color: var(--warning);">Avoid During Focus</div>
              <ul style="font-size: 12px; color: var(--gray-700); margin-left: 20px;">
                <li>Phone/social media</li>
                <li>News/emails</li>
                <li>YouTube/streaming</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- TASK DIFFICULTY -->
      <div id="task-difficulty-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Task Difficulty vs Interest</div></div>
          <div class="panel-body">
            <p style="font-size: 12px; color: var(--gray-600); margin-bottom: 16px;">Rate your task to decide if it's a good fit:</p>
            <div class="form-group">
              <label class="form-label">Difficulty (1-10)</label>
              <input type="range" min="1" max="10" id="taskDifficulty" oninput="updateTaskGrid()" style="width: 100%;" value="5">
              <div style="text-align: center; font-size: 12px; color: var(--gray-600);" id="difficultyValue">5</div>
            </div>
            <div class="form-group">
              <label class="form-label">Interest Level (1-10)</label>
              <input type="range" min="1" max="10" id="taskInterest" oninput="updateTaskGrid()" style="width: 100%;" value="5">
              <div style="text-align: center; font-size: 12px; color: var(--gray-600);" id="interestValue">5</div>
            </div>
            <div style="background: var(--primary-bg); border: 1px solid var(--primary); border-radius: 8px; padding: 16px; margin-top: 16px; text-align: center;">
              <div style="font-size: 12px; color: var(--gray-700);" id="taskAdvice">Choose a balanced task</div>
            </div>
          </div>
        </div>
      </div>

      <!-- FIDGET TOOLS -->
      <div id="fidget-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Visual Fidget Tools</div></div>
          <div class="panel-body">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
              <button class="btn btn-primary btn-block" onclick="showFidget('spinner')">Spinner</button>
              <button class="btn btn-primary btn-block" onclick="showFidget('colors')">Colors</button>
              <button class="btn btn-primary btn-block" onclick="showFidget('particles')">Particles</button>
            </div>
            <div id="fidgetDisplay" style="display:none;">
              <div class="fidget-spinner" id="fidgetSpinner" style="display:none;"></div>
              <div id="colorCycle" style="display:none; width: 200px; height: 200px; margin: 30px auto; border-radius: 50%; background: #3b82f6; animation: color-cycle 6s linear infinite; box-shadow: var(--shadow-lg);"></div>
              <style>@keyframes color-cycle { 0% { background: #3b82f6; } 20% { background: #8b5cf6; } 40% { background: #ec4899; } 60% { background: #f59e0b; } 80% { background: #10b981; } 100% { background: #3b82f6; } }</style>
              <canvas id="particleCanvas" class="particle-canvas" style="display:none;"></canvas>
              <button class="btn btn-secondary btn-block" onclick="hideFidget()">Done</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MOVEMENT -->
      <div id="movement-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Movement Breaks</div></div>
          <div class="panel-body">
            <button class="btn btn-success btn-lg btn-block" onclick="showMovement()">Get Suggestions</button>
            <div id="movementDisplay" style="display:none; margin-top: 20px;">
              <div style="font-size: 12px; color: var(--gray-700); line-height: 1.8; font-family: var(--mono); white-space: pre-wrap;" id="movementSuggestion"></div>
              <button class="btn btn-primary btn-block" style="margin-top: 12px;" onclick="showMovement()">Another Suggestion</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MEDICATION -->
      <div id="medication-view" class="view" style="display:none;">
        <div class="grid">
          <div class="card">
            <div class="card-header">Hours Since Last Dose</div>
            <div class="card-value" id="medHours">--:--</div>
            <div class="card-subtext" id="medText">No dose logged</div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Log Medication</div></div>
          <div class="panel-body">
            <div class="form-group">
              <label class="form-label">Time of Dose</label>
              <input type="time" id="medTime" class="form-input">
            </div>
            <button class="btn btn-success btn-lg btn-block" onclick="logMedication()">Log Dose</button>
          </div>
        </div>
      </div>

      <!-- ANALYTICS DASHBOARD -->
      <div id="analytics-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">\u{1F4CA} Analytics Dashboard</div>
          </div>
          <div class="panel-body">
            <!-- Time Range Selector -->
             <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="filterAnalyticsRange(7)">Last 7 Days</button>
              <button class="btn btn-secondary" onclick="filterAnalyticsRange(30)">Last 30 Days</button>
              <button class="btn btn-secondary" id="btn-90d" onclick="filterAnalyticsRange(90)">Last 90 Days <span class="pro-badge">PRO</span></button>
              <button class="btn btn-secondary" id="btn-all" onclick="filterAnalyticsRange(Infinity)">All Time <span class="pro-badge">PRO</span></button>
            </div>

            <!-- Summary Stats Cards -->
            <div class="grid" style="margin-bottom: 20px;">
              <div class="card">
                <div class="card-header">\u{1F525} Current Streak</div>
                <div class="card-value" id="analyticsStreak">0</div>
                <div class="card-subtext">days</div>
              </div>
              <div class="card">
                <div class="card-header">Longest Streak</div>
                <div class="card-value" id="longestStreakCard">0</div>
                <div class="card-subtext">days</div>
              </div>
              <div class="card">
                <div class="card-header">Total Sessions</div>
                <div class="card-value" id="totalSessionsCard">0</div>
                <div class="card-subtext">all time</div>
              </div>
              <div class="card">
                <div class="card-header">Focus Time</div>
                <div class="card-value" id="totalHoursCard">0h</div>
                <div class="card-subtext">hours</div>
              </div>
            </div>

            <!-- Charts Row 1 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
              <!-- Sessions Per Day -->
              <div style="background: var(--white); border: 1px solid var(--gray-200); border-radius: 12px; padding: 16px;">
                <div style="font-weight: 600; margin-bottom: 12px; font-size: 14px;">Sessions Per Day (Last 30 Days)</div>
                <canvas id="sessionsChart" width="300" height="150" role="img" aria-label="Sessions per day chart"></canvas>
              </div>

              <!-- Tool Usage -->
              <div style="background: var(--white); border: 1px solid var(--gray-200); border-radius: 12px; padding: 16px;">
                <div style="font-weight: 600; margin-bottom: 12px; font-size: 14px;">Tool Usage (Top Tools)</div>
                <canvas id="toolUsageChart" width="300" height="150" role="img" aria-label="Tool usage chart"></canvas>
              </div>
            </div>

            <!-- Charts Row 2 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
              <!-- Energy Trend -->
              <div style="background: var(--white); border: 1px solid var(--gray-200); border-radius: 12px; padding: 16px;">
                <div style="font-weight: 600; margin-bottom: 12px; font-size: 14px;">Energy Level Trend (Last 30 Days)</div>
                <canvas id="energyChart" width="300" height="150" role="img" aria-label="Energy trend chart"></canvas>
              </div>

              <!-- Activity Heatmap (Pro Only) -->
              <div style="background: var(--white); border: 1px solid var(--gray-200); border-radius: 12px; padding: 16px; position: relative;" id="heatmapContainer">
                <div style="font-weight: 600; margin-bottom: 12px; font-size: 14px;">Activity Heatmap (Last 52 Weeks)</div>
                <canvas id="heatmapChart" width="300" height="150" role="img" aria-label="Activity heatmap"></canvas>
                <div id="proGateHeatmap" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.8); border-radius: 12px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px);">
                  <div style="text-align: center;">
                    <div style="font-weight: 600; margin-bottom: 8px;">PRO Feature</div>
                    <button class="btn btn-primary btn-sm" onclick="showProGate('Heatmap')">Upgrade to Pro</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Export Buttons -->
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <button class="btn btn-secondary" onclick="exportCSV()">\u2B07 Export CSV</button>
              <button class="btn btn-primary" onclick="exportPDF()" id="exportPdfBtn">\u{1F4C4} Export PDF <span class="pro-badge">PRO</span></button>
              <button class="btn btn-secondary" onclick="exportJSON()" id="exportJsonBtn">\u{1F4E6} Export JSON <span class="pro-badge">PRO</span></button>
            </div>
          </div>
        </div>
      </div>

      <!-- SETTINGS -->
      <div id="settings-view" class="view" style="display:none;">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Settings</div></panel-header>
          <div class="panel-body">
            <h3 style="margin-top: 0;">\u23F1 Focus Settings</h3>
            <div class="form-group">
              <label class="form-label">Default Pomodoro Duration (minutes)</label>
              <input type="number" id="defaultPomodoro" class="form-input" value="25" min="5" max="60">
            </div>
            <div class="form-group">
              <label class="form-label">Break Duration (minutes)</label>
              <input type="number" id="defaultBreak" class="form-input" value="5" min="1" max="30">
            </div>
            <button class="btn btn-primary btn-block" onclick="saveSettings()" style="margin-bottom: 30px;">Save Settings</button>

            <!-- Dark Mode Section -->
            <h3>\u{1F313} Appearance</h3>
            <div class="form-group">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="darkModeToggle" onchange="handleDarkModeToggle()">
                <span>Dark mode</span>
              </label>
              <div style="font-size: 12px; color: var(--gray-600); margin-top: 8px;">
                Use dark theme for reduced eye strain
              </div>
            </div>

            <!-- Notifications Section -->
            <h3>\u{1F514} Notifications</h3>
            <div class="form-group">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="notificationsEnabled" onchange="handleNotificationToggle()">
                <span>Enable push notifications</span>
              </label>
              <div style="font-size: 12px; color: var(--gray-600); margin-top: 8px;">
                Receive reminders and milestone celebrations
              </div>
            </div>

            <div id="notificationPrefsContainer" style="display: none; background: var(--primary-bg); padding: 16px; border-radius: 8px; margin-top: 12px;">
              <div class="form-group">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" id="breakReminders" checked>
                  <span>Break reminders</span>
                </label>
              </div>
              <div class="form-group">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" id="medicationReminders" checked>
                  <span>Medication reminders</span>
                </label>
              </div>
              <div class="form-group">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" id="milestoneNotifications" checked>
                  <span>Milestone celebrations</span>
                </label>
              </div>
              <div class="form-group">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" id="morningMotivation">
                  <span>Morning motivation (daily at</span>
                  <input type="time" id="morningTime" style="width: 100px; padding: 4px; border: 1px solid var(--gray-300); border-radius: 4px;" value="08:00">
                  <span>)</span>
                </label>
              </div>
              <button class="btn btn-secondary btn-block" style="margin-top: 12px;" onclick="saveNotificationPrefs()">Save Preferences</button>
              <button class="btn btn-outline btn-block" style="margin-top: 8px;" onclick="sendTestNotification()">Send Test Notification</button>
            </div>

            <!-- Slack Integration Section -->
            <h3 style="margin-top: 30px;">\u{1F517} Slack Integration <span class="pro-badge">PRO</span></h3>
            <div id="slackContainer" style="display: none;">
              <div class="form-group">
                <label class="form-label">Slack Webhook URL</label>
                <input type="url" id="slackWebhookUrl" class="form-input" placeholder="https://hooks.slack.com/services/..." autocomplete="url">
              </div>
              <button class="btn btn-primary btn-sm" onclick="saveSlackIntegration()" style="margin-right: 8px;">Save Webhook</button>
              <button class="btn btn-secondary btn-sm" onclick="testSlackWebhook()">Send Test</button>
              <button class="btn btn-outline btn-sm" onclick="disconnectSlack()">Disconnect</button>
              <div style="font-size: 11px; color: #666; margin-top: 8px;">
                <a href="https://slack.com/help/articles/115005265063-Incoming-webhooks-for-Slack" target="_blank">How to get a webhook URL</a>
              </div>
            </div>
            <div id="slackUpsell" style="background: var(--primary-bg); padding: 12px; border-radius: 8px;">
              <p style="margin: 0 0 8px 0; font-size: 13px;">Post your focus sessions to Slack automatically</p>
              <button class="btn btn-primary btn-sm" onclick="showUpgradeModal('Slack Integration')">Upgrade to Pro</button>
            </div>

            <!-- Billing Section -->
            <h3 style="margin-top: 30px;">\u{1F4B3} Billing & Subscription</h3>
            <div id="billingInfo"></div>
            <button class="btn btn-primary btn-block" id="billingBtn" onclick="initiateCheckout('pro')">Upgrade to Pro \u2014 $5/month</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- AUTH MODAL -->
<div id="authModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="authTitle">
  <div class="modal-content">
    <div class="modal-header">
      <div class="modal-title" id="authTitle">Sign In</div>
      <button class="close-btn" onclick="closeModal('authModal')" aria-label="Close">&times;</button>
    </div>
    <div class="modal-body">
      <form id="authForm" onsubmit="handleAuth(event)">
        <div class="form-group">
          <label class="form-label required" for="email">Email</label>
          <input type="email" id="email" class="form-input" placeholder="you@example.com" aria-label="Email address" autocomplete="email" required>
          <div class="form-error" id="emailError" style="display:none;"></div>
        </div>
        <div class="form-group">
          <label class="form-label required" for="password">Password</label>
          <input type="password" id="password" class="form-input" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" aria-label="Password" autocomplete="current-password" required>
          <div class="form-error" id="passwordError" style="display:none;"></div>
        </div>
        <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" id="rememberMe" style="width: 16px; height: 16px; cursor: pointer;">
          <label for="rememberMe" style="cursor: pointer; font-size: 12px; color: var(--gray-600); margin: 0;">Remember me (30 days)</label>
        </div>
        <button type="submit" class="btn btn-primary btn-lg btn-block" id="authBtn2">Sign In</button>
      </form>
      <div style="text-align: center; font-size: 12px; color: var(--gray-600); margin-top: 12px;">
        <a href="#" style="color: var(--primary); text-decoration: none;" onclick="toggleAuthMode();return false;" id="authToggle">Create account instead</a>
      </div>
    </div>
  </div>
</div>

<script>
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // UTILITY FUNCTIONS
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  // Get API_ORIGIN from page location
  const env = { API_ORIGIN: window.location.origin };

  // Debug flag - set with: localStorage.setItem('DEBUG', '1')
  const DEBUG = parseInt(localStorage.getItem('DEBUG') || '0');
  const log = (...args) => DEBUG && console.log('[FocusBro]', ...args);
  const warn = (...args) => DEBUG && console.warn('[FocusBro]', ...args);
  const error = (...args) => DEBUG && console.error('[FocusBro]', ...args);

  let user = null;
  let authMode = 'signin'; // 'signin' or 'signup'
  let pomodoroTimer = null;
  let pomodoroStartTime = 0;
  let pomodoroRunning = false;
  let sessionCount = 0;
  let energyLogs = [];
  let fbEvents = [];  // Structured event log for analytics
  let medInterval = null;
  let medDisplayInterval = null;
  let syncInterval = null;
  let keepAliveRunning = false;
  let keepAliveInterval = null;
  const dopamineMenu = ['Stretch', 'Cold water', 'Dance', 'Pet cat', 'Water', 'Stand breath', 'Walk', 'Shake'];
  const movements = ['Cat Stretch\\nBack on floor, pull knees toward chest,\\narched, hold 15 seconds', 'Standing Desk Stretch\\nHands behind head, lean back gently,\\nroll shoulders, 20 seconds', 'Forward Fold\\nFeet shoulder-width, fold from hips,\\nlet arms hang, 20 seconds', 'Quad Stretch\\nPull one leg toward glutes, hold 15s each', 'Neck Rolls\\nSlow circles: forward, right, back, left\\nRepeat 3 times'];

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // LOADING STATE UTILITY
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  
  const loadingStates = new Map(); // Track which buttons are loading
  
  /**
   * Set button to loading state (disabled, spinner, text change)
   */
  function setButtonLoading(buttonId, isLoading = true) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    
    if (isLoading) {
      btn.disabled = true;
      btn.dataset.originalText = btn.textContent;
      btn.textContent = '\u23F3 Loading...';
      loadingStates.set(buttonId, true);
    } else {
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || 'Submit';
      loadingStates.delete(buttonId);
    }
  }
  
  /**
   * Execute async function with loading state
   */
  async function withLoadingState(buttonId, asyncFn) {
    try {
      setButtonLoading(buttonId, true);
      return await asyncFn();
    } finally {
      setButtonLoading(buttonId, false);
    }
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // EVENT LOGGING (Phase 0 \u2014 Analytics Foundation)
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  /**
   * Log a structured event to the analytics system.
   * Events are stored in localStorage and synced to the backend.
   * 
   * @param {string} eventType - Type of event (session_complete, tool_use, energy_log, etc.)
   * @param {string} tool - Which tool generated the event (pomodoro, breathing, etc.)
   * @param {number} durationSeconds - Duration in seconds (for timed events)
   * @param {object} data - Tool-specific metadata (optional)
   */
  // Event queue to prevent race conditions during concurrent logging
  let eventQueue = [];
  let isProcessingQueue = false;
  
  /**
   * Monitor localStorage usage and warn if approaching limit
   */
  function monitorStorageSize() {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      const limitMB = 5; // Conservative estimate (browsers vary 5-10MB)
      const percentUsed = (total / (limitMB * 1024 * 1024)) * 100;
      if (percentUsed > 80) {
        showToast(\`\u26A0\uFE0F Storage \${percentUsed.toFixed(0)}% full - clean old data soon\`, 'warning');
        warn('Storage usage:', percentUsed.toFixed(1) + '%');
      }
    } catch (e) {
      // localStorage.hasOwnProperty may fail in some contexts
      warn('Could not check storage size:', e.message);
    }
  }

  function logEvent(eventType, tool = '', durationSeconds = 0, data = {}) {
    const event = {
      id: crypto.randomUUID(),
      type: eventType,
      tool,
      duration_seconds: durationSeconds,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    };

    // Add to queue instead of directly writing
    eventQueue.push(event);
    processEventQueue();

    console.log(\`[Event] \${eventType} | \${tool} | \${durationSeconds}s\`);
  }

  async function processEventQueue() {
    // Prevent concurrent processing
    if (isProcessingQueue || eventQueue.length === 0) {
      return;
    }

    isProcessingQueue = true;

    try {
      // Batch process all queued events
      const eventsToAdd = [...eventQueue];
      eventQueue = [];

      // Load existing events (single read operation)
      fbEvents = safeJSONParse('fbEvents', []);
      
      // Add all new events at once
      fbEvents.push(...eventsToAdd);

      // Cap at 10,000 events locally; prune oldest if exceeded
      if (fbEvents.length > 10000) {
        fbEvents = fbEvents.slice(-10000);
      }

      // Single write operation
      localStorage.setItem('fbEvents', JSON.stringify(fbEvents));
    } catch (error) {
      console.error('Error processing event queue:', error.message);
      // Re-queue events that failed to process
      eventQueue = [...eventQueue, ...eventsToAdd];
    } finally {
      isProcessingQueue = false;
      
      // Process any events that arrived while we were processing
      if (eventQueue.length > 0) {
        processEventQueue();
      }
    }
  }

  /**
   * Calculate current and longest streaks from logged events.
   * Streak = consecutive days with at least one focus session.
   * Safe iteration limit: max 730 days (2 years).
   * Optimization: Stop counting once we find the longest historical streak.
   */
  function getStreak() {
    fbEvents = safeJSONParse('fbEvents', []);

    // Filter only session_complete events with type 'focus'
    const focusSessions = fbEvents.filter(e => 
      e.type === 'session_complete' && e.data?.type === 'focus'
    );

    if (focusSessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, totalSessions: 0 };
    }

    // Extract unique dates (YYYY-MM-DD in UTC)
    const datesSet = new Set();
    focusSessions.forEach(e => {
      const date = new Date(e.timestamp).toISOString().slice(0, 10);
      datesSet.add(date);
    });

    // Sort dates descending
    const dates = Array.from(datesSet).sort().reverse();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    let foundCurrentStreakBreak = false;

    // Walk backward from today, checking for consecutive days
    // Stop early once we've counted the current streak and found a reasonable long streak
    const MAX_ITERATIONS = 730; // ~2 years
    for (let i = 0; i < dates.length && i < MAX_ITERATIONS; i++) {
      if (i === 0) {
        tempStreak = 1;
        currentStreak = 1;
      } else {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          tempStreak++;
          if (i === 1 || dates[i] === dates[0]) {
            // First iteration or recent date
            currentStreak = tempStreak;
          }
        } else {
          // Gap detected; reset temp streak
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          foundCurrentStreakBreak = true;
          
          // Optimization: stop if we've found current streak break and a long enough streak
          // This prevents unnecessary iterations through old data
          if (foundCurrentStreakBreak && longestStreak > 30) {
            break;
          }
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return {
      currentStreak,
      longestStreak,
      lastActiveDate: dates[0] || null,
      totalSessions: focusSessions.length
    };
  }

  /**
   * Get summary stats for display on dashboard.
   * Computed from cached streaks + event counts.
   */
  function getAnalyticsSummary() {
    fbEvents = safeJSONParse('fbEvents', []);
    const streak = getStreak();

    // Count sessions today
    const today = new Date().toISOString().slice(0, 10);
    const sessionsToday = fbEvents.filter(e =>
      e.type === 'session_complete' && 
      e.data?.type === 'focus' &&
      e.timestamp.slice(0, 10) === today
    ).length;

    // Total focus time in seconds
    let totalFocusSeconds = 0;
    fbEvents.forEach(e => {
      if (e.type === 'session_complete' && e.data?.type === 'focus') {
        totalFocusSeconds += e.duration_seconds || 0;
      }
    });

    // Most used tool
    const toolCounts = {};
    fbEvents.forEach(e => {
      if (e.tool && (e.type === 'tool_use' || e.type === 'session_complete')) {
        toolCounts[e.tool] = (toolCounts[e.tool] || 0) + 1;
      }
    });
    const mostUsedTool = Object.keys(toolCounts).reduce((a, b) =>
      toolCounts[a] > toolCounts[b] ? a : b, ''
    );

    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalSessions: streak.totalSessions,
      totalFocusHours: (totalFocusSeconds / 3600).toFixed(1),
      sessionsToday,
      mostUsedTool
    };
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // NOTIFICATIONS & SERVICE WORKER
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  /**
   * Register the service worker for push notifications and offline support
   */
  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('\u2139\uFE0F Service Worker not supported in this browser');
      return;
    }

    try {
      // Add 5-second timeout to service worker registration
      const registrationPromise = navigator.serviceWorker.register('/sw.js', { scope: '/' });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Service Worker registration timeout')), 5000)
      );

      const reg = await Promise.race([registrationPromise, timeoutPromise]);
      console.log('\u2705 Service Worker registered:', reg.scope);
      
      // Check for updates periodically
      const updateCheckInterval = setInterval(() => {
        reg.update().catch(err => {
          console.warn('\u26A0\uFE0F SW update check failed:', err.message);
          // Don't clear interval - keep trying
        });
      }, 60 * 60 * 1000); // Every hour
      
      // Store interval ID for cleanup if needed
      activeModalTimers['swUpdate'] = [updateCheckInterval];
      
    } catch (err) {
      // Don't block app if Service Worker fails
      console.warn('\u26A0\uFE0F Service Worker registration failed (app will continue offline):', err.message);
    }
  }

  /**
   * Request notification permission from user
   */
  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      showToast('Your browser does not support notifications', 'warning');
      return false;
    }

    if (Notification.permission === 'granted') {
      console.log('[Client] Notification permission already granted');
      return true;
    }

    if (Notification.permission === 'denied') {
      showToast('Notifications are blocked. Enable in browser settings.', 'warning');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('[Client] Notification permission:', permission);
      return permission === 'granted';
    } catch (err) {
      console.warn('[Client] Notification permission request failed:', err.message);
      return false;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async function subscribeToPushNotifications() {
    if (!user) {
      showToast('Must be logged in to enable notifications', 'info');
      return false;
    }

    const granted = await requestNotificationPermission();
    if (!granted) {
      return false;
    }

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      showToast('Your browser does not support push notifications', 'warning');
      return false;
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      
      // Get VAPID public key from backend
      const vapidResponse = await fetch('/api/vapid/public-key');
      if (!vapidResponse.ok) {
        throw new Error('Failed to fetch VAPID public key');
      }
      const { public_key } = await vapidResponse.json();

      // Subscribe to push
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(public_key)
      });

      // Send subscription to backend
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${localStorage.getItem('fbToken')}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          device_label: \`\${navigator.userAgent.slice(0, 50)} (\${new Date().toLocaleDateString()})\`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription on backend');
      }

      console.log('[Client] Subscribed to push notifications');
      showToast('\u2705 Notifications enabled', 'success');
      return true;
    } catch (err) {
      console.error('[Client] Push subscription failed:', err.message);
      showToast('Failed to enable notifications: ' + err.message, 'warning');
      return false;
    }
  }

  /**
   * Convert VAPID public key from base64 to Uint8Array
   */
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  /**
   * Send a test notification via browser Notification API
   */
  function sendTestNotification() {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      showToast('Notifications not enabled', 'warning');
      return;
    }

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Service worker registered; send via SW
      navigator.serviceWorker.controller.postMessage({
        type: 'SEND_TEST_NOTIFICATION',
        data: {
          title: 'FocusBro Test Notification',
          body: 'This is a test notification. Your notifications are working!',
          tag: 'test-notification'
        }
      });
    } else {
      // Fallback: use standard Notification API
      new Notification('FocusBro Test Notification', {
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        body: 'This is a test notification. Your notifications are working!',
        tag: 'test-notification'
      });
    }
  }

  /**
   * In-app break reminder (fallback when service worker unavailable)
   */
  function showBreakReminder() {
    if (Notification.permission === 'granted' && !('serviceWorker' in navigator)) {
      new Notification('Time for a Break! \u{1F9E0}', {
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        body: 'You\\'ve been focused. Take a break and recharge!',
        tag: 'break-reminder',
        requireInteraction: false
      });
    }
  }

  /**
   * Handle notification enable/disable toggle
   */
  async function handleNotificationToggle() {
    const checkbox = document.getElementById('notificationsEnabled');
    const container = document.getElementById('notificationPrefsContainer');

    if (checkbox.checked) {
      const success = await subscribeToPushNotifications();
      if (success) {
        container.style.display = 'block';
        loadNotificationPrefs();
      } else {
        checkbox.checked = false;
        container.style.display = 'none';
      }
    } else {
      container.style.display = 'none';
      // Unsubscribe from push
      try {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          // Notify backend
          await fetch('/api/notifications/subscribe', {
            method: 'DELETE',
            headers: {
              'Authorization': \`Bearer \${localStorage.getItem('fbToken')}\`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ endpoint: subscription.endpoint })
          }).catch(err => console.warn('Failed to notify backend of unsubscribe:', err));
        }
      } catch (err) {
        console.warn('Error during unsubscribe:', err.message);
      }
    }
  }

  /**
   * Load notification preferences from server
   */
  async function loadNotificationPrefs() {
    if (!user) return;

    try {
      const response = await fetch('/api/notifications/prefs', {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('fbToken')}\` }
      });

      if (!response.ok) {
        console.warn('Failed to load notification prefs');
        return;
      }

      const prefs = await response.json();
      document.getElementById('breakReminders').checked = Boolean(prefs.break_reminders);
      document.getElementById('medicationReminders').checked = Boolean(prefs.medication_reminders);
      document.getElementById('milestoneNotifications').checked = Boolean(prefs.milestones);
      document.getElementById('morningMotivation').checked = Boolean(prefs.morning_motivation);
      document.getElementById('morningTime').value = prefs.morning_time || '08:00';
    } catch (err) {
      console.warn('Error loading notification prefs:', err.message);
    }
  }

  /**
   * Save notification preferences to server
   */
  async function saveNotificationPrefs() {
    if (!user) {
      showToast('Must be logged in', 'warning');
      return;
    }

    try {
      const prefs = {
        break_reminders: document.getElementById('breakReminders').checked ? 1 : 0,
        medication_reminders: document.getElementById('medicationReminders').checked ? 1 : 0,
        milestones: document.getElementById('milestoneNotifications').checked ? 1 : 0,
        morning_motivation: document.getElementById('morningMotivation').checked ? 1 : 0,
        morning_time: document.getElementById('morningTime').value
      };

      const response = await fetch('/api/notifications/prefs', {
        method: 'PUT',
        headers: {
          'Authorization': \`Bearer \${localStorage.getItem('fbToken')}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prefs)
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      showToast('\u2705 Notification preferences saved', 'success');
    } catch (err) {
      console.error('Error saving notification prefs:', err.message);
      showToast('Failed to save preferences: ' + err.message, 'warning');
    }
  }

  /**
   * Check if notifications are enabled and update UI
   */
  async function updateNotificationUI() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      document.getElementById('notificationsEnabled').disabled = true;
      return;
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      const checkbox = document.getElementById('notificationsEnabled');
      const container = document.getElementById('notificationPrefsContainer');

      if (subscription) {
        checkbox.checked = true;
        container.style.display = 'block';
        loadNotificationPrefs();
      } else {
        checkbox.checked = false;
        container.style.display = 'none';
      }
    } catch (err) {
      console.warn('Error checking notification subscription:', err.message);
    }
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // SLACK INTEGRATION
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  /**
   * Load and display Slack integration status
   */
  async function loadSlackStatus() {
    if (!user) {
      document.getElementById('slackUpsell').style.display = 'block';
      document.getElementById('slackContainer').style.display = 'none';
      return;
    }

    // Gate Slack integration behind feature flag if present
    if (!isFeatureAvailable('slackIntegration')) {
      document.getElementById('slackUpsell').style.display = 'block';
      document.getElementById('slackContainer').style.display = 'none';
      return;
    }

    // User is Pro, show Slack UI
    document.getElementById('slackUpsell').style.display = 'none';
    document.getElementById('slackContainer').style.display = 'block';

    try {
      const response = await fetch('/api/integrations/slack', {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('fbToken')}\` }
      });

      if (response.ok) {
        const config = await response.json();
        if (config.configured) {
          document.getElementById('slackWebhookUrl').value = '***';
        }
      }
    } catch (err) {
      console.warn('Error loading Slack config:', err.message);
    }
  }

  /**
   * Save Slack webhook
   */
  async function saveSlackIntegration() {
    if (!user) {
      showToast('Must be logged in', 'warning');
      return;
    }

    const webhookUrl = document.getElementById('slackWebhookUrl').value.trim();
    if (!webhookUrl || !webhookUrl.startsWith('https://hooks.slack.com/')) {
      showToast('Invalid webhook URL', 'warning');
      return;
    }

    try {
      const response = await fetch('/api/integrations/slack', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${localStorage.getItem('fbToken')}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ webhook_url: webhookUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      showToast('\u2705 Slack webhook saved', 'success');
      document.getElementById('slackWebhookUrl').value = '';
    } catch (err) {
      showToast('Error: ' + err.message, 'warning');
    }
  }

  /**
   * Send test Slack message
   */
  async function testSlackWebhook() {
    if (!user) return;

    try {
      const response = await fetch('/api/integrations/slack/test', {
        method: 'POST',
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('fbToken')}\` }
      });

      if (!response.ok) throw new Error('Failed to send');
      showToast('\u2705 Test message sent to Slack', 'success');
    } catch (err) {
      showToast('Error: ' + err.message, 'warning');
    }
  }

  /**
   * Disconnect Slack
   */
  async function disconnectSlack() {
    if (!user) return;

    try {
      const response = await fetch('/api/integrations/slack', {
        method: 'DELETE',
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('fbToken')}\` }
      });

      if (!response.ok) throw new Error('Failed to disconnect');
      showToast('Slack disconnected', 'success');
      loadSlackStatus();
    } catch (err) {
      showToast('Error: ' + err.message, 'warning');
    }
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // BILLING & STRIPE
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  /**
   * Load billing status
   */
  async function loadBillingStatus() {
    if (!user) {
      document.getElementById('billingInfo').innerHTML = '<p style="font-size: 12px; color: #666;">Sign in to manage billing</p>';
      return;
    }

    try {
      const response = await fetch('/api/billing/status', {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('fbToken')}\` }
      });

      if (response.ok) {
        const billing = await response.json();
        const planText = billing.plan === 'free' ? 'Free' : billing.plan === 'pro' ? 'Pro ($5/month)' : 'Enterprise';
        document.getElementById('billingInfo').innerHTML = \`<p style="font-size: 12px; color: #666;">Current plan: <strong>\${planText}</strong></p>\`;
        
        if (billing.plan === 'free') {
          document.getElementById('billingBtn').textContent = 'Upgrade to Pro \u2014 $5/month';
          document.getElementById('billingBtn').onclick = () => initiateCheckout('pro');
        } else {
          document.getElementById('billingBtn').textContent = 'Manage Subscription';
          document.getElementById('billingBtn').onclick = () => openBillingPortal();
        }
      }
    } catch (err) {
      console.warn('Error loading billing status:', err.message);
    }
  }

  /**
   * Initiate Stripe checkout
   */
  async function initiateCheckout(plan) {
    if (!user) {
      showToast('Must be logged in', 'warning');
      return;
    }

    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${localStorage.getItem('fbToken')}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan })
      });

      if (!response.ok) throw new Error('Failed to create checkout');
      const result = await response.json();
      
      // Validate response structure and URL safety
      if (!result.url || typeof result.url !== 'string') {
        showToast('Invalid checkout response', 'warning');
        return;
      }
      
      // Strict URL validation - prevent open redirect attacks
      let urlObj;
      try {
        urlObj = new URL(result.url);
      } catch (err) {
        showToast('Invalid checkout URL format', 'warning');
        return;
      }
      
      // MUST use strict hostname matching (not .includes)
      const ALLOWED_CHECKOUT_HOSTS = [
        'checkout.stripe.com',
        'billing.stripe.com'
      ];
      
      if (!ALLOWED_CHECKOUT_HOSTS.includes(urlObj.hostname)) {
        console.error('Blocked untrusted checkout domain:', urlObj.hostname);
        showToast('Untrusted payment provider', 'warning');
        return;
      }
      
      // Verify HTTPS
      if (urlObj.protocol !== 'https:') {
        showToast('Payment URL must use HTTPS', 'warning');
        return;
      }
      
      // Safe to redirect
      window.location.href = result.url;
    } catch (err) {
      showToast('Error: ' + err.message, 'warning');
    }
  }

  /**
   * Open Stripe billing portal
   */
  async function openBillingPortal() {
    if (!user) return;

    try {
      const response = await fetch('/api/billing/portal', {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('fbToken')}\` }
      });

      if (!response.ok) throw new Error('Failed to open portal');
      const { url } = await response.json();
      window.open(url, '_blank');
    } catch (err) {
      showToast('Error: ' + err.message, 'warning');
    }
  }

  /**
   * Show upgrade modal
   */
  function showUpgradeModal(feature) {
    showToast(\`\u{1F512} \${feature} requires Pro subscription\`, 'info');
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // ANALYTICS VIEW
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  /**
   * Check if current user has Pro subscription.
   * Returns true if logged in with pro subscription.
   */
  function isProUser() {
    try {
      const user = safeJSONParse('fbUser', {});
      return user.subscription_tier === 'pro' || user.subscription_tier === 'enterprise';
    } catch (e) {
      return false;
    }
  }

  /**
   * Fetch feature flags from backend and cache in localStorage for 1 hour.
   * Sets \`window.userFeatures\` to an object of featureName -> boolean.
   */
  async function getFeatureFlags(force = false) {
    try {
      const cached = localStorage.getItem('fbFeatureFlags');
      if (!force && cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.expires && Date.now() < parsed.expires && parsed.features) {
          window.userFeatures = parsed.features;
          return parsed.features;
        }
      }

      const resp = await fetch('/api/features');
      if (!resp.ok) throw new Error('Failed to fetch feature flags');
      const data = await resp.json().catch(err => { console.warn('getFeatureFlags: failed to parse JSON:', err); return {}; });
      const features = (data && data.features) ? data.features : {};
      // Cache for 1 hour
      const payload = { features, expires: Date.now() + 60 * 60 * 1000 };
      try { localStorage.setItem('fbFeatureFlags', JSON.stringify(payload)); } catch (e) { /* ignore storage errors */ }
      window.userFeatures = features;
      return features;
    } catch (e) {
      // Fallback: keep existing window.userFeatures or empty object
      window.userFeatures = window.userFeatures || {};
      return window.userFeatures;
    }
  }

  /**
   * Check whether a feature is available for the current user.
   * Falls back to subscription-based \`isProUser()\` check when flags unavailable.
   */
  function isFeatureAvailable(name) {
    try {
      if (window.userFeatures && Object.prototype.hasOwnProperty.call(window.userFeatures, name)) {
        return Boolean(window.userFeatures[name]);
      }
    } catch (e) {
      // ignore
    }
    // Fallback behavior for legacy gating
    if (name === 'slackIntegration' || name === 'advancedAnalytics' || name === 'customReports') {
      return isProUser();
    }
    return false;
  }

  /**
   * Filter analytics data by time range (days).
   * Free users: capped at 7 days
   * Pro users: 7, 30, 90 days, or unlimited
   */
  let analyticsRange = 7; // Default to 7 days
  
  function filterAnalyticsRange(days) {
    // Gate 90+ day access behind Pro
    if (days >= 90 && !isProUser()) {
      showToast('\u{1F512} Upgrade to Pro to access longer time ranges', 'info');
      return;
    }

    analyticsRange = days;

    // Update button states
    document.querySelectorAll('[onclick*="filterAnalyticsRange"]').forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-secondary');
    });
    
    event.target.closest('button').classList.remove('btn-secondary');
    event.target.closest('button').classList.add('btn-primary');

    // Redraw all charts with new range
    drawAllCharts();
  }

  /**
   * Get events filtered by time range.
   */
  /**
   * Get analytics data - uses API for authenticated users, localStorage otherwise
   * @param {number} days - Number of days to fetch
   * @param {number} page - Pagination page (0-indexed)
   * @param {number} limit - Items per page (default 100)
   */
  async function getAnalyticsData(days, page = 0, limit = 100) {
    // For authenticated users with large datasets, use paginated API
    if (user && user.id) {
      try {
        const response = await apiCall(\`/events?days=\${days}&page=\${page}&limit=\${limit}\`);
        if (response && response.ok) {
          const data = await response.json();
          if (data.success && data.events) {
            return data.events;
          }
        }
      } catch (e) {
        warn('Failed to fetch paginated events from API, falling back to localStorage:', e.message);
        // Fall through to localStorage fallback
      }
    }
    
    // Fallback: use localStorage for offline or unauthenticated users
    fbEvents = safeJSONParse('fbEvents', []);
    const now = Date.now();
    const cutoff = now - (days === Infinity ? 1000 * 365 * 24 * 60 * 60 * 100 : days * 24 * 60 * 60 * 1000);
    
    const filtered = fbEvents.filter(e => {
      const eventTime = new Date(e.timestamp).getTime();
      return eventTime >= cutoff;
    });
    
    // Apply client-side pagination
    const offset = page * limit;
    return filtered.slice(offset, offset + limit);
  }

  /**
   * Get all analytics data synchronously from localStorage (for charts that need full dataset)
   * Use sparingly - for large datasets, prefer getAnalyticsData() with pagination
   */
  function getAnalyticsDataSync(days) {
    fbEvents = safeJSONParse('fbEvents', []);
    const now = Date.now();
    const cutoff = now - (days === Infinity ? 1000 * 365 * 24 * 60 * 60 * 100 : days * 24 * 60 * 60 * 1000);
    
    return fbEvents.filter(e => {
      const eventTime = new Date(e.timestamp).getTime();
      return eventTime >= cutoff;
    });
  }

  /**
   * Render Sessions Per Day bar chart.
   */
  function renderSessionsChart() {
    const canvas = document.getElementById('sessionsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const filteredEvents = getAnalyticsDataSync(analyticsRange);
    const dateCounts = {};

    // Count sessions by date
    filteredEvents.forEach(e => {
      if (e.type === 'session_complete' && e.data?.type === 'focus') {
        const date = e.timestamp.slice(0, 10);
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      }
    });

    const dates = Object.keys(dateCounts).sort();
    const counts = dates.map(d => dateCounts[d]);
    const maxCount = Math.max(...counts, 1);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6366f1';
    ctx.font = '12px Inter';

    const barWidth = Math.max(4, canvas.width / Math.max(dates.length, 7));
    const padding = 40;
    const chartHeight = canvas.height - padding * 2;

    dates.forEach((date, i) => {
      const x = padding + i * barWidth + barWidth * 0.15;
      const height = (counts[i] / maxCount) * chartHeight;
      const y = canvas.height - padding - height;

      ctx.fillRect(x, y, barWidth * 0.7, height);
    });

    // Y axis label
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'center';
    ctx.fillText(\`\${analyticsRange === Infinity ? 'All' : analyticsRange}d\`, canvas.width / 2, canvas.height - 15);
  }

  /**
   * Render Tool Usage horizontal bar chart.
   */
  function renderToolUsageChart() {
    const canvas = document.getElementById('toolUsageChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const filteredEvents = getAnalyticsData(analyticsRange);
    const toolCounts = {};

    // Count tool uses
    filteredEvents.forEach(e => {
      if (e.tool && (e.type === 'tool_use' || e.type === 'session_complete')) {
        toolCounts[e.tool] = (toolCounts[e.tool] || 0) + 1;
      }
    });

    const tools = Object.keys(toolCounts).sort((a, b) => toolCounts[b] - toolCounts[a]).slice(0, 6);
    const maxCount = Math.max(...tools.map(t => toolCounts[t]), 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#8b5cf6';
    ctx.font = '12px Inter';
    ctx.textAlign = 'left';

    const barHeight = canvas.height / 7;
    tools.forEach((tool, i) => {
      const count = toolCounts[tool];
      const width = (count / maxCount) * (canvas.width - 100);
      const y = i * barHeight + barHeight * 0.3;

      ctx.fillRect(80, y, width, barHeight * 0.4);
      ctx.fillStyle = '#6b7280';
      ctx.fillText(tool, 5, y + barHeight * 0.3);
      ctx.fillStyle = '#8b5cf6';
    });
  }

  /**
   * Render Energy Trend line chart.
   */
  function renderEnergyChart() {
    const canvas = document.getElementById('energyChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const filteredEvents = getAnalyticsData(analyticsRange);
    const energyEvents = filteredEvents.filter(e => e.type === 'energy_log' && e.data?.energy);

    if (energyEvents.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('No energy data', canvas.width / 2, canvas.height / 2);
      return;
    }

    const values = energyEvents.map(e => e.data.energy || 5);
    const avgEnergy = (values.reduce((a, b) => a + b) / values.length).toFixed(1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'url(#energyGradient)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const padding = 30;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    values.forEach((val, i) => {
      const x = padding + (i / values.length) * chartWidth;
      const y = canvas.height - padding - (val / 10) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Draw avg line
    ctx.strokeStyle = '#ec4899';
    ctx.setLineDash([5, 5]);
    const avgY = canvas.height - padding - (avgEnergy / 10) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding, avgY);
    ctx.lineTo(canvas.width - padding, avgY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /**
   * Render 52-week activity heatmap.
   */
  function renderHeatmap() {
    const canvas = document.getElementById('heatmapChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const filteredEvents = getAnalyticsData(Infinity); // Always full year
    const dateCounts = {};

    filteredEvents.forEach(e => {
      if (e.type === 'session_complete') {
        const date = e.timestamp.slice(0, 10);
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      }
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellSize = 12;
    const gap = 2;
    const now = new Date();
    let dayOffset = 0;

    // Draw 52 weeks \xD7 7 days
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(now);
        date.setDate(date.getDate() - dayOffset);
        const dateStr = date.toISOString().slice(0, 10);
        const count = dateCounts[dateStr] || 0;

        // Color intensity based on activity
        let color = '#e5e7eb';
        if (count > 0) color = count <= 2 ? '#c7d2fe' : count <= 5 ? '#818cf8' : '#4f46e5';

        ctx.fillStyle = color;
        ctx.fillRect(
          week * (cellSize + gap),
          day * (cellSize + gap),
          cellSize,
          cellSize
        );

        dayOffset++;
      }
    }
  }

  /**
   * Draw all charts with current range.
   */
  function drawAllCharts() {
    renderSessionsChart();
    renderToolUsageChart();
    renderEnergyChart();
    renderHeatmap();
  }

  /**
   * Export analytics data as CSV.
   */
  function exportCSV() {
    const filteredEvents = getAnalyticsData(analyticsRange);
    let csv = 'Date,Time,Event Type,Tool,Duration (Minutes),Energy Level,Mood,Notes\\n';

    filteredEvents.forEach(e => {
      const eventDate = new Date(e.timestamp);
      const date = eventDate.toLocaleDateString('en-US');
      const time = eventDate.toLocaleTimeString('en-US');
      const energyLevel = e.data?.energy || '';
      const mood = e.data?.mood || '';
      const notes = e.data?.notes ? e.data.notes.replace(/"/g, '""') : '';
      const duration = e.duration_seconds ? Math.round(e.duration_seconds / 60) : '';
      
      csv += \`"\${date}","\${time}","\${e.type}","\${e.tool || ''}",\${duration},"\${energyLevel}","\${mood}","\${notes}"\\n\`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`focusbro-export-\${new Date().toISOString().slice(0, 10)}.csv\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('\u2705 CSV exported successfully', 'success');
  }

  /**
   * Export analytics data as JSON.
   */
  function exportJSON() {
    if (!isProUser()) {
      showToast('\u{1F512} JSON export available with Pro upgrade', 'info');
      return;
    }

    const btn = document.querySelector('[onclick*="exportJSON"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '\u23F3 Exporting...';
    }

    setTimeout(() => {
      try {
        const filteredEvents = getAnalyticsDataSync(analyticsRange);
        const data = {
          exported_at: new Date().toISOString(),
          range_days: analyticsRange === Infinity ? 'all' : analyticsRange,
          event_count: filteredEvents.length,
          events: filteredEvents
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`focusbro-analytics-\${new Date().toISOString().slice(0, 10)}.json\`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('\u2705 JSON exported successfully', 'success');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = '\u{1F4E5} Download JSON';
        }
      }
    }, 0);
  }

  /**
   * Export analytics as PDF via print dialog.
   * Generates a styled PDF report document.
   */
  function exportPDF() {
    if (!isProUser()) {
      showToast('\u{1F512} PDF export available with Pro upgrade', 'info');
      return;
    }
    
    // Show progress feedback
    const btn = document.querySelector('[onclick*="exportPDF"]');
    const originalText = btn ? btn.textContent : 'Generating PDF';
    if (btn) {
      btn.disabled = true;
      btn.textContent = '\u23F3 Generating...';
    }

    const stats = getAnalyticsSummary();
    const user = JSON.parse(localStorage.getItem('fbUser') || '{}');
    const filteredEvents = getAnalyticsDataSync(analyticsRange);
    
    const rangeText = analyticsRange === Infinity ? 'All Time' : \`Last \${analyticsRange} Days\`;
    const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Build HTML report
    const reportHtml = \`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FocusBro Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.6; }
    
    @media print {
      body { font-size: 10pt; }
      .no-print { display: none; }
      h2 { page-break-before: always; }
      h2:first-of-type { page-break-before: avoid; }
      table { page-break-inside: avoid; margin-bottom: 20px; }
      .section { page-break-inside: avoid; }
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 20px;
    }
    .header h1 { font-size: 28px; color: #6366f1; margin-bottom: 5px; }
    .header p { color: #666; font-size: 12px; }
    
    .report-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      font-size: 11px;
      color: #666;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #f9f9f9;
      padding: 15px;
      border-left: 3px solid #6366f1;
      border-radius: 4px;
    }
    .stat-label { font-size: 11px; color: #666; text-transform: uppercase; }
    .stat-value { font-size: 24px; font-weight: bold; color: #6366f1; margin-top: 5px; }

    h2 { font-size: 16px; color: #333; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    h3 { font-size: 13px; color: #555; margin-top: 15px; margin-bottom: 10px; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    th { background: #f0f0f0; padding: 8px; text-align: left; font-weight: 600; border-bottom: 1px solid #ddd; }
    td { padding: 8px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) { background: #f9f9f9; }

    .section { margin-bottom: 25px; }
    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 9px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>\u{1F9E0} FocusBro Analytics Report</h1>
    <p>\${rangeText} \u2022 Generated \${reportDate}</p>
  </div>

  <div class="report-meta">
    <div>User: \${sanitizeForHTML(user.email || 'Anonymous')}</div>
    <div>Report Range: \${rangeText}</div>
  </div>

  <!-- Summary Stats -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">\u{1F525} Current Streak</div>
      <div class="stat-value">\${stats.currentStreak}</div>
      <div style="font-size: 10px; color: #999;">days</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Longest Streak</div>
      <div class="stat-value">\${stats.longestStreak}</div>
      <div style="font-size: 10px; color: #999;">days</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">\u{1F4CA} Total Sessions</div>
      <div class="stat-value">\${stats.totalSessions}</div>
      <div style="font-size: 10px; color: #999;">all time</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">\u23F1 Focus Time</div>
      <div class="stat-value">\${stats.totalFocusHours}h</div>
      <div style="font-size: 10px; color: #999;">total</div>
    </div>
  </div>

  <!-- Recent Sessions Table -->
  <div class="section">
    <h2>Recent Focus Sessions</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Duration</th>
          <th>Energy</th>
          <th>Mood</th>
        </tr>
      </thead>
      <tbody>
        \${filteredEvents
          .filter(e => e.type === 'session_complete' && e.data?.type === 'focus')
          .slice(0, 20)
          .map(e => {
            const d = new Date(e.timestamp);
            return '<tr><td>' + d.toLocaleDateString() + '</td><td>' + d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) + '</td><td>' + Math.round(e.duration_seconds / 60) + ' min</td><td>-</td><td>-</td></tr>';
          })
          .join('')}
      </tbody>
    </table>
  </div>

  <!-- Tool Usage Breakdown -->
  <div class="section">
    <h2>Tool Usage Summary</h2>
    \${(() => {
      const toolCounts = {};
      filteredEvents.forEach(e => {
        if (e.tool && (e.type === 'tool_use' || e.type === 'session_complete')) {
          toolCounts[e.tool] = (toolCounts[e.tool] || 0) + 1;
        }
      });
      const sorted = Object.entries(toolCounts).sort((a, b) => b[1] - a[1]);
      if (sorted.length === 0) return '<p style="color: #999; font-size: 11px;">No tool usage data available.</p>';
      const rows = sorted.map(([tool, count]) => '<tr><td>' + tool + '</td><td style="text-align: center;">' + count + '</td></tr>').join('');
      return '<table style="width: auto;"><thead><tr><th>Tool</th><th style="text-align: center;">Uses</th></tr></thead><tbody>' + rows + '</tbody></table>';
    })()}
  </div>

  <!-- Energy Log Table -->
  <div class="section">
    <h2>Energy & Mood Log</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Energy</th>
          <th>Mood</th>
        </tr>
      </thead>
      <tbody>
        \${filteredEvents
          .filter(e => e.type === 'energy_log')
          .slice(0, 30)
          .map(e => {
            const d = new Date(e.timestamp);
            return '<tr><td>' + d.toLocaleDateString() + '</td><td>' + d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) + '</td><td>' + (e.data?.energy || '-') + '/5</td><td>' + (e.data?.mood || '-') + '</td></tr>';
          })
          .join('') || '<tr><td colspan="4" style="text-align: center; color: #999;">No energy log entries</td></tr>'}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>FocusBro \u2022 https://focusbro.net</p>
    <p>This report is confidential and contains your personal focus and wellness data.</p>
  </div>
</body>
</html>
    \`;

    // Open in new window and print
    const win = window.open('', '', 'height=600,width=800');
    try {
      win.document.write(reportHtml);
      win.document.close();
      
      setTimeout(() => {
        win.print();
        // Close window after user closes print dialog
        win.onafterprint = () => {
          win.close();
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
          }
          showToast('\u2705 PDF generated successfully', 'success');
        };
      }, 500);
    } catch (e) {
      error('PDF generation failed:', e);
      showToast('\u274C Failed to generate PDF', 'error');
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    }
  }

  // Hamburger menu toggle
  document.getElementById('menuToggle').addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('menuBackdrop');
    const hamburger = document.getElementById('menuToggle');
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', sidebar.classList.contains('open'));
  });

  // Close menu when clicking nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.getElementById('menuBackdrop');
      const hamburger = document.getElementById('menuToggle');
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking on backdrop
  document.getElementById('menuBackdrop').addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('menuBackdrop');
    const hamburger = document.getElementById('menuToggle');
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });

  // Keyboard: close menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.getElementById('menuBackdrop');
      const hamburger = document.getElementById('menuToggle');
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  function showToast(message, type = 'info') {
  monitorStorageSize(); // Check storage with each toast (frequent user action points)
    const toast = document.createElement('div');
    toast.className = \`toast \${type}\`;
    toast.innerHTML = \`<div class="toast-message">\${escapeHtml(message)}</div><button class="toast-close" onclick="this.parentElement.remove()">\xD7</button>\`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Safely parse JSON from localStorage and other sources
   * @param {string} key - localStorage key
   * @param {*} defaultValue - Return value if parsing fails (default: [])
   * @returns {*} Parsed value or defaultValue
   */
  function safeJSONParse(key, defaultValue = []) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      const parsed = JSON.parse(item);
      return parsed !== null && parsed !== undefined ? parsed : defaultValue;
    } catch (e) {
      console.warn(\`\u26A0\uFE0F  Failed to parse localStorage[\${key}], using default:\`, e.message);
      return defaultValue;
    }
  }

  /**
   * Safely parse JSON from a string
   * @param {string} json - JSON string
   * @param {*} defaultValue - Return value if parsing fails
   * @returns {*} Parsed value or defaultValue
   */
  function safeParse(json, defaultValue = null) {
    try {
      return json ? JSON.parse(json) : defaultValue;
    } catch (e) {
      console.warn('Failed to parse JSON:', e.message);
      return defaultValue;
    }
  }

  /**
   * Sanitize HTML for safe insertion into templates
   * @param {*} value - Value to sanitize
   * @returns {string} Sanitized text
   */
  function sanitizeForHTML(value) {
    if (value === null || value === undefined) return '';
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(value).replace(/[&<>"']/g, char => escapeMap[char]);
  }

  // Form validation
  function validateEmail(email) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  }

  function validatePassword(password) {
    return password.length >= 8;
  }

  function clearFormErrors() {
    document.getElementById('emailError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('email').classList.remove('error');
    document.getElementById('password').classList.remove('error');
  }

  function showFormError(field, message) {
    const errorEl = document.getElementById(field + 'Error');
    const inputEl = document.getElementById(field);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      inputEl.classList.add('error');
    }
  }

  // Authentication
  function toggleAuthMode() {
    authMode = authMode === 'signin' ? 'signup' : 'signin';
    clearFormErrors();
    document.getElementById('authTitle').textContent = authMode === 'signin' ? 'Sign In' : 'Create Account';
    document.getElementById('authToggle').textContent = authMode === 'signin' ? 'Create account instead' : 'Sign in instead';
    document.getElementById('authBtn2').textContent = authMode === 'signin' ? 'Sign In' : 'Create Account';
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // API HELPER FUNCTIONS
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function getAuthToken() {
    return localStorage.getItem('fbToken');
  }

  /**
   * Make authenticated API call with automatic token refresh on 401
   * Handles both successful responses and failures gracefully
   * On 401 (token expired): automatically refreshes token and retries original request
   * Includes offline detection and retry logic with exponential backoff
   * 
   * @param {string} endpoint - API endpoint path (e.g. '/sync/data', '/events')
   * @param {object} options - Fetch options: { method: 'GET'|'POST'|'PUT'|'DELETE', body?: string, headers?: object }
   * @param {boolean} retryWithRefresh - If true, retry with token refresh on 401 (default: true)
   * @returns {Promise<Response>} Fetch API Response object with status, ok, json() methods
   * @throws {Error} Only on network errors or invalid parameters; API errors return Response with error status
   * 
   * @example
   * const response = await apiCall('/sync/data', {
   *   method: 'POST',
   *   body: JSON.stringify({ events: [...] })
   * });
   * const data = await response.json();
   */
  async function apiCall(endpoint, options = {}, retryWithRefresh = true) {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = \`Bearer \${token}\`;
    }

    try {
      const response = await fetch(\`\${env.API_ORIGIN}\${endpoint}\`, {
        ...options,
        headers,
      });

      if (response.status === 401 && retryWithRefresh && token) {
        // Token expired - attempt refresh
        console.warn('[Auth] Token expired (401), attempting refresh...');
        try {
          const refreshResponse = await fetch(\`\${env.API_ORIGIN}/auth/refresh\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${token}\`
            }
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.token && refreshData.user_id) {
              // Store new token
              localStorage.setItem('fbToken', refreshData.token);
              localStorage.setItem('fbUserId', refreshData.user_id);
              showToast('Session refreshed', 'success');
              
              // Retry original request with new token
              return apiCall(endpoint, options, false);
            }
          }
        } catch (refreshErr) {
          console.error('[Auth] Token refresh failed:', refreshErr.message);
        }
        
        // Refresh failed - force logout
        logout();
        showToast('Session expired. Please log in again.', 'error');
        return null;
      }

      return response;
    } catch (fetchErr) {
      // Check if this is a network error
      if (!navigator.onLine) {
        console.warn('[Network] Offline - request would fail');
        showToast('No internet connection', 'warning');
        return null;
      }
      throw fetchErr;
    }
  }

  /**
   * Retry wrapper for async operations with exponential backoff
   * Automatically retries transient failures (network errors, 5xx status codes)
   * Does NOT retry permanent failures (401, 400, 404, 409)
   * 
   * @param {Function} operation - Async function to execute (should return Response or throw)
   * @param {number} maxRetries - Maximum retry attempts (default: 3, so 1 initial + 3 retries = 4 total attempts)
   * @param {number} baseDelay - Initial delay in milliseconds (default: 1000). Doubles each retry: 1s, 2s, 4s
   * @returns {Promise<any>} Result of successful operation execution
   * @throws {Error} Last error if all retries exhausted
   * 
   * @example
   * const success = await withRetry(
   *   async () => await apiCall('/sync/data', { method: 'POST', body: JSON.stringify(data) }),
   *   3,
   *   1000
   * );
   */
  async function withRetry(operation, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          console.error(\`[Retry] Failed after \${maxRetries} attempts:\`, error.message);
          throw error;
        }
        
        // Check if error is retryable (network timeout, 5xx errors, etc.)
        const isRetryable = error.message.includes('fetch') || 
                           error.message.includes('timeout') ||
                           error.status >= 500;
        
        if (isRetryable) {
          const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
          console.warn(\`[Retry] Attempt \${attempt} failed, retrying in \${delay}ms...\`, error.message);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error; // Don't retry non-transient errors
        }
      }
    }
  }

  /**
   * Sync user data to server with automatic retry
   * Compresses and uploads all local application state to backend
   * Includes settings, statistics, streaks, and all user configuration
   * Runs automatically every 5 minutes when authenticated
   * Only syncs if user is logged in; silently returns if not authenticated
   * 
   * @returns {Promise<boolean>} True if sync succeeded, false/undefined if failed or not authenticated
   * @fires syncInterval - Automatically called via setInterval every 5 minutes
   * @fires window.online - Automatically called when network comes back online
   * 
   * @example
   * // Called periodically:
   * syncInterval = setInterval(syncDataToServer, 5 * 60 * 1000); // Every 5 minutes
   * 
   * // Or manually:
   * await syncDataToServer();
   */
  async function syncDataToServer() {
    if (!user) return; // Not authenticated

    try {
      return await withRetry(async () => {
        const response = await apiCall('/sync/data', {
          method: 'POST',
          body: JSON.stringify({
            sessionCount,
            energyLogs,
            pomodoroSettings: {
              duration: parseInt(localStorage.getItem('settingsPomodoro') || '25'),
              breakDuration: parseInt(localStorage.getItem('settingsBreak') || '5'),
            },
            synced_at: new Date().toISOString(),
          }),
        });

        if (response && response.ok) {
          console.debug('\u2713 Data synced to server');
          return true;
        } else if (response) {
          const errorData = await response.json().catch(err => { console.warn('syncDataToServer: failed to parse error body:', err); return {}; });
          console.warn('\u26A0 Data sync failed:', response.status, errorData.error || response.statusText);
          
          // Don't retry on 401 (auth error) or 400 (bad request)
          if (response.status === 401 || response.status === 400) {
            throw new Error(\`Non-retryable error: \${response.status}\`);
          }
        }
        return false;
      }, 3, 1000);
    } catch (error) {
      console.error('[Sync] Data sync failed after retries:', error.message);
      return false;
    }
  }

  /**
   * Sync unsynced events to backend with automatic retry and response validation
   * Sends all events with synced=false to /events endpoint
   * Validates response structure and marks successfully synced events
   * Called periodically every 5 minutes when authenticated
   * Only syncs if user is logged in; silently returns if not authenticated
   * 
   * @returns {Promise<boolean|undefined>} True if sync succeeded, false if failed, undefined if not authenticated
   * @fires syncInterval - Automatically called via setInterval every 5 minutes
   * @fires window.online - Automatically called when network comes back online
   * 
   * @example
   * // Called periodically:
   * syncInterval = setInterval(syncEventQueue, 5 * 60 * 1000); // Every 5 minutes
   * 
   * // Or manually:
   * await syncEventQueue();
   */
  async function syncEventQueue() {
    if (!user) return; // Not authenticated
    
    // Load current events
    fbEvents = safeJSONParse('fbEvents', []);
    
    // Find unsynced events
    const unsyncedEvents = fbEvents.filter(e => !e.synced);
    
    if (unsyncedEvents.length === 0) return; // Nothing to sync
    
    try {
      return await withRetry(async () => {
        const response = await apiCall('/events', {
          method: 'POST',
          body: JSON.stringify({ events: unsyncedEvents }),
        });

        if (response && response.ok) {
          const result = await response.json();
          
          // Validate response has accepted_ids array
          if (!result.accepted_ids || !Array.isArray(result.accepted_ids)) {
            console.warn('[Sync] Invalid response: missing accepted_ids array');
            throw new Error('Invalid sync response');
          }
          
          // Mark synced events in localStorage
          fbEvents.forEach(e => {
            if (result.accepted_ids.includes(e.id)) {
              e.synced = true;
            }
          });
          localStorage.setItem('fbEvents', JSON.stringify(fbEvents));
          console.debug(\`\u2713 Synced \${result.accepted_ids.length} events to backend\`);
          return true;
        } else if (response) {
          const errorData = await response.json().catch(err => { console.warn('syncEventQueue: failed to parse error body:', err); return {}; });
          console.warn('[Sync] Event sync failed:', response.status, errorData.error);
          
          // Don't retry on 401 or 400
          if (response.status === 401 || response.status === 400) {
            throw new Error(\`Non-retryable error: \${response.status}\`);
          }
        }
        return false;
      }, 3, 1000);
    } catch (e) {
      console.error('[Sync] Event sync failed after retries:', e.message);
      return false;
    }
  }

  /**
   * Fetch feature flags from backend based on user's subscription tier
   * Returns availability of premium features (dark mode, advanced analytics, etc.)
   * Caches result in localStorage for 1 hour to avoid repeated API calls
   * Falls back to free tier features if not authenticated
   * 
   * @returns {Promise<Object>} Object with feature names as keys and boolean availability as values
   * @example
   * const features = await getFeatureFlags();
   * if (features.darkModeApi) {
   *   // Dark mode API access enabled for this user's tier
   * }
   */
  async function getFeatureFlags() {
    // Check cache first (1 hour TTL)
    const cached = localStorage.getItem('fbFeatureFlags');
    const cacheTime = localStorage.getItem('fbFeatureFlagsTime');
    const now = Date.now();
    
    if (cached && cacheTime && (now - parseInt(cacheTime)) < 3600000) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.warn('[Features] Cache parse failed:', e.message);
        // Continue to fetch fresh
      }
    }
    
    try {
      const response = await apiCall('/features');
      
      if (response && response.ok) {
        const data = await response.json();
        
        // Validate response structure
        if (!data.features || typeof data.features !== 'object') {
          console.warn('[Features] Invalid response structure');
          return {}; // Return empty features
        }
        
        // Cache the features for 1 hour
        localStorage.setItem('fbFeatureFlags', JSON.stringify(data.features));
        localStorage.setItem('fbFeatureFlagsTime', now.toString());
        
        console.debug('[Features] Flags retrieved:', Object.keys(data.features).filter(k => data.features[k]).length, 'enabled');
        return data.features;
      } else {
        console.warn('[Features] Failed to fetch flags:', response?.status);
        return {}; // Return empty features on error
      }
    } catch (error) {
      console.error('[Features] Fetch failed:', error.message);
      return {}; // Return empty features on error
    }
  }

  async function handleAuth(event) {
    // Allow event to be passed (from form submission) or called without event
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    clearFormErrors();

    // Validation
    if (!email) {
      showFormError('email', 'Email required');
      return;
    }
    if (!validateEmail(email)) {
      showFormError('email', 'Invalid email');
      return;
    }
    if (!password) {
      showFormError('password', 'Password required');
      return;
    }
    if (!validatePassword(password)) {
      showFormError('password', 'Min 8 characters');
      return;
    }

    // Use loading state wrapper
    return await withLoadingState('authBtn2', async () => {
      try {
        const endpoint = authMode === 'signin' ? '/auth/login' : '/auth/register';
        const response = await fetch(\`\${env.API_ORIGIN}\${endpoint}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          showFormError('email', data.error || 'Invalid email or password');
          return;
        }

        // \u2705 VALIDATION: Validate session response has required fields
        if (!data.user_id || !data.token || !data.session_id) {
          console.error('[Auth] Invalid response structure:', { user_id: !!data.user_id, token: !!data.token, session_id: !!data.session_id });
          showFormError('email', 'Server response incomplete - try again');
          return;
        }

        // \u2705 TYPE VALIDATION: Ensure token and session_id are strings
        if (typeof data.token !== 'string' || typeof data.session_id !== 'string') {
          console.error('[Auth] Invalid token/session types');
          showFormError('email', 'Authentication failed - invalid response');
          return;
        }

        // Store user and token
        user = { email, name: email.split('@')[0], id: data.user_id };
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        
        // Store session data
        localStorage.setItem('fbUser', JSON.stringify(user));
        localStorage.setItem('fbToken', data.token);
        localStorage.setItem('fbSessionId', data.session_id);
        
        // Add expiration metadata
        const expirationDays = rememberMe ? 30 : 1; // 30 days if remembered, 1 day default
        const expirationTime = Date.now() + (expirationDays * 24 * 60 * 60 * 1000);
        localStorage.setItem('fbSessionExpiration', expirationTime.toString());
        localStorage.setItem('fbRemembered', rememberMe ? 'true' : 'false');

        // Ensure modal is fully closed before showing success message
        closeModal('authModal');
        
        // Small delay to ensure DOM state is consistent before updating UI
        setTimeout(() => {
          updateUI();
          showToast(\`\${authMode === 'signin' ? 'Welcome back' : 'Account created'}! \${user.name}\`, 'success');
          authMode = 'signin';
        }, 50);
      } catch (e) {
        error('Auth error:', e);
        showFormError('email', 'Network error - try again');
    }
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // RESOURCE CLEANUP & LIFECYCLE
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function cleanupAllTimers() {
    // Clear all active timers and intervals to prevent memory leaks
    if (pomodoroTimer) clearInterval(pomodoroTimer);
    if (medInterval) clearInterval(medInterval);
    if (medDisplayInterval) clearInterval(medDisplayInterval);
    if (syncInterval) clearInterval(syncInterval);
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    if (bodyScanInterval) clearInterval(bodyScanInterval);
    if (meditationTimer) clearInterval(meditationTimer);
    if (activityInterval) clearInterval(activityInterval);
    
    pomodoroTimer = null;
    medInterval = null;
    medDisplayInterval = null;
    syncInterval = null;
    keepAliveInterval = null;
    bodyScanInterval = null;
    meditationTimer = null;
    activityInterval = null;
  }

  function logout() {
    cleanupAllTimers();
    user = null;
    localStorage.removeItem('fbUser');
    localStorage.removeItem('fbToken');
    localStorage.removeItem('fbSessionId');
    updateUI();
    showToast('Logged out');
  }

  function updateUI() {
    const appNav = document.getElementById('appNav');
    const authBtn = document.getElementById('authBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userDisplay = document.getElementById('userDisplay');
    const keyboardHint = document.getElementById('keyboardHint');

    // Navigation always visible (tools work without login)
    appNav.style.display = 'block';
    keyboardHint.style.display = 'inline';
    switchView('dashboard');

    // Auth button visibility depends on login status
    if (user) {
      authBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
      userDisplay.style.display = 'block';
      userDisplay.textContent = user.email;
    } else {
      authBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
      userDisplay.style.display = 'none';
    }

    // Update analytics cards
    updateDashboardStats();
  }

  /**
   * Refresh dashboard statistics from event log.
   * Called on page load and whenever dashboard is viewed.
   */
  function updateDashboardStats() {
    const stats = getAnalyticsSummary();
    
    document.getElementById('dashboardStreak').textContent = stats.currentStreak;
    document.getElementById('dashboardTotalSessions').textContent = stats.totalSessions;
    document.getElementById('dashboardFocusHours').textContent = stats.totalFocusHours + 'h';
  }

  // Modal management
  function openModal(id) {
    document.getElementById(id).classList.add('active');
    if (id === 'authModal') {
      setTimeout(() => document.getElementById('email').focus(), 100);
    }
  }

  // Track active timers by modal
  let activeModalTimers = {};

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    
    modal.classList.remove('active');
    
    // Clear any timers associated with this modal
    if (activeModalTimers[id] && Array.isArray(activeModalTimers[id])) {
      activeModalTimers[id].forEach(timerId => {
        if (timerId) clearInterval(timerId);
      });
      activeModalTimers[id] = [];
    }
    
    // Clear specific timer variables by modal type
    if (id === 'authModal') {
      clearFormErrors();
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
    } else if (id === 'bodyScanModal') {
      if (typeof bodyScanInterval !== 'undefined' && bodyScanInterval) {
        clearInterval(bodyScanInterval);
        bodyScanInterval = null;
      }
    } else if (id === 'meditationModal') {
      if (typeof meditationTimer !== 'undefined' && meditationTimer) {
        clearInterval(meditationTimer);
        meditationTimer = null;
      }
    } else if (id === 'pomodoroModal') {
      if (typeof pomodoroTimer !== 'undefined' && pomodoroTimer) {
        clearInterval(pomodoroTimer);
        pomodoroTimer = null;
      }
    } else if (id === 'presenceModal') {
      if (typeof activityInterval !== 'undefined' && activityInterval) {
        clearInterval(activityInterval);
        activityInterval = null;
      }
    }
    
  }



  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // MOTIVATIONAL GALLERY SYSTEM - 1000+ Work-Safe Images
  // Dynamic fetching from Pexels/Unsplash APIs with local SVG fallback
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  
  // Fallback SVG gallery (used if API unavailable)
  const FALLBACK_GALLERY = [
    {
      title: "Focus in the Flow",
      quote: "Your brain is a supernetwork. Let it do what it does best.",
      svg: '<svg viewBox="0 0 200 200"><defs><linearGradient id="flow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" /><stop offset="100%" style="stop-color:#0088ff;stop-opacity:1" /></linearGradient></defs><circle cx="100" cy="100" r="80" fill="none" stroke="url(#flow)" stroke-width="2" opacity="0.3"/><circle cx="100" cy="100" r="60" fill="none" stroke="url(#flow)" stroke-width="2" opacity="0.5"/><circle cx="100" cy="100" r="40" fill="none" stroke="url(#flow)" stroke-width="3" opacity="0.8"/><circle cx="100" cy="100" r="8" fill="url(#flow)"/><g opacity="0.6"><circle cx="60" cy="80" r="4" fill="#00ff88"/><circle cx="140" cy="90" r="4" fill="#0088ff"/><circle cx="80" cy="140" r="4" fill="#00ff88"/><circle cx="130" cy="130" r="4" fill="#0088ff"/></g></svg>'
    },
    {
      title: "ADHD is Your Superpower",
      quote: "Different isn't broken. You think differently, and that's your edge.",
      svg: '<svg viewBox="0 0 200 200"><defs><linearGradient id="power" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff006e;stop-opacity:1" /><stop offset="100%" style="stop-color:#ffb400;stop-opacity:1" /></linearGradient></defs><path d="M100,20 L140,80 L200,90 L150,140 L160,200 L100,160 L40,200 L50,140 L0,90 L60,80 Z" fill="url(#power)" opacity="0.9"/><circle cx="100" cy="100" r="30" fill="none" stroke="#ffb400" stroke-width="2"/></svg>'
    },
    {
      title: "Energy Spike Incoming",
      quote: "You've got the juice to crush this. Let it out.",
      svg: '<svg viewBox="0 0 200 200"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M100,10 L150,80 L140,130 L100,150 L60,130 L50,80 Z" fill="none" stroke="#ffd60a" stroke-width="3" filter="url(#glow)" opacity="0.9"/><g opacity="0.7"><line x1="100" y1="60" x2="100" y2="20" stroke="#ffd60a" stroke-width="2"/><line x1="140" y1="80" x2="160" y2="60" stroke="#ffd60a" stroke-width="2"/><line x1="130" y1="130" x2="150" y2="150" stroke="#ffd60a" stroke-width="2"/></g></svg>'
    },
    {
      title: "Momentum Builds on Movement",
      quote: "Every session is a step forward. Keep climbing.",
      svg: '<svg viewBox="0 0 200 200"><defs><linearGradient id="climb" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" /><stop offset="100%" style="stop-color:#00ff88;stop-opacity:1" /></linearGradient></defs><path d="M30,160 L60,120 L90,90 L120,60 L150,30" fill="none" stroke="url(#climb)" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="160" r="6" fill="#6366f1"/><circle cx="60" cy="120" r="6" fill="#6366f1"/><circle cx="90" cy="90" r="6" fill="#6366f1"/><circle cx="120" cy="60" r="6" fill="#6366f1"/><circle cx="150" cy="30" r="7" fill="#00ff88" filter="url(#glow)"/></svg>'
    },
    {
      title: "Brain Power Activated",
      quote: "Neurochemistry on your side. Your focus is your weapon.",
      svg: '<svg viewBox="0 0 200 200"><defs><linearGradient id="brain" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" /><stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" /></linearGradient></defs><g fill="url(#brain)"><path d="M100,50 Q80,50 70,65 Q60,50 50,50 Q30,50 30,70 Q30,85 45,95 L45,140 Q50,150 60,155 L140,155 Q150,150 155,140 L155,95 Q170,85 170,70 Q170,50 150,50 Q140,50 130,65 Q120,50 100,50" opacity="0.6"/><circle cx="70" cy="90" r="5" fill="#00d4ff" opacity="0.9"/><circle cx="130" cy="90" r="5" fill="#6366f1" opacity="0.9"/><circle cx="100" cy="110" r="4" fill="#00ff88" opacity="0.9"/></g></svg>'
    }
  ];

  let currentGalleryIndex = 0;
  let galleryImages = [...FALLBACK_GALLERY];

  function getOrCreateUserId() {
    let userId = localStorage.getItem('focusbroUserId');
    if (!userId) {
      userId = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('focusbroUserId', userId);
    }
    return userId;
  }

  async function initGallery() {
			try {
				const userId = getOrCreateUserId();
				const category = 'random';

				// Fetch gallery from API with timeout and safe parse
				const controller = new AbortController();
				const timeout = setTimeout(() => controller.abort(), 5000);
				let response = null;
				try {
					const url = '/api/gallery?seed=' + encodeURIComponent(userId) + '&category=' + category + '&limit=12';
					response = await fetch(url, { signal: controller.signal });
				} catch (fetchErr) {
					console.warn('Gallery fetch failed:', fetchErr && fetchErr.message);
				} finally {
					clearTimeout(timeout);
				}

				let data = null;
				if (response && response.ok) {
					try { data = await response.json(); } catch (jsonErr) { console.warn('initGallery: invalid JSON from API:', jsonErr && jsonErr.message); }
					if (data && Array.isArray(data.images) && data.images.length > 0) {
						galleryImages = data.images.map(img => ({
							title: 'Motivational Image - ' + (data.category || category),
							quote: img.quote || 'Keep pushing. Every moment of focus counts.',
							url: img.url,
							alt: img.alt || 'Motivational image'
						}));
						log('\u2705 Loaded ' + galleryImages.length + ' images from API');
						currentGalleryIndex = 0;
						renderGallery();
						return;
					} else {
						console.warn('Gallery API returned no images or invalid data; using fallback.');
					}
				} else {
					console.warn('Gallery API non-OK response; using fallback.', response && response.status);
				}
			} catch (e) {
				console.warn('Gallery API unavailable, using fallback SVGs:', e && e.message);
			}

			// Fallback
			galleryImages = [...FALLBACK_GALLERY];
			currentGalleryIndex = 0;
			renderGallery();
		}

  function renderGallery() {
    const item = galleryImages[currentGalleryIndex];
    const galleryEl = document.getElementById('galleryImage');
    const quoteEl = document.getElementById('galleryQuote');
    const dotsEl = document.getElementById('galleryDots');

    if (!galleryEl || !quoteEl) return;

    // Set background image (either URL or SVG)
    if (item.url) {
      galleryEl.style.backgroundImage = \`url('\${item.url}')\`;
    } else if (item.svg) {
      const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(item.svg);
      galleryEl.style.backgroundImage = \`url('\${svgDataUrl}')\`;
    }

    // Update quote
    quoteEl.innerHTML = \`
      <h2>\${item.title}</h2>
      <p>\${item.quote}</p>
    \`;

    // Update dots
    dotsEl.innerHTML = galleryImages.map((_, i) => 
      \`<div class="gallery-dot \${i === currentGalleryIndex ? 'active' : ''}" onclick="setGalleryIndex(\${i})"></div>\`
    ).join('');
  }

  function rotateGallery(direction) {
    currentGalleryIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    renderGallery();
  }

  function setGalleryIndex(index) {
    currentGalleryIndex = index;
    renderGallery();
  }

  // View switching (all tools available, login only needed for persistent data)
  function switchView(view) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    const viewEl = document.getElementById(view + '-view');
    if (viewEl) viewEl.style.display = 'block';
    updateNavActive(view);

    // Initialize gallery for dashboard
    if (view === 'dashboard') {
      initGallery();
    }

    // Initialize analytics view if switching to it
    if (view === 'analytics') {
      updateDashboardStats(); // Update summary cards
      setTimeout(() => {
        const summary = getAnalyticsSummary();
        document.getElementById('analyticsStreak').textContent = summary.currentStreak;
        document.getElementById('longestStreakCard').textContent = summary.longestStreak;
        document.getElementById('totalSessionsCard').textContent = summary.totalSessions;
        document.getElementById('totalHoursCard').textContent = summary.totalFocusHours + 'h';
        
        // Draw charts after view is visible (canvas sizing)
        drawAllCharts();
      }, 50);
    }

    // Initialize settings view if switching to it
    if (view === 'settings') {
      updateNotificationUI();
      loadSlackStatus();
      loadBillingStatus();
    }
  }

  function updateNavActive(view) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.textContent.toLowerCase().includes(view === 'dopamine-menu' ? 'dopamine' : view === 'task-difficulty' ? 'task' : view === 'body-scan' ? 'body' : view)) {
        item.classList.add('active');
      }
    });
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // BREATHING
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function startBreathing(type) {
    const display = document.getElementById('breathing-display');
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');

    display.style.display = 'block';
    circle.classList.remove('box-breath', 'tactical');

    if (type === '4-7-8') {
      circle.textContent = '4-7-8';
      text.textContent = 'Inhale(4) - Hold(7) - Exhale(8)';
    } else if (type === 'box') {
      circle.classList.add('box-breath');
      circle.textContent = '4-4-4-4';
      text.textContent = 'Inhale - Hold - Exhale - Hold';
    } else {
      circle.classList.add('tactical');
      circle.textContent = 'TACTICAL';
      text.textContent = 'Combat breathing: 4 counts each';
    }

    showToast('Follow the circle movement', 'success');
  }

  function stopBreathing() {
    logEvent('tool_use', 'breathing');
    document.getElementById('breathing-display').style.display = 'none';
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // GROUNDING
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function initGrounding() {
    const senses = [
      { id: 'See', count: 5 },
      { id: 'Touch', count: 4 },
      { id: 'Hear', count: 3 },
      { id: 'Smell', count: 2 },
      { id: 'Taste', count: 1 }
    ];

    senses.forEach(sense => {
      let html = '';
      for (let i = 1; i <= sense.count; i++) {
        html += \`<div class="grounding-item" onclick="this.classList.toggle('completed')">\${i}</div>\`;
      }
      const el = document.getElementById('grounding' + sense.id);
      if (el) el.innerHTML = html;
    });

    switchView('grounding');
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // AUDIO GENERATION
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  let audioContext;
  function initAudioContext() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    return audioContext;
  }
  function playAmbientTone() {
    try {
      const ctx = initAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime, osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.frequency.value = 174; osc.type = 'sine';
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 60);
    } catch(e) {
      // \u2705 LOGGING: Log Web Audio API failures (device/browser incompatibility)
      console.debug('[Audio] Ambient tone failed:', e.message);
    }
  }
  function playNotificationChime() {
    try {
      const ctx = initAudioContext(), now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.4);
      });
    } catch(e) {
      // \u2705 LOGGING: Log Web Audio API failures (device/browser incompatibility)
      console.debug('[Audio] Notification chime failed:', e.message);
    }
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // BODY SCAN WITH LOGGING
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  let bodyScanInterval;
  let bodyScanData = [];
  function startBodyScan() {
    if (bodyScanInterval) clearInterval(bodyScanInterval);
    bodyScanData = [];
    document.getElementById('bodyScanStart').style.display = 'none';
    document.getElementById('bodyScanStop').style.display = 'inline-block';
    document.getElementById('bodyScanDisplay').style.display = 'block';
    playAmbientTone();
    const checks = ['Posture - Are shoulders back?', 'Shoulders - Notice any tension?', 'Jaw - Clenched or loose?', 'Back - Any pain or stiffness?'];
    let current = 0;
    bodyScanInterval = setInterval(() => {
      try {
        if (current >= checks.length) {
          stopBodyScan();
          try { playNotificationChime(); } catch(e) { console.debug('[BodyScan] Chime failed:', e.message); }
          showToast('Body scan complete! \u{1F4CA}', 'success');
          return;
        }
        const displayEl = document.getElementById('bodyScanDisplay');
        if (!displayEl) {
          console.warn('[Timer] Body scan display missing, stopping');
          stopBodyScan();
          return;
        }
        const check = checks[current];
        displayEl.innerHTML = \`<div style="font-size: 18px; font-weight: 700;">\${check}</div><div style="font-size: 12px; margin-top: 12px; color: var(--gray-400);">Take a slow breath...</div>\`;
        bodyScanData.push({ area: check.split(' - ')[0], timestamp: new Date().toISOString() });
        current++;
      } catch(e) {
        console.error('[Timer] Body scan update failed:', e.message);
        // Stop body scan on error to prevent cascading
        try { stopBodyScan(); } catch(e2) { console.error('[Timer] Body scan stop failed:', e2.message); }
      }
    }, 20000);
  }

  function stopBodyScan() {
    clearInterval(bodyScanInterval);
    if (bodyScanData.length > 0) logEvent('tool_use', 'body-scan', { checks: bodyScanData.length });
    document.getElementById('bodyScanDisplay').style.display = 'none';
    document.getElementById('bodyScanStart').style.display = 'inline-block';
    document.getElementById('bodyScanStop').style.display = 'none';
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // MEDITATION
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  let meditationTimer;
  let meditationStartTime;
  function startMeditation(minutes) {
    if (meditationTimer) clearInterval(meditationTimer);
    document.getElementById('meditationDisplay').style.display = 'block';
    meditationStartTime = Date.now();
    playAmbientTone(); // Background ambient sound
    let remaining = minutes * 60;
    const startTime = Date.now();

    meditationTimer = setInterval(() => {
      try {
        const timerEl = document.getElementById('meditationTimer');
        if (!timerEl) {
          console.warn('[Timer] Meditation timer element missing, stopping meditation');
          stopMeditation();
          return;
        }
        
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        remaining = Math.max(0, minutes * 60 - elapsed);

        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        timerEl.textContent = \`\${m}:\${String(s).padStart(2, '0')}\`;

        if (remaining <= 0) {
          stopMeditation();
          showToast('Meditation complete!', 'success');
        }
      } catch(e) {
        console.error('[Timer] Meditation update failed:', e.message);
        // Stop meditation on error to prevent further cascading
        try { stopMeditation(); } catch(e2) { console.error('[Timer] Meditation stop failed:', e2.message); }
      }
    }, 100); // Update frequently for accuracy
  }

  function stopMeditation() {
    clearInterval(meditationTimer);
    
    // Play completion chime using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a pleasant completion chime (two notes)
      const now = audioContext.currentTime;
      const noteDuration = 0.3; // seconds
      
      // First note: higher frequency (C5 = 523.25 Hz)
      playTone(audioContext, 523.25, now, noteDuration, 0.3);
      
      // Second note: even higher (E5 = 659.25 Hz)
      playTone(audioContext, 659.25, now + noteDuration, noteDuration, 0.4);
    } catch (e) {
      console.debug('Web Audio not available, chime skipped');\\n    }
    
    logEvent('tool_use', 'meditation');
    document.getElementById('meditationDisplay').style.display = 'none';
  }
  
  /**
   * Play a tone using Web Audio API
   * @param {AudioContext} ctx - Audio context
   * @param {number} freq - Frequency in Hz
   * @param {number} start - Start time (absolute)
   * @param {number} duration - Duration in seconds
   * @param {number} volume - Volume level (0-1)
   */\\n  function playTone(ctx, freq, start, duration, volume = 0.3) {\\n    try {\\n      const osc = ctx.createOscillator();\\n      const gain = ctx.createGain();\\n      \\n      osc.type = 'sine';\\n      osc.frequency.value = freq;\\n      \\n      gain.gain.setValueAtTime(volume, start);\\n      gain.gain.exponentialRampToValueAtTime(0.01, start + duration - 0.05);\\n      \\n      osc.connect(gain);\\n      gain.connect(ctx.destination);\\n      \\n      osc.start(start);\\n      osc.stop(start + duration);\\n    } catch (e) {\\n      console.debug('Tone generation failed:', e.message);\\n    }\\n  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // KEEP ALIVE - PC AWAKE & ACTIVITY SIMULATION
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  let wakeLockSentinel = null;
  let activityInterval = null;
  let activityStartTime = null;

  async function startWakeLock() {
    try {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      document.getElementById('wakeStatus').textContent = '\u2705 Active';
      document.getElementById('wakeStatus').style.color = 'var(--success)';
      document.getElementById('wakeStartBtn').style.display = 'none';
      document.getElementById('wakeStopBtn').style.display = 'inline-block';
      showToast('Screen wake lock enabled', 'success');
    } catch (err) {
      console.warn('Wake Lock failed, continuing with activity simulation:', err.message);
      document.getElementById('wakeStatus').textContent = '\u26A0\uFE0F Fallback';
      document.getElementById('wakeStatus').style.color = 'var(--warning)';
      showToast('Wake Lock unavailable, using activity simulation', 'warning');
    }
  }

  function stopWakeLock() {
    if (wakeLockSentinel) {
      wakeLockSentinel.release();
      wakeLockSentinel = null;
    }
    document.getElementById('wakeStatus').textContent = '\xB7';
    document.getElementById('wakeStatus').style.color = 'var(--gray-400)';
    document.getElementById('wakeStartBtn').style.display = 'inline-block';
    document.getElementById('wakeStopBtn').style.display = 'none';
    showToast('Screen wake lock disabled', 'success');
  }

  function startActivitySimulation() {
    activityStartTime = Date.now();
    document.getElementById('activityStatus').textContent = '\u2705 Active';
    document.getElementById('activityStatus').style.color = 'var(--success)';
    document.getElementById('activityStartBtn').style.display = 'none';
    document.getElementById('activityStopBtn').style.display = 'inline-block';
    
    // Simulate activity with highly variable intervals to avoid pattern detection
    activityInterval = setInterval(() => {
      try {
        simulateActivity();
        updatePresenceTimer();
      } catch(e) {
        console.error('[Activity] Simulation step failed:', e.message);
        // Continue activity simulation despite individual failures
      }
    }, 2000 + Math.random() * 56000); // 2-58 seconds (unpredictable, harder to detect)
    
    updatePresenceTimer();
    showToast('Activity simulation started', 'success');
  }

  function stopActivitySimulation() {
    if (activityInterval) {
      clearInterval(activityInterval);
      activityInterval = null;
    }
    activityStartTime = null;
    document.getElementById('activityStatus').textContent = '\xB7';
    document.getElementById('activityStatus').style.color = 'var(--gray-400)';
    document.getElementById('activityStartBtn').style.display = 'inline-block';
    document.getElementById('activityStopBtn').style.display = 'none';
    document.getElementById('presenceText').textContent = 'Ready to activate';
    document.getElementById('activeTimer').textContent = '00:00:00';
    showToast('Activity simulation stopped', 'success');
  }

  function simulateActivity() {
    // Simulate realistic activity patterns with keyboard and mouse events
    // Teams/Slack primarily detect keyboard activity, so prioritize that
    const activities = [
      // Keyboard events (highest priority - most apps monitor these)
      () => {
        const keys = ['a', 'b', 'c', 'd', 'e', '1', '2', '3', '4', '5'];
        const key = keys[Math.floor(Math.random() * keys.length)];
        const opts = { key, code: \`Key\${key.toUpperCase()}\`, keyCode: key.charCodeAt(0), bubbles: true };
        document.dispatchEvent(new KeyboardEvent('keydown', opts));
        setTimeout(() => document.dispatchEvent(new KeyboardEvent('keyup', opts)), 50);
      },
      // Title nudge (invisible but detectable by some services)
      () => document.title.includes('\\u200B') ? document.title = document.title.replace('\\u200B', '') : document.title += '\\u200B',
      // Scroll (minimal, less noticeable)
      () => window.scrollBy(0, Math.random() > 0.5 ? 1 : -1),
      // Mouse events with realistic timing
      () => {
        const opts = { button: 0, bubbles: true, cancelable: true };
        document.dispatchEvent(new MouseEvent('mousemove', { ...opts, clientX: Math.random() * 200, clientY: Math.random() * 200 }));
      },
      // Wheel/scroll simulation
      () => {
        const opts = { deltaY: Math.random() > 0.5 ? 5 : -5, bubbles: true, cancelable: true };
        document.dispatchEvent(new WheelEvent('wheel', opts));
      },
      // Pointer events (modern apps)
      () => {
        const opts = { pointerId: 1, pointerType: 'mouse', bubbles: true, cancelable: true };
        document.dispatchEvent(new PointerEvent('pointermove', { ...opts, clientX: Math.random() * 200, clientY: Math.random() * 200 }));
      }
    ];
    
    // Pick 1-2 random activities, weighted toward keyboard
    const activityCount = Math.random() < 0.7 ? 1 : 2;
    for (let i = 0; i < activityCount; i++) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      try { activity(); } catch (e) { console.debug('Activity simulation note:', e.message); }
    }
  }

  function updatePresenceTimer() {
    try {
      if (!activityStartTime) return;
      const timerEl = document.getElementById('activeTimer');
      const textEl = document.getElementById('presenceText');
      
      if (!timerEl || !textEl) {
        console.warn('[Timer] Presence timer elements missing');
        return;
      }
      
      const elapsed = Math.floor((Date.now() - activityStartTime) / 1000);
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;
      timerEl.textContent = \`\${String(hours).padStart(2, '0')}:\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`;
      textEl.textContent = '\u{1F7E2} Keep-Alive Active';
    } catch(e) {
      console.error('[Timer] Presence update failed:', e.message);
      // Don't cascade - activity simulation continues
    }
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // ENERGY TRACKING
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function updateEnergyDisplay() {
    const val = document.getElementById('energyLevel').value;
    document.getElementById('energyValue').textContent = val;
    document.getElementById('currentEnergy').textContent = val;
  }

  let currentMood = null;
  function setMood(mood) {
    currentMood = mood;
    document.querySelectorAll('.slider-track .slider-item').forEach(el => el.classList.remove('active'));
    event?.target?.classList.add('active');
  }

  function saveEnergyLog() {
    const energy = document.getElementById('energyLevel').value;
    if (!currentMood) {
      showToast('Please select a mood', 'warning');
      return;
    }
    energyLogs.push({ time: new Date().toISOString(), energy, mood: currentMood });
    localStorage.setItem('energyLogs', JSON.stringify(energyLogs));
    
    // Log the energy event
    logEvent('energy_log', 'energy', 0, { energy: parseInt(energy), mood: currentMood });
    
    showToast(\`Energy \${energy}/10 logged\`, 'success');
    
    // Sync data to server
    syncDataToServer();
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // DOPAMINE MENU
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function initDopamineMenu() {
    let html = '';
    dopamineMenu.forEach(item => {
      html += \`<div class="dopamine-item" onclick="showToast('\${item} - Great choice!', 'success')">\${item}</div>\`;
    });
    document.getElementById('dopamineList').innerHTML = html;
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // TASK DIFFICULTY
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function updateTaskGrid() {
    const difficulty = parseInt(document.getElementById('taskDifficulty').value);
    const interest = parseInt(document.getElementById('taskInterest').value);

    document.getElementById('difficultyValue').textContent = difficulty;
    document.getElementById('interestValue').textContent = interest;

    let advice = '';
    if (difficulty < 4 && interest > 6) advice = '\u2705 Easy & interesting - Perfect for flow!';
    else if (difficulty > 7 && interest < 4) advice = '\u26A0\uFE0F  Hard & boring - Skip this one';
    else if (difficulty > 7 && interest > 7) advice = '\u{1F4AA} Challenging & engaging - Push yourself!';
    else if (difficulty < 4 && interest < 4) advice = '\u{1F634} Easy but boring - Mix with something interesting';
    else if (interest < 5) advice = '\u{1F3AF} Focus on higher interest tasks';
    else if (difficulty > 8) advice = '\u{1F525} Very hard - Break into smaller steps';
    else advice = '\u2713 This is a reasonable task';

    document.getElementById('taskAdvice').textContent = advice;
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // FIDGET TOOLS
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function showFidget(type) {
    const display = document.getElementById('fidgetDisplay');
    const spinner = document.getElementById('fidgetSpinner');
    const colors = document.getElementById('colorCycle');
    const canvas = document.getElementById('particleCanvas');

    spinner.style.display = 'none';
    colors.style.display = 'none';
    canvas.style.display = 'none';
    display.style.display = 'block';

    if (type === 'spinner') {
      spinner.style.display = 'block';
    } else if (type === 'colors') {
      colors.style.display = 'block';
    } else if (type === 'particles') {
      canvas.style.display = 'block';
      initParticles(canvas);
    }
  }

  function hideFidget() {
    document.getElementById('fidgetDisplay').style.display = 'none';
  }

  function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: \`hsl(\${Math.random() * 360}, 70%, 50%)\`
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // MOVEMENT BREAKS
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function showMovement() {
    const move = movements[Math.floor(Math.random() * movements.length)];
    document.getElementById('movementSuggestion').textContent = move;
    document.getElementById('movementDisplay').style.display = 'block';
    
    // Log movement tool use
    logEvent('tool_use', 'movement');
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // POMODORO TIMER
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function startPomodoro() {
    const defaultDuration = parseInt(localStorage.getItem('settingsPomodoro') || '25');
    pomodoroStartTime = Date.now();
    pomodoroRunning = true;
    document.getElementById('pomodoroStartBtn').style.display = 'none';
    document.getElementById('pomodoroStopBtn').style.display = 'inline-block';

    pomodoroTimer = setInterval(() => {
      try {
        const displayEl = document.getElementById('pomodoroDisplay');
        if (!displayEl) {
          console.warn('[Timer] Pomodoro display element missing, stopping timer');
          clearInterval(pomodoroTimer);
          return;
        }
        
        const elapsed = Math.floor((Date.now() - pomodoroStartTime) / 1000);
        const remaining = Math.max(0, defaultDuration * 60 - elapsed);
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        displayEl.textContent = \`\${m}:\${String(s).padStart(2, '0')}\`;

        if (remaining === 0) {
          stopPomodoro(true);
        }
      } catch(e) {
        console.error('[Timer] Pomodoro update failed:', e.message);
        // Continue timer even if display fails - don't cascade the failure
      }
    }, 100);
  }

  function stopPomodoro(complete = false) {
    clearInterval(pomodoroTimer);
    pomodoroRunning = false;
    document.getElementById('pomodoroStartBtn').style.display = 'inline-block';
    document.getElementById('pomodoroStopBtn').style.display = 'none';
    document.getElementById('pomodoroDisplay').textContent = \`\${parseInt(localStorage.getItem('settingsPomodoro') || '25')}:00\`;

    if (complete) {
      document.getElementById('pomodoroEnergyForm').style.display = 'block';
      showToast('Session complete! Rate your energy', 'success');
    }
  }

  function recordPomodoroSession() {
    const energy = document.getElementById('pomodoroEnergy').value;
    const duration = parseInt(localStorage.getItem('settingsPomodoro') || '25');
    
    // Log the session event
    logEvent('session_complete', 'pomodoro', duration * 60, { type: 'focus', energy: parseInt(energy) });
    
    sessionCount++;
    localStorage.setItem('sessionCount', sessionCount);
    document.getElementById('sessionCount').textContent = sessionCount;
    document.getElementById('pomodoroEnergyForm').style.display = 'none';
    showToast(\`Session \${sessionCount} recorded!\`, 'success');
    
    // Sync data to server
    syncDataToServer();
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // MEDICATION TRACKING
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function logMedication() {
    const time = document.getElementById('medTime').value;
    if (!time) {
      showToast('Please select a time', 'warning');
      return;
    }
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const doseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    localStorage.setItem('lastMedDose', doseTime.toISOString());
    
    // Log the medication event
    logEvent('medication_dose', 'medication', 0, { time: doseTime.toISOString() });
    
    updateMedDisplay();
    showToast('Medication logged!', 'success');
  }

  function updateMedDisplay() {
    const lastDose = localStorage.getItem('lastMedDose');
    if (!lastDose) {
      document.getElementById('medDisplay').textContent = '--:--';
      document.getElementById('medStatus').textContent = 'No dose logged';
      document.getElementById('medHours').textContent = '--:--';
      document.getElementById('medText').textContent = 'No dose logged';
      return;
    }

    const doseTime = new Date(lastDose);
    const now = new Date();
    const diffMs = now - doseTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('medDisplay').textContent = \`\${diffHours}h \${diffMins}m\`;
    document.getElementById('medStatus').textContent = diffHours > 8 ? '\u26A0\uFE0F Consider next dose' : \`\${diffHours}h ago\`;
    document.getElementById('medHours').textContent = \`\${diffHours}:\${String(diffMins).padStart(2, '0')}\`;
    document.getElementById('medText').textContent = diffHours > 0 ? \`Last dose \${diffHours}h ago\` : \`Last dose \${diffMins}m ago\`;
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // SETTINGS
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  function saveSettings() {
    const pomodoro = document.getElementById('defaultPomodoro').value;
    const breakDuration = document.getElementById('defaultBreak').value;

    if (pomodoro < 5 || pomodoro > 60 || breakDuration < 1 || breakDuration > 30) {
      showToast('Invalid values', 'error');
      return;
    }

    localStorage.setItem('settingsPomodoro', pomodoro);
    localStorage.setItem('settingsBreak', breakDuration);
    showToast('Settings saved!', 'success');
    
    // Sync data to server
    syncDataToServer();
  }

  // \u2500\u2500 DARK MODE SUPPORT \u2500\u2500
  /**
   * Toggle dark mode and persist preference to localStorage
   * Uses data-theme attribute on document element
   */
  function handleDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = darkModeToggle.checked;
    
    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('fbDarkMode', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('fbDarkMode', 'false');
    }
  }

  /**
   * Initialize dark mode based on user preference or system setting
   * Priority: localStorage > system prefers-color-scheme > light (default)
   */
  function initializeDarkMode() {
    const savedPreference = localStorage.getItem('fbDarkMode');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Determine initial state
    let shouldBeDark = false;
    
    if (savedPreference !== null) {
      // Use saved preference
      shouldBeDark = savedPreference === 'true';
    } else {
      // Check system preference
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Apply theme
    if (shouldBeDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (darkModeToggle) darkModeToggle.checked = true;
      localStorage.setItem('fbDarkMode', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (darkModeToggle) darkModeToggle.checked = false;
      localStorage.setItem('fbDarkMode', 'false');
    }
  }

  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  // INITIALIZATION
  // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  window.addEventListener('keydown', (e) => {
    if (e.key === 'b' || e.key === 'B') startBreathing('4-7-8');
    if (e.key === 'g' || e.key === 'G') initGrounding();
    if (e.key === 'p' || e.key === 'P') switchView('pomodoro');
    if (e.key === '?') showToast('B=Breathing, G=Grounding, P=Pomodoro', 'success');
    if (e.key === 'Escape') {
      ['authModal'].forEach(modal => closeModal(modal));
      if (document.getElementById('breathing-display').style.display !== 'none') stopBreathing();
    }
  });

  // Restore session on page load
  window.addEventListener('DOMContentLoaded', () => {
    try {
      const savedUser = localStorage.getItem('fbUser');
      const savedToken = localStorage.getItem('fbToken');
      
      // Only restore session if both user data and token exist
      if (savedUser && savedToken) {
        const parsedUser = JSON.parse(savedUser);
        
        // \u2705 VALIDATION: Ensure user object is valid
        if (!parsedUser || typeof parsedUser !== 'object') {
          throw new Error('User data is not an object');
        }
        
        // \u2705 VALIDATION: Verify required fields exist
        if (!parsedUser.email || !parsedUser.id) {
          throw new Error('User missing required fields (email, id)');
        }
        
        // \u2705 VALIDATION: Verify token is a non-empty string
        if (typeof savedToken !== 'string' || savedToken.length === 0) {
          throw new Error('Token has invalid format');
        }
        
        // \u2705 VALIDATION: Token should be JWT format (Header.Payload.Signature)
        if ((savedToken.match(/\\./g) || []).length !== 2) {
          throw new Error('Token is not valid JWT format');
        }
        
        // \u2705 VALIDATION: Check session expiration
        const expirationStr = localStorage.getItem('fbSessionExpiration');
        if (expirationStr) {
          const expirationTime = parseInt(expirationStr);
          if (Date.now() > expirationTime) {
            throw new Error('Session expired');
          }
        }
        
        user = parsedUser;
      }
    } catch (e) {
      console.error('[Session] Failed to restore session:', e.message);
      user = null;
      localStorage.removeItem('fbUser');
      localStorage.removeItem('fbToken');
      localStorage.removeItem('fbSessionId');
    }

    sessionCount = parseInt(localStorage.getItem('sessionCount') || '0');
    document.getElementById('sessionCount').textContent = sessionCount;
    // Load feature flags for this user (cached). Fire-and-forget.
    getFeatureFlags().catch(err => console.warn('getFeatureFlags failed:', err && err.message || err));

    // \u2500\u2500 DATA RECOVERY \u2500\u2500
    // If user is authenticated but localStorage is empty, restore data from backend
    if (user && (!fbEvents || fbEvents.length === 0)) {
      console.info('[Recovery] Restoring data from backend after localStorage clear');
      try {
        const response = await apiCall('/data?limit=100');
        if (response && response.ok) {
          const data = await response.json();
          if (data.events && Array.isArray(data.events)) {
            fbEvents = data.events.map(e => ({
              ...e,
              synced: true, // Mark as synced since it came from backend
            }));
            localStorage.setItem('fbEvents', JSON.stringify(fbEvents));
            console.info(\`\u2713 Recovered \${fbEvents.length} events from backend\`);
          }
        }
      } catch (e) {
        console.warn('[Recovery] Failed to restore data:', e.message);
        // Non-fatal: user can continue, sync will happen again in 5 minutes
      }
    }

    const savedSettings = localStorage.getItem('settingsPomodoro');
    if (savedSettings) {
      document.getElementById('defaultPomodoro').value = savedSettings;
      document.getElementById('pomodoroDisplay').textContent = \`\${savedSettings}:00\`;
    }

    document.getElementById('defaultBreak').value = localStorage.getItem('settingsBreak') || '5';

    initDopamineMenu();
    updateUI();
    monitorStorageSize(); // Monitor storage on init
    
    // Ensure auth modal is properly closed if user is authenticated
    if (user) {
      closeModal('authModal');
    }
    
    updateMedDisplay();

    // Update med display every minute (prevent multiple intervals)
    if (medDisplayInterval) clearInterval(medDisplayInterval);
    medDisplayInterval = setInterval(updateMedDisplay, 60000);

    // Sync data to server every 5 minutes if authenticated (prevent multiple intervals)
    if (user) {
      if (syncInterval) clearInterval(syncInterval);
      syncInterval = setInterval(() => {
        syncDataToServer();
        syncEventQueue(); // Also sync events with each data sync
      }, 5 * 60 * 1000);
      
      // Initial event sync
      syncEventQueue();
    }

    // Initialize dark mode based on user preference or system setting
    initializeDarkMode();

    // Register Service Worker for notifications and offline support
    registerServiceWorker();
    
    // Load feature flags from backend (fire-and-forget, non-blocking)
    getFeatureFlags().catch(e => console.debug('[Features] Background load failed:', e.message));
    
    // \u2500\u2500 OFFLINE DETECTION \u2500\u2500
    function updateOnlineStatus() {
      const indicator = document.getElementById('offlineIndicator');
      if (!navigator.onLine) {
        indicator.style.display = 'inline-block';
        console.warn('[Network] Going offline');
      } else {
        indicator.style.display = 'none';
        console.debug('[Network] Back online');
        // Attempt to sync when coming back online
        if (user) {
          syncDataToServer();
          syncEventQueue();
        }
      }
    }
    
    // Check initial state
    updateOnlineStatus();
    
    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  });
<\/script>
</body>
</html>
`;
var html_default = htmlContent;

// api/src/sync.js
var import_checked_fetch7 = __toESM(require_checked_fetch(), 1);
async function checkSyncAccess(env, userId) {
  try {
    const user = await env.DB.prepare(
      "SELECT subscription_tier FROM users WHERE id = ?"
    ).bind(userId).first();
    if (!user) {
      return { hasAccess: false, tier: null, reason: "User not found" };
    }
    const syncTiers = ["pro", "premium", "enterprise"];
    const hasAccess = syncTiers.includes(user.subscription_tier);
    return {
      hasAccess,
      tier: user.subscription_tier,
      reason: hasAccess ? null : `Current tier "${user.subscription_tier}" does not include cloud sync`
    };
  } catch (error) {
    console.error("[SYNC] Error checking tier:", error.message);
    return { hasAccess: false, tier: null, reason: "Failed to verify subscription" };
  }
}
__name(checkSyncAccess, "checkSyncAccess");
async function validateSyncTier(env, userId) {
  const accessCheck = await checkSyncAccess(env, userId);
  if (!accessCheck.hasAccess) {
    return {
      error: true,
      response: new Response(
        JSON.stringify({
          error: "Cloud sync requires Pro subscription",
          upgrade_url: "/upgrade",
          reason: accessCheck.reason
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      )
    };
  }
  return { error: false };
}
__name(validateSyncTier, "validateSyncTier");
function resolveConflict(local, remote, localTimestamp, remoteTimestamp) {
  if (remoteTimestamp > localTimestamp) {
    return { data: remote, source: "remote", resolved: true };
  }
  if (localTimestamp > remoteTimestamp) {
    return { data: local, source: "local", resolved: true };
  }
  return { data: remote, source: "remote", resolved: false, needsReview: true };
}
__name(resolveConflict, "resolveConflict");
function mergeSessionData(localSessions, remoteSessions) {
  const sessionMap = /* @__PURE__ */ new Map();
  remoteSessions.forEach((session) => {
    const key = `${session.tool}:${session.timestamp}`;
    sessionMap.set(key, { ...session, synced: true });
  });
  localSessions.forEach((session) => {
    const key = `${session.tool}:${session.timestamp}`;
    if (!sessionMap.has(key)) {
      sessionMap.set(key, { ...session, synced: false });
    }
  });
  return Array.from(sessionMap.values());
}
__name(mergeSessionData, "mergeSessionData");
function mergeSettings(local = {}, remote = {}, remoteTimestamp = 0) {
  const merged = { ...local };
  for (const [key, remoteValue] of Object.entries(remote)) {
    if (!merged[key] || remoteValue && remoteValue.lastModified && remoteValue.lastModified > (merged[key].lastModified || 0)) {
      merged[key] = remoteValue;
    }
  }
  return merged;
}
__name(mergeSettings, "mergeSettings");
async function getLastSyncTimestamp(env, userId) {
  try {
    const result = await env.DB.prepare(
      `SELECT synced_at FROM sync_logs 
       WHERE user_id = ? AND status = 'success'
       ORDER BY synced_at DESC 
       LIMIT 1`
    ).bind(userId).first();
    if (!result) {
      return null;
    }
    return new Date(result.synced_at).getTime();
  } catch (error) {
    console.error("[SYNC] Error getting last sync time:", error.message);
    return null;
  }
}
__name(getLastSyncTimestamp, "getLastSyncTimestamp");
async function recordSync(env, userId, deviceId, action, status, sizeBytes = 0, metadata = {}) {
  try {
    await env.DB.prepare(
      `INSERT INTO sync_logs (user_id, device_id, action, status, synced_at, data_size)
       VALUES (?, ?, ?, ?, datetime('now'), ?)`
    ).bind(userId, deviceId || "web", action, status, sizeBytes).run();
    await env.DB.prepare(
      `INSERT INTO audit_logs (user_id, action, status)
       VALUES (?, ?, ?)`
    ).bind(userId, `sync:${action}:${status}`, status).run();
    return true;
  } catch (error) {
    console.error("[SYNC] Error recording sync:", error.message);
    return false;
  }
}
__name(recordSync, "recordSync");
async function registerDevice(env, userId, deviceInfo) {
  try {
    const deviceId = deviceInfo.id || crypto.randomUUID?.() || generateUUID();
    const deviceName = deviceInfo.name || "Unknown Device";
    const query = `
      INSERT INTO devices (user_id, device_id, device_name, last_activity)
      VALUES (?, ?, ?, datetime('now'))
      ON CONFLICT(device_id) DO UPDATE SET last_activity = datetime('now')
    `;
    await env.DB.prepare(query).bind(userId, deviceId, deviceName).run();
    return {
      device_id: deviceId,
      device_name: deviceName,
      registered_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    console.error("[SYNC] Error registering device:", error.message);
    throw error;
  }
}
__name(registerDevice, "registerDevice");
async function getUserDevices(env, userId) {
  try {
    const devices = await env.DB.prepare(
      `SELECT device_id, device_name, last_activity 
       FROM devices 
       WHERE user_id = ? AND is_active = 1
       ORDER BY last_activity DESC`
    ).bind(userId).all();
    return devices.results || [];
  } catch (error) {
    console.error("[SYNC] Error fetching devices:", error.message);
    return [];
  }
}
__name(getUserDevices, "getUserDevices");
async function deactivateDevice(env, userId, deviceId) {
  try {
    await env.DB.prepare(
      "UPDATE devices SET is_active = 0 WHERE user_id = ? AND device_id = ?"
    ).bind(userId, deviceId).run();
    await recordSync(env, userId, deviceId, "device_deactivate", "success");
    return true;
  } catch (error) {
    console.error("[SYNC] Error deactivating device:", error.message);
    return false;
  }
}
__name(deactivateDevice, "deactivateDevice");
async function getDataHistory(env, userId, limit = 10) {
  try {
    const snapshots = await env.DB.prepare(
      `SELECT id, snapshot_size, created_at 
       FROM user_data_snapshots 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`
    ).bind(userId, limit).all();
    return snapshots.results || [];
  } catch (error) {
    console.error("[SYNC] Error fetching history:", error.message);
    return [];
  }
}
__name(getDataHistory, "getDataHistory");
async function restoreFromSnapshot(env, userId, snapshotId) {
  try {
    const snapshot = await env.DB.prepare(
      "SELECT snapshot_data FROM user_data_snapshots WHERE id = ? AND user_id = ?"
    ).bind(snapshotId, userId).first();
    if (!snapshot) {
      return { error: "Snapshot not found" };
    }
    const data = JSON.parse(snapshot.snapshot_data);
    const restoreData = {
      ...data,
      restored_from: snapshotId,
      restored_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const dataString = JSON.stringify(restoreData);
    await env.DB.prepare(
      `INSERT INTO user_data_snapshots (user_id, snapshot_data, snapshot_size, created_at)
       VALUES (?, ?, ?, datetime('now'))`
    ).bind(userId, dataString, dataString.length).run();
    await recordSync(env, userId, "web", "data_restore", "success", dataString.length);
    return { success: true, data: restoreData };
  } catch (error) {
    console.error("[SYNC] Error restoring snapshot:", error.message);
    return { error: "Failed to restore snapshot", detail: error.message };
  }
}
__name(restoreFromSnapshot, "restoreFromSnapshot");
async function syncAnalyticsEvents(env, userId, events) {
  try {
    if (!Array.isArray(events) || events.length === 0) {
      return { success: true, synced: 0 };
    }
    const insertQuery = `
      INSERT INTO analytics_events (user_id, event_type, event_data, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `;
    let synced = 0;
    for (const event of events) {
      if (!event.type || !event.tool) continue;
      try {
        await env.DB.prepare(insertQuery).bind(userId, event.type, JSON.stringify(event)).run();
        synced++;
      } catch (eventError) {
        console.warn(`[SYNC] Failed to insert event ${event.type}:`, eventError.message);
      }
    }
    await recordSync(env, userId, "web", "analytics_sync", synced > 0 ? "success" : "partial", 0, {
      events_synced: synced,
      events_total: events.length
    });
    return { success: true, synced };
  } catch (error) {
    console.error("[SYNC] Error syncing analytics:", error.message);
    return { error: "Failed to sync analytics", detail: error.message };
  }
}
__name(syncAnalyticsEvents, "syncAnalyticsEvents");
function optimizePayload(data) {
  const jsonString = JSON.stringify(data);
  const sizeBytes = jsonString.length;
  if (sizeBytes > 50 * 1024) {
    return {
      data,
      sizeBytes,
      compression_recommended: true
    };
  }
  return {
    data,
    sizeBytes,
    compression_recommended: false
  };
}
__name(optimizePayload, "optimizePayload");
function deduplicateSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  const seen = /* @__PURE__ */ new Set();
  const deduplicated = [];
  for (const session of sessions) {
    const key = `${session.tool}:${session.timestamp}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(session);
    }
  }
  return deduplicated;
}
__name(deduplicateSessions, "deduplicateSessions");
function createOfflineMarker() {
  return {
    offline_queued: true,
    queued_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
__name(createOfflineMarker, "createOfflineMarker");
async function processSyncQueue(env, userId, queuedEvents) {
  try {
    const latestSnapshot = await env.DB.prepare(
      `SELECT snapshot_data FROM user_data_snapshots 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 1`
    ).bind(userId).first();
    const remoteData = latestSnapshot ? JSON.parse(latestSnapshot.snapshot_data) : {};
    const mergedData = mergeSettings(remoteData, queuedEvents);
    const mergedString = JSON.stringify(mergedData);
    await env.DB.prepare(
      `INSERT INTO user_data_snapshots (user_id, snapshot_data, snapshot_size, created_at)
       VALUES (?, ?, ?, datetime('now'))`
    ).bind(userId, mergedString, mergedString.length).run();
    await recordSync(env, userId, "web", "offline_queue_process", "success", mergedString.length);
    return { success: true, data: mergedData };
  } catch (error) {
    console.error("[SYNC] Error processing offline queue:", error.message);
    return { error: "Failed to process offline queue", detail: error.message };
  }
}
__name(processSyncQueue, "processSyncQueue");
var sync_default = {
  checkSyncAccess,
  validateSyncTier,
  resolveConflict,
  mergeSessionData,
  mergeSettings,
  getLastSyncTimestamp,
  recordSync,
  registerDevice,
  getUserDevices,
  deactivateDevice,
  getDataHistory,
  restoreFromSnapshot,
  syncAnalyticsEvents,
  optimizePayload,
  deduplicateSessions,
  createOfflineMarker,
  processSyncQueue
};

// api/src/billing.js
var import_checked_fetch8 = __toESM(require_checked_fetch(), 1);
var STRIPE_WEBHOOK_SECRET_HEADER = "stripe-signature";
var PRODUCTS = {
  PRO: {
    name: "Cloud Sync Pro",
    priceId: null,
    // Will be set from env at runtime
    monthlyPrice: 300,
    // $3.00 in cents
    tier: "pro",
    features: ["Cloud Sync", "Multi-device", "30-day history"]
  }
};
async function createCheckoutSession(env, userId, userEmail, plan = "pro") {
  try {
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    const priceId = env.STRIPE_PRICE_ID_PRO || PRODUCTS[plan.toUpperCase()].priceId;
    if (!priceId) {
      throw new Error(`Price ID not configured for plan: ${plan}`);
    }
    const sessionData = {
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: "subscription",
      payment_method_types: ["card"],
      success_url: `${env.APP_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.APP_URL}/billing?cancelled=true`,
      subscription_data: {
        metadata: {
          user_id: userId,
          plan
        }
      },
      metadata: {
        user_id: userId,
        plan,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(flattenObject(sessionData)).toString()
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("[STRIPE] Checkout creation failed:", error);
      throw new Error(`Stripe error: ${error.error?.message || "Unknown error"}`);
    }
    const session = await response.json();
    await logCheckoutEvent(env, userId, "checkout_session_created", {
      session_id: session.id,
      plan,
      amount: PRODUCTS[plan.toUpperCase()].monthlyPrice
    });
    return {
      success: true,
      url: session.url,
      sessionId: session.id
    };
  } catch (error) {
    console.error("[STRIPE] Checkout session creation error:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
__name(createCheckoutSession, "createCheckoutSession");
async function verifyWebhookSignature(request, env) {
  try {
    const signature = request.headers.get(STRIPE_WEBHOOK_SECRET_HEADER);
    if (!signature) {
      return { valid: false, reason: "Missing signature header" };
    }
    const body = await request.text();
    const timestamp = signature.split(",")[0].split("=")[1];
    const receivedSignature = signature.split("v1=")[1];
    const signedContent = `${timestamp}.${body}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(env.STRIPE_WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(signedContent));
    const hexSignature = Array.from(new Uint8Array(signed)).map((b) => b.toString(16).padStart(2, "0")).join("");
    const isValid = hexSignature === receivedSignature;
    const webhookTime = parseInt(timestamp) * 1e3;
    const timeDiff = Date.now() - webhookTime;
    if (timeDiff > 5 * 60 * 1e3) {
      return { valid: false, reason: "Webhook timestamp too old" };
    }
    return { valid: isValid, reason: isValid ? null : "Invalid signature" };
  } catch (error) {
    console.error("[STRIPE] Webhook verification error:", error.message);
    return { valid: false, reason: `Verification error: ${error.message}` };
  }
}
__name(verifyWebhookSignature, "verifyWebhookSignature");
async function processWebhookEvent(env, event) {
  try {
    const { type, data } = event;
    console.log(`[STRIPE] Processing webhook: ${type}`);
    switch (type) {
      case "checkout.session.completed":
        return await handleCheckoutSessionCompleted(env, data.object);
      case "customer.subscription.updated":
        return await handleSubscriptionUpdated(env, data.object);
      case "customer.subscription.deleted":
        return await handleSubscriptionDeleted(env, data.object);
      case "invoice.payment_succeeded":
        return await handleInvoicePaymentSucceeded(env, data.object);
      case "invoice.payment_failed":
        return await handleInvoicePaymentFailed(env, data.object);
      default:
        console.log(`[STRIPE] Ignoring event type: ${type}`);
        return { processed: false, reason: "Event type not handled" };
    }
  } catch (error) {
    console.error("[STRIPE] Webhook processing error:", error.message);
    return { processed: false, error: error.message };
  }
}
__name(processWebhookEvent, "processWebhookEvent");
async function handleCheckoutSessionCompleted(env, session) {
  try {
    const { client_reference_id: userId, customer, subscription: subscriptionId, metadata } = session;
    if (!userId) {
      console.warn("[STRIPE] checkout.session.completed missing client_reference_id");
      return { processed: false, reason: "Missing user ID" };
    }
    const plan = metadata?.plan || "pro";
    const subscription = await fetchStripeObject("subscriptions", subscriptionId, env);
    if (!subscription) {
      throw new Error(`Failed to fetch subscription: ${subscriptionId}`);
    }
    await env.DB.prepare(
      "UPDATE users SET subscription_tier = ? WHERE id = ?"
    ).bind(plan, userId).run();
    await env.DB.prepare(
      `INSERT INTO stripe_subscriptions (user_id, stripe_customer_id, stripe_subscription_id, stripe_product_id, tier, status, current_period_start, current_period_end, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
       ON CONFLICT(user_id) DO UPDATE SET
         stripe_subscription_id = excluded.stripe_subscription_id,
         tier = excluded.tier,
         status = excluded.status,
         current_period_start = excluded.current_period_start,
         current_period_end = excluded.current_period_end,
         updated_at = datetime('now')`
    ).bind(
      userId,
      customer,
      subscriptionId,
      subscription.items.data[0]?.product || null,
      plan,
      subscription.status,
      new Date(subscription.current_period_start * 1e3).toISOString(),
      new Date(subscription.current_period_end * 1e3).toISOString()
    ).run();
    await logCheckoutEvent(env, userId, "checkout_completed", {
      subscription_id: subscriptionId,
      customer_id: customer,
      plan,
      period_start: subscription.current_period_start,
      period_end: subscription.current_period_end
    });
    console.log(`[STRIPE] User ${userId} subscribed to ${plan}`);
    return { processed: true, userId, plan };
  } catch (error) {
    console.error("[STRIPE] Failed to handle checkout completion:", error.message);
    return { processed: false, error: error.message };
  }
}
__name(handleCheckoutSessionCompleted, "handleCheckoutSessionCompleted");
async function handleSubscriptionUpdated(env, subscription) {
  try {
    const userId = subscription.metadata?.user_id;
    if (!userId) {
      console.warn("[STRIPE] subscription.updated missing user_id in metadata");
      return { processed: false };
    }
    const newStatus = subscription.status;
    let tier = "free";
    if (newStatus === "active" || newStatus === "trialing") {
      tier = subscription.metadata?.plan || "pro";
    }
    await env.DB.prepare(
      'UPDATE users SET subscription_tier = ?, updated_at = datetime("now") WHERE id = ?'
    ).bind(tier, userId).run();
    await env.DB.prepare(
      `UPDATE stripe_subscriptions
       SET status = ?, tier = ?, updated_at = datetime('now')
       WHERE stripe_subscription_id = ?`
    ).bind(newStatus, tier, subscription.id).run();
    await logCheckoutEvent(env, userId, "subscription_updated", {
      subscription_id: subscription.id,
      new_status: newStatus,
      new_tier: tier
    });
    console.log(`[STRIPE] Subscription ${subscription.id} updated to ${newStatus}`);
    return { processed: true, userId, newStatus };
  } catch (error) {
    console.error("[STRIPE] Failed to handle subscription update:", error.message);
    return { processed: false, error: error.message };
  }
}
__name(handleSubscriptionUpdated, "handleSubscriptionUpdated");
async function handleSubscriptionDeleted(env, subscription) {
  try {
    const userId = subscription.metadata?.user_id;
    if (!userId) {
      console.warn("[STRIPE] subscription.deleted missing user_id in metadata");
      return { processed: false };
    }
    await env.DB.prepare(
      'UPDATE users SET subscription_tier = ?, updated_at = datetime("now") WHERE id = ?'
    ).bind("free", userId).run();
    await env.DB.prepare(
      'UPDATE stripe_subscriptions SET status = "cancelled" WHERE stripe_subscription_id = ?'
    ).bind(subscription.id).run();
    await logCheckoutEvent(env, userId, "subscription_cancelled", {
      subscription_id: subscription.id
    });
    console.log(`[STRIPE] Subscription ${subscription.id} cancelled for user ${userId}`);
    return { processed: true, userId, cancelled: true };
  } catch (error) {
    console.error("[STRIPE] Failed to handle subscription deletion:", error.message);
    return { processed: false, error: error.message };
  }
}
__name(handleSubscriptionDeleted, "handleSubscriptionDeleted");
async function handleInvoicePaymentSucceeded(env, invoice) {
  try {
    const subscription = await fetchStripeObject("subscriptions", invoice.subscription, env);
    if (!subscription) {
      console.warn("[STRIPE] Could not find subscription for invoice:", invoice.subscription);
      return { processed: false };
    }
    const userId = subscription.metadata?.user_id;
    if (!userId) {
      console.warn("[STRIPE] Subscription missing user_id in metadata");
      return { processed: false };
    }
    await env.DB.prepare(
      `UPDATE stripe_subscriptions
       SET current_period_start = ?, current_period_end = ?
       WHERE stripe_subscription_id = ?`
    ).bind(
      new Date(subscription.current_period_start * 1e3).toISOString(),
      new Date(subscription.current_period_end * 1e3).toISOString(),
      subscription.id
    ).run();
    await logCheckoutEvent(env, userId, "payment_succeeded", {
      invoice_id: invoice.id,
      amount: invoice.amount_paid,
      subscription_id: subscription.id
    });
    console.log(`[STRIPE] Payment succeeded for user ${userId}, amount: ${invoice.amount_paid}`);
    return { processed: true, userId };
  } catch (error) {
    console.error("[STRIPE] Failed to handle successful payment:", error.message);
    return { processed: false, error: error.message };
  }
}
__name(handleInvoicePaymentSucceeded, "handleInvoicePaymentSucceeded");
async function handleInvoicePaymentFailed(env, invoice) {
  try {
    const subscription = await fetchStripeObject("subscriptions", invoice.subscription, env);
    if (!subscription) {
      console.warn("[STRIPE] Could not find subscription for failed invoice:", invoice.subscription);
      return { processed: false };
    }
    const userId = subscription.metadata?.user_id;
    if (!userId) {
      console.warn("[STRIPE] Subscription missing user_id in metadata");
      return { processed: false };
    }
    await logCheckoutEvent(env, userId, "payment_failed", {
      invoice_id: invoice.id,
      amount: invoice.amount_due,
      attempt_count: invoice.attempt_count,
      subscription_id: subscription.id
    });
    console.log(`[STRIPE] Payment failed for user ${userId}, invoice: ${invoice.id}`);
    return { processed: true, userId, needsRetry: true };
  } catch (error) {
    console.error("[STRIPE] Failed to handle failed payment:", error.message);
    return { processed: false, error: error.message };
  }
}
__name(handleInvoicePaymentFailed, "handleInvoicePaymentFailed");
async function fetchStripeObject(objectType, objectId, env) {
  try {
    const response = await fetch(`https://api.stripe.com/v1/${objectType}/${objectId}`, {
      headers: {
        "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`
      }
    });
    if (!response.ok) {
      console.error(`[STRIPE] Failed to fetch ${objectType}:`, response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`[STRIPE] Error fetching ${objectType}:`, error.message);
    return null;
  }
}
__name(fetchStripeObject, "fetchStripeObject");
function flattenObject(obj, prefix = "") {
  const flattened = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}[${key}]` : key;
    if (value === null || value === void 0) {
      continue;
    } else if (typeof value === "object" && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        if (typeof item === "object") {
          Object.assign(flattened, flattenObject(item, `${newKey}[${idx}]`));
        } else {
          flattened[`${newKey}[${idx}]`] = item;
        }
      });
    } else {
      flattened[newKey] = value;
    }
  }
  return flattened;
}
__name(flattenObject, "flattenObject");
async function logCheckoutEvent(env, userId, eventType, metadata = {}) {
  try {
    await env.DB.prepare(
      `INSERT INTO analytics_events (user_id, event_type, event_data, created_at)
       VALUES (?, ?, ?, datetime('now'))`
    ).bind(userId, `billing:${eventType}`, JSON.stringify(metadata)).run();
  } catch (error) {
    console.warn("[STRIPE] Failed to log checkout event:", error.message);
  }
}
__name(logCheckoutEvent, "logCheckoutEvent");
async function getUserSubscription(env, userId) {
  try {
    const subscription = await env.DB.prepare(
      "SELECT stripe_subscription_id, tier, status, current_period_end FROM stripe_subscriptions WHERE user_id = ?"
    ).bind(userId).first();
    if (!subscription) {
      return { tier: "free", status: null };
    }
    if (subscription.current_period_end) {
      const periodEnd = new Date(subscription.current_period_end).getTime();
      if (Date.now() > periodEnd && subscription.status === "active") {
        await env.DB.prepare(
          "UPDATE users SET subscription_tier = ? WHERE id = ?"
        ).bind("free", userId).run();
        return { tier: "free", status: "expired" };
      }
    }
    return {
      tier: subscription.tier,
      status: subscription.status,
      subscriptionId: subscription.stripe_subscription_id,
      periodEnd: subscription.current_period_end
    };
  } catch (error) {
    console.error("[STRIPE] Error fetching user subscription:", error.message);
    return { tier: "free", status: "error" };
  }
}
__name(getUserSubscription, "getUserSubscription");
var billing_default = {
  createCheckoutSession,
  verifyWebhookSignature,
  processWebhookEvent,
  getUserSubscription,
  PRODUCTS
};

// api/src/index.js
var router2 = e();
var DEBUG2 = false;
var dbLog = /* @__PURE__ */ __name((msg, ...args) => {
  if (DEBUG2) console.log("[DB]", msg, ...args);
}, "dbLog");
async function checkRateLimit2(request, env, endpoint) {
  const clientIP = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
  const rateLimitKey = `ratelimit:${endpoint}:${clientIP}`;
  try {
    const countStr = await env.KV.get(rateLimitKey);
    const count = countStr ? parseInt(countStr) : 0;
    const MAX_ATTEMPTS = config_default.auth.maxLoginAttempts;
    const TIME_WINDOW = config_default.auth.rateLimitWindowSeconds;
    if (count >= MAX_ATTEMPTS) {
      return {
        limited: true,
        retryAfter: TIME_WINDOW,
        message: "Too many login attempts. Please try again in 15 minutes."
      };
    }
    await env.KV.put(rateLimitKey, (count + 1).toString(), { expirationTtl: TIME_WINDOW });
    return { limited: false };
  } catch (e2) {
    console.warn("Rate limit check failed (allowing request):", e2.message);
    return { limited: false };
  }
}
__name(checkRateLimit2, "checkRateLimit");
var dbInitialized = false;
async function initializeDatabase(env) {
  try {
    if (!dbInitialized) {
      dbLog("Initializing database schema...");
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
      const alterTableStatements2 = [
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
        } catch (e2) {
          if (!e2.message.includes("already exists") && !e2.message.includes("duplicate")) {
            console.warn("DB initialization notice:", e2.message.slice(0, 100));
          }
        }
      }
    }
    const alterTableStatements = [
      // Placeholder for future ALTER statements
    ];
    for (const sql of alterTableStatements) {
      try {
        await env.DB.prepare(sql).run();
      } catch (e2) {
        console.debug("Column update note:", e2.message.slice(0, 100));
      }
    }
    try {
      const userTable = await env.DB.prepare("SELECT COUNT(*) as count FROM users LIMIT 1").first();
      dbLog("\u2705 Database schema verified - users table accessible");
    } catch (verifyError) {
      console.error("\u26A0\uFE0F Database schema verification failed (requests may fail):", verifyError.message);
    }
    dbInitialized = true;
    dbLog("\u2705 Database initialization complete");
  } catch (e2) {
    console.error("\u274C Database initialization error:", e2.message);
  }
}
__name(initializeDatabase, "initializeDatabase");
function getCorsHeaders2(request) {
  const origin = request.headers.get("Origin");
  const allowedOrigins = [
    "https://focusbro.net",
    "https://www.focusbro.net",
    "http://localhost:3000",
    "http://localhost:8787"
  ];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : "null";
  return {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": corsOrigin === "null" ? "" : "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": corsOrigin === "null" ? "" : "Content-Type, Authorization",
    "Access-Control-Max-Age": corsOrigin === "null" ? "" : "86400"
  };
}
__name(getCorsHeaders2, "getCorsHeaders");
var corsHeaders2 = getCorsHeaders2({ headers: new Headers() });
function getCacheControl(strategy) {
  const strategies = {
    "nocache": "no-store, must-revalidate, max-age=0",
    "short": "private, max-age=300",
    // 5 minutes for user data, events
    "medium": "private, max-age=3600",
    // 1 hour for stats, analytics
    "static": "private, max-age=86400"
    // 24 hours for config, settings
  };
  return strategies[strategy] || strategies.nocache;
}
__name(getCacheControl, "getCacheControl");
function jsonResponse2(data, status = 200, cacheStrategy = "nocache") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders2,
      "Content-Type": "application/json",
      "Cache-Control": getCacheControl(cacheStrategy)
    }
  });
}
__name(jsonResponse2, "jsonResponse");
router2.options("*", (request) => new Response(null, { headers: getCorsHeaders2(request) }));
async function hashPassword2(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
__name(hashPassword2, "hashPassword");
async function verifyPassword2(password, hash) {
  const passwordHash = await hashPassword2(password);
  return passwordHash === hash;
}
__name(verifyPassword2, "verifyPassword");
async function generateToken(userId, jwtSecret) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1e3);
  const payload = btoa(JSON.stringify({
    sub: userId,
    iat: now,
    exp: now + config_default.auth.tokenExpirationSeconds
  }));
  const headerPayload = `${header}.${payload}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(jwtSecret);
  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(headerPayload));
  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureBase64 = btoa(String.fromCharCode(...signatureArray)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return `${headerPayload}.${signatureBase64}`;
}
__name(generateToken, "generateToken");
async function verifyToken2(token, jwtSecret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const headerPayload = `${parts[0]}.${parts[1]}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(jwtSecret);
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const signaturePadded = parts[2] + "=".repeat((4 - parts[2].length % 4) % 4);
    const signatureBinary = atob(signaturePadded.replace(/-/g, "+").replace(/_/g, "/"));
    const signatureArray = new Uint8Array(signatureBinary.length);
    for (let i2 = 0; i2 < signatureBinary.length; i2++) {
      signatureArray[i2] = signatureBinary.charCodeAt(i2);
    }
    const isValid = await crypto.subtle.verify("HMAC", key, signatureArray, encoder.encode(headerPayload));
    if (!isValid) return null;
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1e3);
    if (payload.exp < now) return null;
    return payload;
  } catch (e2) {
    console.error("Token verification error:", e2.message);
    return null;
  }
}
__name(verifyToken2, "verifyToken");
router2.post("/auth/register", async (request, env) => {
  try {
    const rateLimitResult = await checkRateLimit2(request, env, "register");
    if (rateLimitResult.limited) {
      return new Response(JSON.stringify({ error: rateLimitResult.message }), {
        status: 429,
        // Too Many Requests
        headers: {
          ...corsHeaders2,
          "Content-Type": "application/json",
          "Retry-After": rateLimitResult.retryAfter.toString()
        }
      });
    }
    let body;
    try {
      body = await request.json();
    } catch (jsonErr) {
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const { email, password } = body;
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), {
        status: 400,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    if (!password || password.length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), {
        status: 400,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already registered" }), {
        status: 409,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const userId = generateUUID2();
    const passwordHash = await hashPassword2(password);
    await env.DB.prepare(
      `INSERT INTO users (id, email, password_hash, created_at, updated_at) 
       VALUES (?, ?, ?, datetime('now'), datetime('now'))`
    ).bind(userId, email, passwordHash).run();
    const sessionId = generateUUID2();
    const token = await generateToken(userId, env.JWT_SECRET);
    await env.DB.prepare(
      `INSERT INTO sessions (id, user_id, token, created_at, expires_at)
       VALUES (?, ?, ?, datetime('now'), datetime('now', '+30 days'))`
    ).bind(sessionId, userId, token).run();
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
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[AUTH] Registration error:", error.message);
    return new Response(JSON.stringify({ error: "Registration failed" }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
router2.post("/auth/login", async (request, env) => {
  try {
    const rateLimitResult = await checkRateLimit2(request, env, "login");
    if (rateLimitResult.limited) {
      return new Response(JSON.stringify({ error: rateLimitResult.message }), {
        status: 429,
        // Too Many Requests
        headers: {
          ...corsHeaders2,
          "Content-Type": "application/json",
          "Retry-After": rateLimitResult.retryAfter.toString()
        }
      });
    }
    let body;
    try {
      body = await request.json();
    } catch (jsonErr) {
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const { email, password } = body;
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), {
        status: 400,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const user = await env.DB.prepare("SELECT id, password_hash FROM users WHERE email = ? AND is_active = 1").bind(email).first();
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const isValid = await verifyPassword2(password, user.password_hash);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const sessionId = generateUUID2();
    const token = await generateToken(user.id, env.JWT_SECRET);
    await env.DB.prepare(
      `INSERT INTO sessions (id, user_id, token, created_at, expires_at)
       VALUES (?, ?, ?, datetime('now'), datetime('now', '+30 days'))`
    ).bind(sessionId, user.id, token).run();
    await env.DB.prepare('UPDATE users SET last_login = datetime("now"), updated_at = datetime("now") WHERE id = ?').bind(user.id).run();
    await env.DB.prepare(
      `INSERT INTO audit_logs (user_id, action, details, created_at)
       VALUES (?, 'login', 'success', datetime('now'))`
    ).bind(user.id).run();
    return jsonResponse2({
      success: true,
      user_id: user.id,
      email,
      token,
      session_id: sessionId
    }, 200, "nocache");
  } catch (error) {
    console.error("[AUTH] Login error:", error.message);
    return new Response(JSON.stringify({ error: "Login failed" }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
router2.post("/auth/refresh", async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "No token provided" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
      return new Response(JSON.stringify({ error: "Invalid token format" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    try {
      const headerPayload = `${parts[0]}.${parts[1]}`;
      const encoder = new TextEncoder();
      const keyData = encoder.encode(env.JWT_SECRET);
      const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
      const signaturePadded = parts[2] + "=".repeat((4 - parts[2].length % 4) % 4);
      const signatureBinary = atob(signaturePadded.replace(/-/g, "+").replace(/_/g, "/"));
      const signatureArray = new Uint8Array(signatureBinary.length);
      for (let i2 = 0; i2 < signatureBinary.length; i2++) {
        signatureArray[i2] = signatureBinary.charCodeAt(i2);
      }
      const isValid = await crypto.subtle.verify("HMAC", key, signatureArray, encoder.encode(headerPayload));
      if (!isValid) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          status: 401,
          headers: { ...corsHeaders2, "Content-Type": "application/json" }
        });
      }
      const payload = JSON.parse(atob(parts[1]));
      const userId = payload.sub;
      const user = await env.DB.prepare("SELECT id, email FROM users WHERE id = ? AND is_active = 1").bind(userId).first();
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found or inactive" }), {
          status: 401,
          headers: { ...corsHeaders2, "Content-Type": "application/json" }
        });
      }
      const newToken = await generateToken(userId, env.JWT_SECRET);
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
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    } catch (tokenErr) {
      console.error("[AUTH] Token refresh error:", tokenErr.message);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("[AUTH] Refresh endpoint error:", error.message);
    return new Response(JSON.stringify({ error: "Refresh failed" }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
function getAuthToken(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}
__name(getAuthToken, "getAuthToken");
router2.post("/sync/data", async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const tokenPayload = await verifyToken2(token, env.JWT_SECRET);
    if (!tokenPayload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const userId = tokenPayload.sub;
    const tierCheckResult = await sync_default.validateSyncTier(env, userId);
    if (tierCheckResult.error) {
      return tierCheckResult.response;
    }
    const body = await request.json();
    const data = body.data || body;
    if (!data || Object.keys(data).length === 0) {
      return new Response(JSON.stringify({ error: "Data required" }), {
        status: 400,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const dataString = JSON.stringify(data);
    const dataSize = dataString.length;
    const MAX_SYNC_SIZE = 10 * 1024 * 1024;
    if (dataSize > MAX_SYNC_SIZE) {
      return new Response(JSON.stringify({ error: "Data too large (max 10MB)" }), {
        status: 413,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    try {
      const kvKey = `user:${userId}:latest`;
      await env.KV_CACHE.put(kvKey, dataString, {
        expirationTtl: 365 * 24 * 60 * 60
        // 1 year
      });
      const snapshotId = await env.DB.prepare(
        `INSERT INTO user_data_snapshots (user_id, snapshot_data, snapshot_size, created_at)
         VALUES (?, ?, ?, datetime('now'))`
      ).bind(userId, dataString, dataSize).run();
      const deviceId = body.device_id || "web";
      await sync_default.recordSync(env, userId, deviceId, "data_upload", "success", dataSize);
      return jsonResponse2({
        success: true,
        synced_at: (/* @__PURE__ */ new Date()).toISOString(),
        size_bytes: dataSize,
        snapshot_id: snapshotId
      }, 200, "short");
    } catch (error) {
      console.error("[SYNC] Data upload error:", error.message);
      await sync_default.recordSync(env, userId, body.device_id || "web", "data_upload", "error", 0);
      return new Response(JSON.stringify({ error: "Failed to sync data" }), {
        status: 500,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
router2.get("/sync/data", async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const tokenPayload = await verifyToken2(token, env.JWT_SECRET);
    if (!tokenPayload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const userId = tokenPayload.sub;
    const tierCheckResult = await sync_default.validateSyncTier(env, userId);
    if (tierCheckResult.error) {
      return tierCheckResult.response;
    }
    const kvKey = `user:${userId}:latest`;
    let data = await env.KV_CACHE.get(kvKey);
    if (data) {
      try {
        await sync_default.recordSync(env, userId, "web", "data_download", "success", data.length);
        return new Response(JSON.stringify({
          success: true,
          data: JSON.parse(data),
          source: "cache"
        }), {
          status: 200,
          headers: { ...corsHeaders2, "Content-Type": "application/json" }
        });
      } catch (parseError) {
        console.error("[SYNC] Failed to parse cached data:", parseError.message);
      }
    }
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
        message: "No data found"
      }), {
        status: 200,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    try {
      const parsedData = JSON.parse(snapshot.snapshot_data);
      await sync_default.recordSync(env, userId, "web", "data_download", "success", snapshot.snapshot_data.length);
      return new Response(JSON.stringify({
        success: true,
        data: parsedData,
        source: "database"
      }), {
        status: 200,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    } catch (parseError) {
      console.error("[SYNC] Failed to parse database snapshot:", parseError.message);
      await sync_default.recordSync(env, userId, "web", "data_download", "error", 0);
      return new Response(JSON.stringify({
        success: true,
        data: null,
        message: "Data corrupted, please resync"
      }), {
        status: 200,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("[SYNC] Data retrieval error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to retrieve data" }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
router2.post("/sync/events", async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const tokenPayload = await verifyToken2(token, env.JWT_SECRET);
    if (!tokenPayload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const userId = tokenPayload.sub;
    const body = await request.json();
    const events = body.events || [];
    const result = await sync_default.syncAnalyticsEvents(env, userId, events);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[SYNC] Analytics sync error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to sync events" }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
router2.post("/sync/devices", async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const tokenPayload = await verifyToken2(token, env.JWT_SECRET);
    if (!tokenPayload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const userId = tokenPayload.sub;
    const deviceInfo = await request.json();
    const device = await sync_default.registerDevice(env, userId, deviceInfo);
    return new Response(JSON.stringify({ success: true, device }), {
      status: 200,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[SYNC] Device registration error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to register device" }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
router2.get("/sync/devices", async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const tokenPayload = await verifyToken2(token, env.JWT_SECRET);
    if (!tokenPayload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const userId = tokenPayload.sub;
    const devices = await sync_default.getUserDevices(env, userId);
    return new Response(JSON.stringify({ success: true, devices }), {
      status: 200,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[SYNC] Device fetch error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch devices" }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
router2.get("/sync/history", async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const tokenPayload = await verifyToken2(token, env.JWT_SECRET);
    if (!tokenPayload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const userId = tokenPayload.sub;
    const limit = new URL(request.url).searchParams.get("limit") || 10;
    const history = await sync_default.getDataHistory(env, userId, parseInt(limit));
    return new Response(JSON.stringify({ success: true, history }), {
      status: 200,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[SYNC] History fetch error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch history" }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
router2.post("/api/billing/create-checkout", async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const tokenPayload = await verifyToken2(token, env.JWT_SECRET);
    if (!tokenPayload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const userId = tokenPayload.sub;
    const { plan } = await request.json();
    const user = await env.DB.prepare(
      "SELECT email, subscription_tier FROM users WHERE id = ?"
    ).bind(userId).first();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    if (user.subscription_tier !== "free") {
      return new Response(JSON.stringify({
        error: "Already subscribed",
        tier: user.subscription_tier,
        message: "Use billing portal to manage your subscription"
      }), {
        status: 400,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const result = await billing_default.createCheckoutSession(env, userId, user.email, plan);
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error || "Failed to create checkout" }), {
        status: 500,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      url: result.url,
      sessionId: result.sessionId
    }), {
      status: 200,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[BILLING] Checkout creation error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to create checkout session" }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
router2.get("/api/billing/portal", async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const tokenPayload = await verifyToken2(token, env.JWT_SECRET);
    if (!tokenPayload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const userId = tokenPayload.sub;
    const subscription = await env.DB.prepare(
      "SELECT stripe_customer_id FROM stripe_subscriptions WHERE user_id = ?"
    ).bind(userId).first();
    if (!subscription || !subscription.stripe_customer_id) {
      return new Response(JSON.stringify({ error: "No active subscription found" }), {
        status: 404,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const response = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `customer=${subscription.stripe_customer_id}&return_url=${env.APP_URL}/billing`
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("[BILLING] Portal creation failed:", error);
      throw new Error(`Stripe error: ${error.error?.message || "Unknown error"}`);
    }
    const session = await response.json();
    return new Response(JSON.stringify({
      url: session.url
    }), {
      status: 200,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[BILLING] Portal error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to open billing portal" }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
router2.post("/api/billing/webhook", async (request, env) => {
  try {
    const verification = await billing_default.verifyWebhookSignature(request, env);
    if (!verification.valid) {
      console.warn("[BILLING] Webhook signature verification failed:", verification.reason);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const body = await request.text();
    const event = JSON.parse(body);
    const result = await billing_default.processWebhookEvent(env, event);
    console.log(`[BILLING] Webhook processed: ${event.type} - ${result.processed ? "success" : "skipped"}`);
    return new Response(JSON.stringify({
      received: true,
      processed: result.processed
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[BILLING] Webhook handler error:", error.message);
    return new Response(JSON.stringify({
      received: true,
      error: error.message
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
});
router2.get("/api/billing/tier", async (request, env) => {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const tokenPayload = await verifyToken2(token, env.JWT_SECRET);
    if (!tokenPayload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders2, "Content-Type": "application/json" }
      });
    }
    const userId = tokenPayload.sub;
    const subscription = await billing_default.getUserSubscription(env, userId);
    return new Response(JSON.stringify(subscription), {
      status: 200,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[BILLING] Tier fetch error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch tier" }), {
      status: 500,
      headers: { ...corsHeaders2, "Content-Type": "application/json" }
    });
  }
});
router2.get("/health", async (request, env) => {
  return new Response(JSON.stringify({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    version: "1.0.0"
  }), {
    status: 200,
    headers: { ...corsHeaders2, "Content-Type": "application/json" }
  });
});
router2.get("/api/test", async (request, env) => {
  return new Response(JSON.stringify({
    message: "Direct /api test route works!",
    pathname: new URL(request.url).pathname
  }), {
    status: 200,
    headers: { ...corsHeaders2, "Content-Type": "application/json" }
  });
});
router2.get("/api/gallery/test", async (request, env) => {
  return new Response(JSON.stringify({
    success: true,
    data: {
      images: [{
        url: "data:image/svg+xml,<svg></svg>",
        alt: "Test image",
        title: "Test Gallery"
      }],
      category: "test",
      count: 1
    },
    message: "Hardcoded gallery test endpoint"
  }), {
    status: 200,
    headers: { ...corsHeaders2, "Content-Type": "application/json" }
  });
});
router2.get("/debug-routes", async (request, env) => {
  const routesList = (router2.routes || []).map((r) => ({
    method: r.method || "all",
    path: r.path || r.pathname || "unknown"
  }));
  return new Response(JSON.stringify({
    message: "Registered routes",
    routeCount: routesList.length,
    routes: routesList.slice(0, 20),
    // First 20 routes
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 200,
    headers: { ...corsHeaders2, "Content-Type": "application/json" }
  });
});
router2.get("/debug-api", async (request, env) => {
  return new Response(JSON.stringify({
    message: "Debug endpoint",
    extendedRouter: {
      type: typeof extended_routes_default,
      isObject: extended_routes_default !== null && typeof extended_routes_default === "object",
      hasFetch: typeof extended_routes_default?.fetch === "function",
      hasRoutes: Array.isArray(extended_routes_default?.routes),
      routeCount: extended_routes_default?.routes?.length || 0
    }
  }), {
    status: 200,
    headers: { ...corsHeaders2, "Content-Type": "application/json" }
  });
});
router2.get("/", async (request, env) => {
  return new Response(html_default, {
    status: 200,
    headers: { ...corsHeaders2, "Content-Type": "text/html; charset=utf-8" }
  });
});
router2.get("/favicon.ico", async (request, env) => {
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect fill="#1e40af" width="64" height="64"/><text x="32" y="45" font-size="36" font-weight="700" font-family="Inter, sans-serif" fill="#ffffff" text-anchor="middle">FB</text></svg>`;
  return new Response(svgFavicon, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400"
    }
  });
});
router2.get("/manifest.json", async (request, env) => {
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
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=86400"
    }
  });
});
router2.get("/sw.js", async (request, env) => {
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
          // \u2705 LOGGING: SW cache failures (e.g., assets unavailable during install)
          console.warn('[SW] Cache install failed:', err.message, '\u2014 Will retry on next update');
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
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Service-Worker-Allowed": "/"
    }
  });
});
router2.get("/api/gallery", async (request, env) => {
  try {
    const url = new URL(request.url);
    const seed = url.searchParams.get("seed") || Math.random().toString();
    let category = url.searchParams.get("category") || "focus";
    const limit = Math.min(20, Math.max(5, parseInt(url.searchParams.get("limit") || "10")));
    const safeKeywords = {
      focus: ["focus work", "concentration", "productivity", "mindfulness", "deep work"],
      adhd: ["neurodiversity", "colorful", "creative chaos", "vibrant energy", "flowing"],
      energy: ["lightning", "electricity", "bright light", "glowing", "power"],
      growth: ["mountain climb", "progress", "success", "achievement", "growth"],
      brain: ["brain circuits", "neurons", "neural", "mind", "intelligence"],
      nature: ["forest", "water", "calm nature", "peaceful landscape", "zen"],
      motivation: ["inspiration", "celebration", "success", "achievement", "victory"]
    };
    if (category === "random") {
      const categories = Object.keys(safeKeywords);
      const hash = seed.split("").reduce((a, c2) => a + c2.charCodeAt(0), 0);
      category = categories[hash % categories.length];
    }
    if (!safeKeywords[category]) {
      return errorResponse("Invalid category", 400);
    }
    const keywords = safeKeywords[category];
    const cacheKey = `gallery:${category}`;
    const cached = await env.KV_CACHE.get(cacheKey);
    let images = [];
    if (cached) {
      images = JSON.parse(cached);
    } else {
      for (const keyword of keywords) {
        try {
          const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=80&page=1`, {
            headers: {
              "Authorization": env.PEXELS_API_KEY || "PexelsSignup-Optional"
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
              images = images.concat(data.photos.map((p2) => {
                return {
                  url: p2?.src?.medium || p2?.src?.small || "",
                  alt: p2?.photographer || "Photo",
                  source: "pexels"
                };
              }).filter((img) => img.url));
            }
          }
        } catch (e2) {
          console.warn(`Pexels API error for "${keyword}":`, e2.message);
        }
      }
      if (images.length < 50) {
        try {
          const keyword = keywords[0];
          const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=80&page=1`, {
            headers: {
              "Authorization": "Client-ID " + (env.UNSPLASH_ACCESS_KEY || "demo")
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.results && Array.isArray(data.results) && data.results.length > 0) {
              images = images.concat(data.results.map((p2) => {
                return {
                  url: p2?.urls?.regular || p2?.urls?.full || "",
                  alt: p2?.user?.name || "Photo",
                  source: "unsplash"
                };
              }).filter((img) => img.url));
            }
          }
        } catch (e2) {
          console.warn("Unsplash API error:", e2.message);
        }
      }
      if (images.length > 0) {
        await env.KV_CACHE.put(cacheKey, JSON.stringify(images), { expirationTtl: 86400 });
      }
    }
    const seededShuffle = /* @__PURE__ */ __name((arr, seed2) => {
      const result = [...arr];
      let hash = seed2.split("").reduce((a, c2) => a + c2.charCodeAt(0), 0);
      for (let i2 = result.length - 1; i2 > 0; i2--) {
        hash = (hash * 9301 + 49297) % 233280;
        const j = Math.floor(hash / 233280 * (i2 + 1));
        [result[i2], result[j]] = [result[j], result[i2]];
      }
      return result;
    }, "seededShuffle");
    const shuffled = seededShuffle(images, seed);
    const selected = shuffled.slice(0, limit);
    return successResponse({
      images: selected,
      category,
      count: selected.length,
      total: images.length,
      seed: seed.substring(0, 8)
      // Return truncated seed
    });
  } catch (error) {
    console.error("Gallery endpoint error:", error.message);
    return successResponse({
      images: [],
      error: "Gallery service temporarily unavailable",
      count: 0
    });
  }
});
router2.all("*", () => new Response(JSON.stringify({ error: "Not found" }), {
  status: 404,
  headers: { ...corsHeaders2, "Content-Type": "application/json" }
}));
var src_default = {
  async fetch(request, env, ctx) {
    await initializeDatabase(env);
    const response = await router2.fetch(request, env);
    return response;
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var import_checked_fetch10 = __toESM(require_checked_fetch());
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
var import_checked_fetch11 = __toESM(require_checked_fetch());
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e2) {
    const error = reduceError(e2);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-zsxWKd/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var import_checked_fetch13 = __toESM(require_checked_fetch());
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-zsxWKd/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default,
  generateToken,
  generateUUID2 as generateUUID,
  hashPassword2 as hashPassword,
  verifyPassword2 as verifyPassword,
  verifyToken2 as verifyToken
};
//# sourceMappingURL=index.js.map
