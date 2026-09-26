import pg from 'pg';
import { readFileSync } from 'node:fs';
export function connectDatabase(env = process.env) {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  if (env.NODE_ENV === 'production' && env.DATABASE_SSL !== 'true') throw new Error('RDS TLS is required in production');
  return new pg.Pool({ connectionString: env.DATABASE_URL, max: 10,
    ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true,
      ...(env.DATABASE_CA_FILE ? { ca: readFileSync(env.DATABASE_CA_FILE, 'utf8') } : {}) } : false });
}
