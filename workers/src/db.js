/**
 * Database module for Cloudflare D1 SQLite
 * Handles all database operations for FocusBro
 */

// Initialize tables - called on first request
export async function initializeDatabase(db) {
  // Users table
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();
  
  // Sessions table
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run();
  
  // Focus sessions table
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS focus_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      category TEXT,
      notes TEXT,
      completed INTEGER DEFAULT 0,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run();
  
  // Daily stats table
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS daily_stats (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      total_focus_minutes INTEGER DEFAULT 0,
      sessions_completed INTEGER DEFAULT 0,
      interruptions INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run();
  
  // Goals table
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      target_minutes INTEGER,
      deadline TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run();
}

// User operations
export const users = {
  async create(db, id, email, passwordHash, displayName) {
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO users (id, email, password_hash, display_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, email, passwordHash, displayName || email.split('@')[0], now, now).run();
  },
  
  async getById(db, userId) {
    const result = await db.prepare(`
      SELECT id, email, display_name, created_at FROM users WHERE id = ?
    `).bind(userId).first();
    return result;
  },
  
  async getByEmail(db, email) {
    const result = await db.prepare(`
      SELECT id, email, password_hash, display_name, created_at FROM users WHERE email = ?
    `).bind(email).first();
    return result;
  },
  
  async update(db, userId, updates) {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    
    if (updates.displayName !== undefined) {
      fields.push('display_name = ?');
      values.push(updates.displayName);
    }
    
    fields.push('updated_at = ?');
    values.push(now);
    values.push(userId);
    
    if (fields.length > 1) {
      await db.prepare(`
        UPDATE users SET ${fields.join(', ')} WHERE id = ?
      `).bind(...values).run();
    }
  }
};

// Session operations
export const sessions = {
  async create(db, token, userId, expiresIn = 7 * 24 * 60 * 60 * 1000) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresIn).toISOString();
    
    await db.prepare(`
      INSERT INTO sessions (token, user_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(token, userId, expiresAt, now.toISOString()).run();
  },
  
  async getByToken(db, token) {
    const result = await db.prepare(`
      SELECT s.token, s.user_id, s.expires_at, u.email, u.display_name
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).bind(token).first();
    return result;
  },
  
  async delete(db, token) {
    await db.prepare(`DELETE FROM sessions WHERE token = ?`).bind(token).run();
  }
};

// Focus sessions operations
export const focusSessions = {
  async create(db, id, userId, durationMinutes, category, notes) {
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO focus_sessions (id, user_id, duration_minutes, category, notes, started_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, userId, durationMinutes, category, notes, now, now).run();
  },
  
  async complete(db, sessionId) {
    const now = new Date().toISOString();
    await db.prepare(`
      UPDATE focus_sessions SET completed = 1, ended_at = ? WHERE id = ?
    `).bind(now, sessionId).run();
  },
  
  async getById(db, sessionId) {
    const result = await db.prepare(`
      SELECT * FROM focus_sessions WHERE id = ?
    `).bind(sessionId).first();
    return result;
  },
  
  async getByUser(db, userId, limit = 50, offset = 0) {
    const results = await db.prepare(`
      SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?
    `).bind(userId, limit, offset).all();
    return results.results;
  },
  
  async getTodaySessions(db, userId) {
    const results = await db.prepare(`
      SELECT * FROM focus_sessions 
      WHERE user_id = ? AND date(started_at) = date('now')
      ORDER BY started_at DESC
    `).bind(userId).all();
    return results.results;
  }
};

// Daily stats operations
export const dailyStats = {
  async upsert(db, id, userId, date, updates) {
    const now = new Date().toISOString();
    const existing = await db.prepare(`
      SELECT id FROM daily_stats WHERE user_id = ? AND date = ?
    `).bind(userId, date).first();
    
    if (existing) {
      const sets = [];
      const values = [];
      if (updates.totalFocusMinutes !== undefined) {
        sets.push('total_focus_minutes = ?');
        values.push(updates.totalFocusMinutes);
      }
      if (updates.sessionsCompleted !== undefined) {
        sets.push('sessions_completed = ?');
        values.push(updates.sessionsCompleted);
      }
      sets.push('updated_at = ?');
      values.push(now);
      values.push(userId);
      values.push(date);
      
      await db.prepare(`
        UPDATE daily_stats SET ${sets.join(', ')} WHERE user_id = ? AND date = ?
      `).bind(...values).run();
    } else {
      await db.prepare(`
        INSERT INTO daily_stats (id, user_id, date, total_focus_minutes, sessions_completed, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(id, userId, date, updates.totalFocusMinutes || 0, updates.sessionsCompleted || 0, now, now).run();
    }
  },
  
  async getByDateRange(db, userId, startDate, endDate) {
    const results = await db.prepare(`
      SELECT * FROM daily_stats WHERE user_id = ? AND date >= ? AND date <= ?
      ORDER BY date DESC
    `).bind(userId, startDate, endDate).all();
    return results.results;
  }
};

// Goals operations
export const goals = {
  async create(db, id, userId, title, description, targetMinutes, deadline) {
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO goals (id, user_id, title, description, target_minutes, deadline, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, userId, title, description, targetMinutes, deadline, now, now).run();
  },
  
  async getByUser(db, userId, statusFilter = 'active') {
    const results = await db.prepare(`
      SELECT * FROM goals WHERE user_id = ? AND status = ? ORDER BY deadline ASC
    `).bind(userId, statusFilter).all();
    return results.results;
  },
  
  async update(db, goalId, updates) {
    const now = new Date().toISOString();
    const sets = [];
    const values = [];
    
    if (updates.title !== undefined) {
      sets.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      sets.push('description = ?');
      values.push(updates.description);
    }
    if (updates.targetMinutes !== undefined) {
      sets.push('target_minutes = ?');
      values.push(updates.targetMinutes);
    }
    if (updates.status !== undefined) {
      sets.push('status = ?');
      values.push(updates.status);
    }
    
    sets.push('updated_at = ?');
    values.push(now);
    values.push(goalId);
    
    if (sets.length > 1) {
      await db.prepare(`
        UPDATE goals SET ${sets.join(', ')} WHERE id = ?
      `).bind(...values).run();
    }
  },
  
  async delete(db, goalId) {
    await db.prepare(`DELETE FROM goals WHERE id = ?`).bind(goalId).run();
  }
};
