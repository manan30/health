import { schema, setupDb } from "db";
import { MiddlewareHandler } from "hono";
import { Env, Variables } from "../types";

export const db = (): MiddlewareHandler<{
  Bindings: Env;
  Variables: Variables;
}> => {
  return async (c, next) => {
    console.log(JSON.stringify(c.env, null, 2));
    const db = setupDb(c.env.DATABASE_URL);
    c.set("db", db);
    c.set("schema", schema);
    await next();
  };
};
