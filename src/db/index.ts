import * as schema from './schema';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

const isRemote = Boolean(
  tursoUrl && (tursoUrl.startsWith('libsql://') || tursoUrl.startsWith('https://'))
);

// Fallback to memory / local file for offline dev
const client = isRemote
  ? createClient({
      url: tursoUrl!,
      authToken: tursoAuthToken,
    })
  : createClient({
      url: process.env.NODE_ENV === 'production' ? 'file:/tmp/findely.db' : 'file:sqlite.db',
    });

export const db = drizzle(client, { schema });
