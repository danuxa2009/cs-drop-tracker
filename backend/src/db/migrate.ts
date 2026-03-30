import { pool } from './clients.js';

async function migrate() {
  console.log('Starting database migration...');

  await pool.query(`
        CREATE TABLE IF NOT EXISTS farm_sessions (
        id SERIAL PRIMARY KEY,
        date_from DATE NOT NULL,
        date_to DATE NOT NULL,
        account_count INTEGER NOT NULL,
        total_value NUMERIC(10, 2) NOT NULL,
        total_cases INTEGER NOT NULL,
        avg_case_price NUMERIC(10, 2) NOT NULL,
        avg_drop_price NUMERIC(10, 2) NOT NULL,
        is_final BOOLEAN NOT NULL DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (date_from, date_to));
        `);

  await pool.query(`CREATE TABLE IF NOT EXISTS session_drops (
        id SERIAL PRIMARY KEY,
        farm_session_id INTEGER NOT NULL REFERENCES farm_sessions(id) ON DELETE CASCADE,
        case_name TEXT NOT NULL,
        amount INTEGER NOT NULL,
        percentage NUMERIC(5, 2) NOT NULL);
        `);

  await pool.query(`    
        CREATE TABLE IF NOT EXISTS session_skins (
        id SERIAL PRIMARY KEY,
        farm_session_id INTEGER NOT NULL REFERENCES farm_sessions(id) ON DELETE CASCADE,
        skin_name TEXT NOT NULL,
        amount INTEGER NOT NULL,
        price NUMERIC(10, 2) NOT NULL);
        `);

  console.log('Database migration completed successfully.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('Database migration failed:', err);
  process.exit(1);
});
