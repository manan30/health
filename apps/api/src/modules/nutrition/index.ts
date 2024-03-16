import { Hono } from "hono";
import { Env, Variables } from "~/types";
import { ingredientRoutes } from "./ingredients";
import { recipeRoutes } from "./recipes";

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(
  "/nutrition"
);

app.route("/", ingredientRoutes);
app.route("/", recipeRoutes);

export const nutritionRoutes = app;
