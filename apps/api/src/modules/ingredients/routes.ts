import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Variables, Env } from "~/types";
import { Ingredient } from "./model";
import { CreateIngredient } from "./requests";
import { asc } from "db";

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(
  "/ingredients"
);

app.get("/", async (c) => {
  const db = c.get("db");

  const ingredientsValues = await db.query.ingredient.findMany({
    orderBy: (ingredients, { asc }) => [asc(ingredients.name)],
  });

  const ingredients = ingredientsValues.map(
    (ingredient) => new Ingredient(ingredient)
  );

  return c.json(ingredients);
});

app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const ingredient = await db.query.ingredient.findFirst({
    where: (ingredients, { eq }) => eq(ingredients.id, Number(id)),
  });

  if (!ingredient) {
    return c.newResponse("Ingredient not found", 404);
  }

  return c.json(new Ingredient(ingredient));
});

app.post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z
        .string({
          required_error: "Name is a required field",
          invalid_type_error: "Name must be a string",
        })
        .min(1, "Name must be at least 1 character long"),
      calories: z
        .number({
          required_error: "Calories is a required field",
          invalid_type_error: "Calories must be a number",
        })
        .nonnegative(),
      servingSize: z
        .number({
          required_error: "Serving size is a required field",
          invalid_type_error: "Serving size must be a number",
        })
        .nonnegative("Serving size must be a non-negative number"),
      servingUnit: z
        .string({
          required_error: "Serving unit is a required field",
          invalid_type_error: "Serving unit must be a string",
        })
        .min(1, "Serving unit must be at least 1 character long"),
      store: z.string().nullable(),
      brand: z.string().nullable(),
      protein: z.number().nullable(),
      fat: z.number().nullable(),
      carbs: z.number().nullable(),
      fiber: z.number().nullable(),
    })
  ),
  async (c) => {
    const db = c.get("db");
    const schema = c.get("schema");
    const body = c.req.valid("json");

    const ingredient = await db
      .insert(schema.ingredient)
      .values({
        calories: body.calories,
        name: body.name,
        servingSize: body.servingSize,
        servingUnit: body.servingUnit,
        store: body.store,
        brand: body.brand,
        macros: {
          protein: body.protein,
          fat: body.fat,
          carbs: body.carbs,
          fiber: body.fiber,
        },
      })
      .returning();

    return c.json(new Ingredient(ingredient[0]), 201);
  }
);

export const ingredientRoutes = app;
