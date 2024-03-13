import { schema, setupDb } from "db";
import { MiddlewareHandler } from "hono";
import { Env, Variables } from "../types";

export const db = (): MiddlewareHandler<{
  Bindings: Env;
  Variables: Variables;
}> => {
  return async (c, next) => {
    console.log(c.env, c.env.DATABASE_URL);
    const dbUrl = c.env.DATABASE_URL;
    console.log("dbUrl", dbUrl);
    const db = setupDb(dbUrl);
    c.set("db", db);
    c.set("schema", schema);
    await next();
  };
};
