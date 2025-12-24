import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const renameHistory = sqliteTable('rename_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  originalPath: text('original_path').notNull(),
  newPath: text('new_path').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  aiModel: text('ai_model'),
  prompt: text('prompt'),
});

export const promptTemplates = sqliteTable('prompt_templates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  template: text('template').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
