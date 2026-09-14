import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

export const expoDb = openDatabaseSync('pisotrack.db');

// Initialize schema
expoDb.execSync(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    synced_status INTEGER DEFAULT 0,
    type TEXT DEFAULT 'expense'
  );
`);

expoDb.execSync(`
  CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    has_onboarded INTEGER DEFAULT 0
  );
`);

expoDb.execSync(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    type TEXT DEFAULT 'expense'
  );
`);

// Populate default categories if empty
const catCount = expoDb.getFirstSync<any>('SELECT COUNT(*) as count FROM categories');
if (catCount && catCount.count === 0) {
  expoDb.execSync(`
    INSERT INTO categories (name, icon, type) VALUES
    ('Jeepney', '🚌', 'expense'),
    ('Food', '🍔', 'expense'),
    ('Groceries', '🛒', 'expense'),
    ('Shopping', '🛍️', 'expense'),
    ('Bills', '💡', 'expense'),
    ('Transport', '🚌', 'expense'),
    ('Salary', '💼', 'income'),
    ('Freelance', '💻', 'income'),
    ('Gift', '🎁', 'income'),
    ('Investment', '📈', 'income');
  `);
}

export const db = drizzle(expoDb, { schema });
