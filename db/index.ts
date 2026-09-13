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

export const db = drizzle(expoDb, { schema });
