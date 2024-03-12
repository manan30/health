import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { db } from "./middlewares/db";
import { Env, Variables } from "./types";
import workoutRoutes from "~/routes/fitness/workout";
import { ingredientRoutes } from "~/modules/ingredients";

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(
  "/api/v1"
);

app.use("*", db(), cors());

app.route("/workouts", workoutRoutes);
app.route("/nutrition", ingredientRoutes);

showRoutes(app);

export default app;
