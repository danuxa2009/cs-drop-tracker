import {
  pgTable,
  serial,
  date,
  integer,
  numeric,
  boolean,
  text,
  timestamp,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const farmSessions = pgTable(
  'farmSessions',
  {
    id: serial('id').primaryKey(),
    dateFrom: date('date_from').notNull(),
    dateTo: date('date_to').notNull(),
    accountsCount: integer('accounts_count').notNull(),
    totalValue: numeric('total_value', { precision: 10, scale: 2 }).notNull(),
    totalCases: integer('total_cases').notNull(),
    avgCasePrice: numeric('avg_case_price', { precision: 10, scale: 2 }).notNull(),
    avgDropPrice: numeric('avg_drop_price', { precision: 10, scale: 2 }).notNull(),
    isFinal: boolean('is_final').notNull().default(false),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('farm_session_date_from_date_to_idx').on(t.dateFrom, t.dateTo),
    check('farm_session_date_range_check', sql`${t.dateTo} >= ${t.dateFrom}`),
    check(
      'farm_session_non_negative_metrics_check',
      sql`${t.accountsCount} >= 0 AND ${t.totalValue} >= 0 AND ${t.totalCases} >= 0 AND ${t.avgCasePrice} >= 0 AND ${t.avgDropPrice} >= 0`
    ),
  ]
);

export const sessionDrops = pgTable(
  'session_drops',
  {
    id: serial('id').primaryKey(),
    farmSessionId: integer('farm_session_id')
      .notNull()
      .references(() => farmSessions.id, { onDelete: 'cascade' }),
    caseName: text('case_name').notNull(),
    amount: integer('amount').notNull(),
    percentage: numeric('percentage', { precision: 5, scale: 2 }).notNull(),
  },
  (t) => [
    check('session_drops_amount_non_negative_check', sql`${t.amount} >= 0`),
    check(
      'session_drops_percentage_range_check',
      sql`${t.percentage} >= 0 AND ${t.percentage} <= 100`
    ),
  ]
);

export const sessionSkins = pgTable(
  'session_skins',
  {
    id: serial('id').primaryKey(),
    farmSessionId: integer('farm_session_id')
      .notNull()
      .references(() => farmSessions.id, { onDelete: 'cascade' }),
    skinName: text('skin_name').notNull(),
    amount: integer('amount').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  },
  (t) => [
    check('session_skins_amount_non_negative_check', sql`${t.amount} >= 0`),
    check('session_skins_price_non_negative_check', sql`${t.price} >= 0`),
  ]
);

export const expenses = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    description: text('description').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    category: text('category').notNull(),
    date: date('date').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check('expenses_amount_non_negative_check', sql`${t.amount} >= 0`)]
);
