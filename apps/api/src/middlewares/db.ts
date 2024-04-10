import { schema, setupDb } from "db";
import type { MiddlewareHandler } from "hono";
import type { Env, Variables } from "../types";

export const db = (): MiddlewareHandler<{
	Bindings: Env;
	Variables: Variables;
}> => {
	return async (c, next) => {
		const db = setupDb(c.env.DATABASE_URL);
		c.set("db", db);
		c.set("schema", schema);
		await next();
	};
};
