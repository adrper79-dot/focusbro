-- FocusBro D1 Database Schema

-- Users table (authentication)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  subscription_tier TEXT DEFAULT 'free',
  is_active BOOLEAN DEFAULT 1
);

-- User profile metadata
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  display_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sync metadata (track last sync time, conflicts)
CREATE TABLE IF NOT EXISTS sync_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  device_name TEXT,
  data_size_bytes INTEGER,
  sync_version INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User data snapshots (for backup + recovery)
CREATE TABLE IF NOT EXISTS data_backups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  backup_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_blob TEXT NOT NULL,
  size_bytes INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Session tokens (for API auth)
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  ip_address TEXT,
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indices for fast queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_user ON sync_logs(user_id, synced_at);
CREATE INDEX IF NOT EXISTS idx_backups_user ON data_backups(user_id, backup_date);
