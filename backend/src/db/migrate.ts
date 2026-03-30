import { pool } from './clients.js';

async function migrate() {
  console.log('Starting database migration...');

  try {
    await pool.query('BEGIN');

    await pool.query(`
        CREATE TABLE IF NOT EXISTS farm_sessions (
        id SERIAL PRIMARY KEY,
        date_from DATE NOT NULL,
        date_to DATE NOT NULL,
        accounts_count INTEGER NOT NULL,
        total_value NUMERIC(10, 2) NOT NULL,
        total_cases INTEGER NOT NULL,
        avg_case_price NUMERIC(10, 2) NOT NULL,
        avg_drop_price NUMERIC(10, 2) NOT NULL,
        is_final BOOLEAN NOT NULL DEFAULT FALSE,
        note TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (date_from, date_to),
        CHECK (date_to >= date_from),
        CHECK (accounts_count >= 0),
        CHECK (total_value >= 0),
        CHECK (total_cases >= 0),
        CHECK (avg_case_price >= 0),
        CHECK (avg_drop_price >= 0));
        `);

    await pool.query(`CREATE TABLE IF NOT EXISTS session_drops (
        id SERIAL PRIMARY KEY,
        farm_session_id INTEGER NOT NULL REFERENCES farm_sessions(id) ON DELETE CASCADE,
        case_name TEXT NOT NULL,
        amount INTEGER NOT NULL,
        percentage NUMERIC(5, 2) NOT NULL,
        CHECK (amount >= 0),
        CHECK (percentage BETWEEN 0 AND 100));
        `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS session_skins (
        id SERIAL PRIMARY KEY,
        farm_session_id INTEGER NOT NULL REFERENCES farm_sessions(id) ON DELETE CASCADE,
        skin_name TEXT NOT NULL,
        amount INTEGER NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        CHECK (amount >= 0),
        CHECK (price >= 0));
        `);

    await pool.query('COMMIT');
    console.log('Database migration completed successfully.');
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  } finally {
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Database migration failed:', err);
  process.exit(1);
});
