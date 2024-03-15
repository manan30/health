import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { db } from "./middlewares/db";
import { Env, Variables } from "./types";
import workoutRoutes from "~/routes/fitness/workout";
import { ingredientRoutes } from "~/modules/ingredients";

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath("/v1");

app.use("*", db(), cors());

app.get("*", (c) => {
  console.log(c.req.url);
  return c.json({ message: "Hello, world!" });
});

app.get("/", (c) => {
  return c.json({ message: "Hello, world!" });
});

app.route("/workouts", workoutRoutes);
app.route("/nutrition", ingredientRoutes);

showRoutes(app);

app.notFound((c) => {
  console.log(c.req.url);
  showRoutes(app, { verbose: true });
  return c.text("Custom 404 Message", 404);
});

export default {
  fetch: app.fetch,
};
