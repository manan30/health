import { schema, setupDb } from "db";
import { MiddlewareHandler } from "hono";
import { Env, Variables } from "../types";

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
