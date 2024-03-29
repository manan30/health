import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { db } from "./middlewares/db";
import { Env, Variables } from "./types";
import workoutRoutes from "~/routes/fitness/workout";
import { nutritionRoutes } from "./modules/nutrition";

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(
  "/health/v1"
);

app.use("*", db(), cors());

app.route("/workouts", workoutRoutes);
app.route("/", nutritionRoutes);

showRoutes(app);

app.notFound((c) => {
  return c.text("Nothing to see here!", 404);
});

export default {
  fetch: app.fetch,
};
