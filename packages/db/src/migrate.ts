import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { schema } from '.';

async function migrateDb() {
	const sql = neon(process.env.DATABASE_URL ?? '');
	const db = drizzle(sql, { schema });

	await migrate(db, { migrationsFolder: 'drizzle' });
}

migrateDb();
