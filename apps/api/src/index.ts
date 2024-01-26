import { Hono } from "hono";
import { drizzle } from "drizzle-orm/neon-http";
import { setupDb, schema } from "db";

type Env = {
  DATABASE_URL: string;
};

type Variables = {
  db: ReturnType<typeof setupDb>;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("*", async (c, next) => {
  const db = setupDb(c.env.DATABASE_URL);
  c.set("db", db);
  await next();
});

app.get("/", async (c) => {
  const db = c.get("db");
  const workouts = await db.query.workout.findMany();
  await db
    .insert(schema.workout)
    .values({ name: "Test", date: new Date().toISOString() });
  return c.json(workouts);
});

export default app;
