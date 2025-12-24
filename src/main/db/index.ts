import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const dbPath = path.join(app.getPath('userData'), 'clarity-names.db');

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

// Initialize tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS rename_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_path TEXT NOT NULL,
    new_path TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    ai_model TEXT,
    prompt TEXT
  );

  CREATE TABLE IF NOT EXISTS prompt_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    template TEXT NOT NULL,
    description TEXT,
    created_at INTEGER NOT NULL
  );
`);

// Insert default templates if none exist
const defaultTemplates = [
  {
    name: 'Date-Who-Topic',
    template: 'YYYY-MM-DD_{who}_{topic}',
    description: 'Format: 2024-01-15_john_meeting-notes',
  },
  {
    name: 'Topic-Date',
    template: '{topic}_YYYY-MM-DD',
    description: 'Format: invoice_2024-01-15',
  },
  {
    name: 'Descriptive',
    template: '{description}',
    description: 'AI-generated descriptive filename',
  },
];

const count = sqlite.prepare('SELECT COUNT(*) as count FROM prompt_templates').get() as { count: number };
if (count.count === 0) {
  const insert = sqlite.prepare(
    'INSERT INTO prompt_templates (name, template, description, created_at) VALUES (?, ?, ?, ?)'
  );
  
  for (const template of defaultTemplates) {
    insert.run(template.name, template.template, template.description, Date.now());
  }
}
