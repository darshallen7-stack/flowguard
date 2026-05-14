const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'flowguard.db'));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS workflows (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    nodes TEXT DEFAULT '[]',
    edges TEXT DEFAULT '[]',
    status TEXT DEFAULT 'inactive',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    last_run TEXT
  );

  CREATE TABLE IF NOT EXISTS execution_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id TEXT NOT NULL,
    results TEXT,
    ran_at TEXT DEFAULT (datetime('now'))
  );
`);

module.exports = db;