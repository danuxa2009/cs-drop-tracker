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
} from 'drizzle-orm/pg-core';

export const farmSessions = pgTable(
  'farm_session',
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
  (t) => [uniqueIndex('farm_session_date_from_date_to_idx').on(t.dateFrom, t.dateTo)]
);

export const sessionDrops = pgTable('session_drops', {
  id: serial('id').primaryKey(),
  farmSessionId: integer('farm_session_id')
    .notNull()
    .references(() => farmSessions.id, { onDelete: 'cascade' }),
  caseName: text('case_name').notNull(),
  amount: integer('amount').notNull(),
  percentage: numeric('percentage', { precision: 5, scale: 2 }).notNull(),
});

export const sessionSkins = pgTable('session_skins', {
  id: serial('id').primaryKey(),
  farmSessionId: integer('farm_session_id')
    .notNull()
    .references(() => farmSessions.id, { onDelete: 'cascade' }),
  skinName: text('skin_name').notNull(),
  amount: integer('amount').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});
