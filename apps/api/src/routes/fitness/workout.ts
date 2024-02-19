import { InferInsertModel, setupDb } from "db";
import { Hono } from "hono";
import { db } from "~/middleware/db";
import { Env, Variables } from "~/types";
import { isEmptyString } from "~/utils/functions";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get("/", async (c) => {
  const db = c.get("db");

  const workouts = await db.query.workout.findMany({
    with: { exercises: true },
    orderBy: (workouts, { asc }) => [asc(workouts.date)],
  });

  return c.json(workouts);
});

app.post("/new", async (c) => {
  const db = c.get("db");
  const schema = c.get("schema");
  const body = (await c.req.json()) as {
    type: string;
    date: string;
    exercises?: { name: string; sets: string[] }[];
  };

  // TODO: validate body

  const workout = await db
    .insert(schema.workout)
    .values({
      name: body.type,
      date: body.date,
    })
    .returning({ id: schema.workout.id });

  const scrubbedExercises = body.exercises?.filter((exercise) => {
    return (
      !isEmptyString(exercise.name) &&
      exercise.sets.some((set) => !isEmptyString(set))
    );
  });

  if (scrubbedExercises?.length) {
    await db.insert(schema.exercise).values(
      scrubbedExercises.map((exercise) => {
        return {
          name: exercise.name,
          sets: exercise.sets,
          workoutId: workout[0].id,
          date: body.date,
          exerciseTypeId: 1,
        };
      })
    );
  }

  return c.json({ workoutId: workout[0].id });
});

app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const workout = await db.query.workout.findFirst({
    where: (workout, { eq }) => eq(workout.id, Number(id)),
    with: { exercises: true },
  });

  if (!workout) {
    return c.json({ error: "Workout not found" }, 404);
  }

  return c.json(workout);
});

export default app;
