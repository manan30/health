import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

export * from 'drizzle-orm';
export * from './types';
export { schema };

export function setupDb(dbUrl: string) {
	const sql = neon(dbUrl);
	const db = drizzle(sql, { schema, logger: true });
	return db;
}
