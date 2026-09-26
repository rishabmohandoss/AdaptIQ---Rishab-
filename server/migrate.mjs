import { readFile } from 'node:fs/promises';
import { connectDatabase } from './db.mjs';
const db = connectDatabase();
try { await db.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8')); console.log('Schema ready'); }
finally { await db.end(); }
