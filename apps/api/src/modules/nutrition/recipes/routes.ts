import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Variables, Env } from "~/types";
import {
  createOrUpdateRecipeRequest,
  deleteRecipeRequest,
  getRecipeRequest,
  toggleCompletionRecipeRequest,
} from "./requests";
import { ListRecipes } from "./models/list-recipes";
import { CreateRecipeResponse } from "./responses/create-recipe";
import { eq, inArray } from "db";
import { GetRecipeResponse } from "./models/get-recipe";

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(
  "/recipes"
);

app.get("/", async (c) => {
  const db = c.get("db");

  const recipes = await db.query.recipe.findMany({
    with: {
      recipeIngredients: {
        with: {
          ingredient: true,
        },
      },
    },
    orderBy: (recipes, { desc }) => desc(recipes.createdAt),
  });

  if (!recipes) {
    return c.newResponse("Unable to get recipes", 400);
  }

  return c.json(new ListRecipes(recipes).serialize());
});

// todo: request updated other recipes with same name as well
app.post("/", zValidator("json", createOrUpdateRecipeRequest), async (c) => {
  const db = c.get("db");
  const schema = c.get("schema");
  const body = c.req.valid("json");

  const [recipe] = await db
    .insert(schema.recipe)
    .values({
      name: body.name,
      totalCalories: 0,
      totalWeight: 0,
      completed: false,
    })
    .returning();

  await db.insert(schema.recipeIngredient).values(
    body.ingredients.map((ingredient) => ({
      recipeId: recipe.id,
      ingredientId: ingredient.id,
      quantity: `${ingredient.quantity}`,
    }))
  );

  const recipeIngredients = await db.query.recipeIngredient.findMany({
    where: (recipeIngredients, { eq }) =>
      eq(recipeIngredients.recipeId, recipe.id),
    with: {
      ingredient: true,
    },
  });

  if (!recipeIngredients) {
    return c.newResponse("Recipe not found", 404);
  }

  let totalCalories = 0;
  let totalWeight = 0;

  for (const recipeIngredient of recipeIngredients) {
    const { ingredient, quantity } = recipeIngredient;
    const { calories, servingSize } = ingredient;
    const unitCalories = calories / servingSize;
    const ingredientCalories = unitCalories * Number(quantity);
    totalCalories += ingredientCalories;
    totalWeight += Number(quantity);
  }

  await db
    .update(schema.recipe)
    .set({
      totalCalories: `${totalCalories}`,
      totalWeight: `${totalWeight}`,
    })
    .where(eq(schema.recipe.id, recipe.id));

  const updatedRecipe = await db.query.recipe.findFirst({
    where: (recipes, { eq }) => eq(recipes.id, recipe.id),
  });

  if (!updatedRecipe) {
    return c.newResponse("Recipe not found", 404);
  }

  return c.json(new CreateRecipeResponse(updatedRecipe).serialize());
});

app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const recipe = await db.query.recipe.findFirst({
    where: (recipes, { eq }) => eq(recipes.id, Number(id)),
    with: {
      recipeIngredients: true,
    },
  });

  if (!recipe) {
    return c.newResponse("Recipe not found", 404);
  }

  return c.json(new GetRecipeResponse(recipe).serialize());
});

app.put(
  "/:id",
  zValidator("json", createOrUpdateRecipeRequest),
  zValidator("param", getRecipeRequest),
  async (c) => {
    const db = c.get("db");
    const schema = c.get("schema");
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    const recipe = await db.query.recipe.findFirst({
      where: (recipes, { eq }) => eq(recipes.id, Number(id)),
    });

    if (!recipe) {
      return c.newResponse("Recipe not found", 404);
    }

    const recipeIngredients = await db.query.recipeIngredient.findMany({
      where: (recipeIngredients, { eq }) =>
        eq(recipeIngredients.recipeId, Number(id)),
    });
    const receivedIngredientsIds = body.ingredients.map((ing) => ing.id);

    const deletedIngredients = recipeIngredients.filter(
      (recipeIng) => !receivedIngredientsIds.includes(recipeIng.ingredientId)
    );

    let deletedRecipeIngredients: { id: number }[] = [];
    if (deletedIngredients.length) {
      deletedRecipeIngredients = await db
        .delete(schema.recipeIngredient)
        .where(
          inArray(
            schema.recipeIngredient.id,
            deletedIngredients.map((ing) => ing.id)
          )
        )
        .returning({ id: schema.recipeIngredient.id });
    }

    const filteredReceivedIngredients = body.ingredients.filter(
      (ing) => !deletedRecipeIngredients.find((delIng) => delIng.id === ing.id)
    );

    for (const ing of filteredReceivedIngredients) {
      const { id, quantity } = ing;
      const existingIngredient = recipeIngredients.find(
        (recipeIng) => recipeIng.ingredientId === id
      );

      if (existingIngredient) {
        if (Number(existingIngredient.quantity) === Number(quantity)) continue;
        await db
          .update(schema.recipeIngredient)
          .set({
            quantity: `${quantity}`,
          })
          .where(eq(schema.recipeIngredient.id, existingIngredient.id));
      } else {
        await db.insert(schema.recipeIngredient).values({
          ingredientId: id,
          quantity: `${quantity}`,
          recipeId: recipe.id,
        });
      }
    }

    const updatedRecipeIngredients = await db.query.recipeIngredient.findMany({
      where: (recipeIngredients, { eq }) =>
        eq(recipeIngredients.recipeId, recipe.id),
      with: {
        ingredient: true,
      },
    });

    if (!updatedRecipeIngredients) {
      return c.newResponse("Recipe not found", 404);
    }

    let totalCalories = 0;
    let totalWeight = 0;

    for (const recipeIngredient of updatedRecipeIngredients) {
      const { ingredient, quantity } = recipeIngredient;
      const { calories, servingSize } = ingredient;
      const unitCalories = calories / servingSize;
      const ingredientCalories = unitCalories * Number(quantity);
      totalCalories += ingredientCalories;
      totalWeight += Number(quantity);
    }

    const [updatedRecipe] = await db
      .update(schema.recipe)
      .set({
        name: body.name,
        totalCalories: `${totalCalories}`,
        totalWeight: `${totalWeight}`,
      })
      .where(eq(schema.recipe.id, Number(id)))
      .returning({ id: schema.recipe.id });

    return c.json(updatedRecipe);
  }
);

app.delete("/:id", zValidator("param", deleteRecipeRequest), async (c) => {
  const db = c.get("db");
  const schema = c.get("schema");
  // todo: request does not get validated
  const { id } = c.req.valid("param");

  const recipe = await db.query.recipe.findFirst({
    where: (recipes, { eq }) => eq(recipes.id, Number(id)),
  });

  if (!recipe) {
    return c.newResponse("Recipe not found", 404);
  }

  await db.delete(schema.recipe).where(eq(schema.recipe.id, Number(id)));

  return c.newResponse(null, 204);
});

app.put(
  "/toggle-completion/:id",
  zValidator("param", toggleCompletionRecipeRequest),
  async (c) => {
    const db = c.get("db");
    const schema = c.get("schema");
    const { id } = c.req.valid("param");

    const recipe = await db.query.recipe.findFirst({
      where: (recipes, { eq }) => eq(recipes.id, Number(id)),
    });

    if (!recipe) {
      return c.newResponse("Recipe not found", 404);
    }

    await db
      .update(schema.recipe)
      .set({
        completed: !recipe.completed,
      })
      .where(eq(schema.recipe.id, Number(id)));

    return c.newResponse(null, 204);
  }
);

export const recipeRoutes = app;
