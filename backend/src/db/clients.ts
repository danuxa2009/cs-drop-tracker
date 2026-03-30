import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}
const { Pool } = pg;

export const pool = new Pool({
  connectionString: databaseUrl,
});
