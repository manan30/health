import type { schema, setupDb } from 'db';

export type Env = {
	DATABASE_URL: string;
};

export type Variables = {
	db: ReturnType<typeof setupDb>;
	schema: typeof schema;
};
