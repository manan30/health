import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Variables, Env } from "~/types";
import {
  createRecipeRequest,
  deleteRecipeRequest,
  toggleCompletionRecipeRequest,
} from "./requests";
import { ListRecipes } from "./models/list-recipes";
import { CreateRecipeResponse } from "./responses/create-recipe";
import { eq } from "db";

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
app.post("/", zValidator("json", createRecipeRequest), async (c) => {
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

  await db.update(schema.recipe).set({
    totalCalories: `${totalCalories}`,
    totalWeight: `${totalWeight}`,
  });

  const updatedRecipe = await db.query.recipe.findFirst({
    where: (recipes, { eq }) => eq(recipes.id, recipe.id),
  });

  if (!updatedRecipe) {
    return c.newResponse("Recipe not found", 404);
  }

  return c.json(new CreateRecipeResponse(updatedRecipe).serialize());
});

// app.get("/:id", async (c) => {
//   const db = c.get("db");
//   const id = c.req.param("id");

//   const ingredient = await db.query.ingredient.findFirst({
//     where: (ingredients, { eq }) => eq(ingredients.id, Number(id)),
//   });

//   if (!ingredient) {
//     return c.newResponse("Ingredient not found", 404);
//   }

//   return c.json(new Ingredient(ingredient));
// });

// app.put(
//   "/:id",
//   zValidator(
//     "json",
//     z.object({
//       name: z
//         .string({
//           required_error: "Name is a required field",
//           invalid_type_error: "Name must be a string",
//         })
//         .min(1, "Name must be at least 1 character long"),
//       calories: z
//         .number({
//           required_error: "Calories is a required field",
//           invalid_type_error: "Calories must be a number",
//         })
//         .nonnegative(),
//       servingSize: z
//         .number({
//           required_error: "Serving size is a required field",
//           invalid_type_error: "Serving size must be a number",
//         })
//         .nonnegative("Serving size must be a non-negative number"),
//       servingUnit: z
//         .string({
//           required_error: "Serving unit is a required field",
//           invalid_type_error: "Serving unit must be a string",
//         })
//         .min(1, "Serving unit must be at least 1 character long"),
//       store: z.string().nullable(),
//       brand: z.string().nullable(),
//       protein: z.number().nullable(),
//       fat: z.number().nullable(),
//       carbs: z.number().nullable(),
//       fiber: z.number().nullable(),
//     })
//   ),
//   async (c) => {
//     const db = c.get("db");
//     const schema = c.get("schema");
//     const id = c.req.param("id");

//     const ingredient = await db.query.ingredient.findFirst({
//       where: (ingredients, { eq }) => eq(ingredients.id, Number(id)),
//     });

//     if (!ingredient) {
//       return c.newResponse("Ingredient not found", 404);
//     }

//     const body = c.req.valid("json");

//     const updatedIngredient = await db
//       .update(schema.ingredient)
//       .set({
//         brand: body.brand,
//         calories: body.calories,
//         macros: {
//           protein: body.protein ?? undefined,
//           fat: body.fat ?? undefined,
//           carbs: body.carbs ?? undefined,
//           fiber: body.fiber ?? undefined,
//         },
//         name: body.name,
//         servingSize: body.servingSize,
//         servingUnit: body.servingUnit,
//         store: body.store,
//       })
//       .where(eq(schema.ingredient.id, Number(id)))
//       .returning();

//     return c.json(new Ingredient(updatedIngredient[0]));
//   }
// );

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
      .where(eq(schema.recipe.id, Number(id)))
      .returning();

    return c.newResponse(null, 204);
  }
);

export const recipeRoutes = app;
