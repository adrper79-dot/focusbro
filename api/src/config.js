/**
 * FocusBro Configuration
 * Centralized configuration for all hardcoded values
 */

export const config = {
  // ── Authentication ──
  auth: {
    // JWT token expiration (30 days)
    tokenExpirationSeconds: 30 * 24 * 60 * 60,
    // Max password attempts per IP per window
    maxLoginAttempts: 10,
    // Rate limit window (15 minutes)
    rateLimitWindowSeconds: 15 * 60,
  },

  // ── API Validation ──
  api: {
    // Maximum events per batch request
    maxEventsPerRequest: 500,
    // Maximum payload size (1MB)
    maxPayloadSize: 1048576,
    // Valid event types (whitelist)
    validEventTypes: [
      'session_complete',
      'meditation',
      'focus_session',
      'break',
      'energy_log',
      'task_created',
      'task_completed',
      'streak_milestone',
      'medication_logged',
      'movement_completed'
    ],
    // Maximum individual event data size (5KB)
    maxEventDataSize: 5000,
    // Maximum tool name length
    maxToolNameLength: 50,
    // Maximum duration per session (1 day in seconds)
    maxSessionDuration: 86400,
    // Maximum event age (2 years back)
    maxEventAgeDays: 730,
    // Maximum future event age (7 days forward)
    maxFutureEventDays: 7,
  },

  // ── Data Limits ──
  data: {
    // Maximum stored data size per user
    maxUserDataSize: 10485760, // 10MB
    // Maximum daily sync operations
    maxSyncsPerDay: 1000,
    // Pagination limits
    maxPageSize: 100,
    defaultPageSize: 20,
  },

  // ── Streaks & Tracking ──
  streaks: {
    // Maximum days to check for streak (no need to iterate beyond 2 years)
    maxStreakLookbackDays: 730,
    // Streak reset hour (UTC)
    streakResetHourUTC: 0,
  },

  // ── Error Recovery ──
  retry: {
    // Maximum retry attempts for transient failures
    maxRetries: 3,
    // Base retry delay (ms)
    baseDelayMs: 1000,
    // Exponential backoff multiplier
    backoffMultiplier: 2,
  },

  // ── Timeouts ──
  timeouts: {
    // Database operation timeout (10 seconds)
    dbOperationMs: 10000,
    // API response timeout (30 seconds)
    apiResponseMs: 30000,
    // Webhook delivery timeout (15 seconds)
    webhookTimeoutMs: 15000,
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
      minTier: 'pro', // 'free', 'pro', 'enterprise'
    },
    advancedAnalytics: {
      enabled: true,
      minTier: 'pro',
    },
    customReports: {
      enabled: true,
      minTier: 'pro',
    },
    conflictResolution: {
      enabled: false, // Experimental
      minTier: 'enterprise',
    },
    
    // ── Experimental Features (Beta) ──
    darkModeApi: {
      enabled: true,
      minTier: 'free',
      experimental: true,
    },
    offlineSyncV2: {
      enabled: false,
      minTier: 'free',
      experimental: true,
    },
    aiInsights: {
      enabled: false,
      minTier: 'pro',
      experimental: true,
    },
  },

  // ── CORS ──
  cors: {
    // Allowed origins (set in production)
    allowedOrigins: [
      'http://localhost:3000',
      'http://localhost:8000',
      'https://focusbro.app',
      'https://www.focusbro.app'
    ],
  },

  // ── Logging ──
  logging: {
    // Enable debug logging (set via DEBUG env var in production)
    debug: false, // Will be overridden at runtime from env.DEBUG
    // Log sensitive data (NEVER in production)
    logSensitiveData: false,
  }
};

export default config;
