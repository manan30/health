import { InferInsertModel, desc, eq } from "db";
import { Hono } from "hono";
import { Env, Variables } from "~/types";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get("/", (c) => {
  const db = c.get("db");
  const workouts = db.query.workout.findMany({
    with: { exercises: true },
    orderBy: (workouts, { asc }) => [asc(workouts.date)],
  });

  return c.json(workouts);
});

app.post("/", async (c) => {
  const db = c.get("db");
  const schema = c.get("schema");
  const body = (await c.req.json()) as InferInsertModel<typeof schema.workout>;
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
