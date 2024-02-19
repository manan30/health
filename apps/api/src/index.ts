import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { db } from "./middleware/db";
import { Env, Variables } from "./types";
import workoutRoutes from "~/routes/fitness/workout";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("*", db(), cors());

app.route("/workouts", workoutRoutes);

showRoutes(app);

export default app;
