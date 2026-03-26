-- ════════════════════════════════════════════════════════════
-- FOCUSBRO CLOUDFLARE D1 DATABASE SCHEMA
-- Multi-device sync, user accounts, data backup
-- ════════════════════════════════════════════════════════════

-- ── USERS TABLE ──
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  subscription_tier TEXT DEFAULT 'free',
  is_active BOOLEAN DEFAULT 1
);

-- ── USER DATA BACKUPS (for version history) ──
CREATE TABLE IF NOT EXISTS user_data_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  snapshot_data TEXT NOT NULL,
  snapshot_size INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ── DATA SYNC LOGS (track sync history) ──
CREATE TABLE IF NOT EXISTS sync_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  device_id TEXT,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_size INTEGER,
  status TEXT DEFAULT 'success',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_user ON sync_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_timestamp ON sync_logs(synced_at);

-- ── AUDIT LOG (security & compliance) ──
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);

-- ── SESSIONS TABLE (for multi-device tracking) ──
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_id TEXT,
  device_name TEXT,
  token TEXT NOT NULL,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  is_active BOOLEAN DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

-- ── DEVICES TABLE (multi-device sync) ──
CREATE TABLE IF NOT EXISTS devices (
  device_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT DEFAULT 'web',
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_devices_user ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_last_activity ON devices(last_activity);

-- ── ANALYTICS EVENTS TABLE (product metrics) ──
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(created_at);

-- ── STRIPE SUBSCRIPTIONS (billing integration) ──
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_product_id TEXT,
  tier TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  current_period_start DATETIME,
  current_period_end DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_stripe_user ON stripe_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customer ON stripe_subscriptions(stripe_customer_id);
