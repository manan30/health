import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Variables, Env } from "~/types";
import { eq } from "db";
import { Ingredient } from "./models/ingredient";

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

app.put(
  "/:id",
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
    const id = c.req.param("id");

    const ingredient = await db.query.ingredient.findFirst({
      where: (ingredients, { eq }) => eq(ingredients.id, Number(id)),
    });

    if (!ingredient) {
      return c.newResponse("Ingredient not found", 404);
    }

    const body = c.req.valid("json");

    const updatedIngredient = await db
      .update(schema.ingredient)
      .set({
        brand: body.brand,
        calories: body.calories,
        macros: {
          protein: body.protein ?? undefined,
          fat: body.fat ?? undefined,
          carbs: body.carbs ?? undefined,
          fiber: body.fiber ?? undefined,
        },
        name: body.name,
        servingSize: body.servingSize,
        servingUnit: body.servingUnit,
        store: body.store,
      })
      .where(eq(schema.ingredient.id, Number(id)))
      .returning();

    return c.json(new Ingredient(updatedIngredient[0]));
  }
);

app.delete(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const db = c.get("db");
    const schema = c.get("schema");
    const id = c.req.param("id");

    const ingredient = await db.query.ingredient.findFirst({
      where: (ingredients, { eq }) => eq(ingredients.id, Number(id)),
    });

    if (!ingredient) {
      return c.newResponse("Ingredient not found", 404);
    }

    await db
      .delete(schema.ingredient)
      .where(eq(schema.ingredient.id, Number(id)));

    return c.newResponse(null, 204);
  }
);

export const ingredientRoutes = app;
