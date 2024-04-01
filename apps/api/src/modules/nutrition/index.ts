import { Hono } from "hono";
import { Env, Variables } from "~/types";
import { ingredientRoutes } from "./ingredients";
import { recipeRoutes } from "./recipes";
import { mealRoutes } from "./meals/routes";

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(
  "/nutrition"
);

app.route("/", ingredientRoutes);
app.route("/", recipeRoutes);
app.route("/", mealRoutes);

export const nutritionRoutes = app;
