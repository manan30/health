import { Hono } from "hono";
import type { Env, Variables } from "~/types";
import { ingredientRoutes } from "./ingredients";
import { mealRoutes } from "./meals/routes";
import { recipeRoutes } from "./recipes";

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(
	"/nutrition",
);

app.route("/", ingredientRoutes);
app.route("/", recipeRoutes);
app.route("/", mealRoutes);

export const nutritionRoutes = app;
