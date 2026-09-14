import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  amount: real('amount').notNull(),
  category: text('category').notNull(),
  date: text('date').notNull(),
  syncedStatus: integer('synced_status').default(0),
  type: text('type').default('expense'), // 'expense' or 'income'
});

export const userProfile = sqliteTable('user_profile', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  hasOnboarded: integer('has_onboarded').default(0),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  type: text('type').default('expense'), // 'expense' or 'income'
});
