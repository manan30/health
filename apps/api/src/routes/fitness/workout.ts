import { InferInsertModel, setupDb } from "db";
import { Hono } from "hono";
import { db } from "~/middleware/db";
import { Env, Variables } from "~/types";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get("/", async (c) => {
  const db = c.get("db");

  const workouts = await db.query.workout.findMany({
    with: { exercises: true },
    orderBy: (workouts, { asc }) => [asc(workouts.date)],
  });

  return c.json(workouts);
});

app.post("/", async (c) => {
  const db = c.get("db");
  const schema = c.get("schema");
  const body = (await c.req.json()) as InferInsertModel<typeof schema.workout>;

  // TODO: validate body

  const workout = await db.insert(schema.workout).values({
    name: body.name,
    description: body.description,
    date: body.date,
  });

  return c.json(workout);
});

app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const workout = await db.query.workout.findFirst({
    where: (workout, { eq }) => eq(workout.id, Number(id)),
    with: { exercises: true },
  });

  return c.json(workout);
});

export default app;
