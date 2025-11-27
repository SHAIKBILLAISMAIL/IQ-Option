import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

// Check if environment variables are available
const tursoUrl = process.env.TURSO_CONNECTION_URL || process.env.DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error('Database credentials missing. Please set TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN environment variables.');
}

const client = createClient({
  url: tursoUrl || 'file:local.db',
  authToken: tursoToken || '',
});

export const db = drizzle(client, { schema });

export type Database = typeof db;