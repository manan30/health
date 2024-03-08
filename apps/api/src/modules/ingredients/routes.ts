import { Hono } from "hono";
import { Variables, Env } from "~/types";
import { Ingredient } from "./model";
import { CreateIngredient } from "./requests";

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(
  "/ingredients"
);

app.get("/", async (c) => {
  const db = c.get("db");

  const ingredientsValues = await db.query.ingredient.findMany();

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

app.post("/", async (c) => {
  const db = c.get("db");
  const schema = c.get("schema");
  const body = await c.req.json<CreateIngredient>();

  if (!body) {
    return c.newResponse("Invalid request body", 400);
  }

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
        sugar: body.sugar,
      },
    })
    .returning();

  return c.json(new Ingredient(ingredient[0]));
});

export const ingredientRoutes = app;
