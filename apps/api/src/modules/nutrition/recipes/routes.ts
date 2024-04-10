import { zValidator } from "@hono/zod-validator";
import { eq, inArray } from "db";
import { Hono } from "hono";
import type { Env, Variables } from "~/types";
import { GetRecipeResponse } from "./models/get-recipe";
import { ListRecipes } from "./models/list-recipes";
import {
	createOrUpdateRecipeRequest,
	deleteRecipeRequest,
	getRecipeRequest,
	toggleCompletionRecipeRequest,
} from "./requests";
import { CreateRecipeResponse } from "./responses/create-recipe";
import { SearchRecipesResponse } from "./responses/search-recipe";

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(
	"/recipes",
);

app.get("/", async (c) => {
	const db = c.get("db");

	const recipes = await db.query.recipe.findMany({
		orderBy: (recipes, { desc }) => desc(recipes.createdAt),
	});

	if (!recipes) {
		return c.newResponse("Unable to get recipes", 400);
	}

	return c.json(new ListRecipes(recipes).serialize());
});

app.post("/", zValidator("json", createOrUpdateRecipeRequest), async (c) => {
	const db = c.get("db");
	const schema = c.get("schema");
	const body = c.req.valid("json");

	const [recipe] = await db
		.insert(schema.recipe)
		.values({
			name: body.name,
			totalCalories: "0",
			totalWeight: "0",
			completed: false,
		})
		.returning();

	await db.insert(schema.recipeIngredient).values(
		body.items.map((item) => ({
			recipeId: recipe.id,
			ingredientId: item.type === "ingredient" ? item.id : null,
			recipeAsIngredientId: item.type === "recipe" ? item.id : null,
			quantity: `${item.quantity}`,
		})),
	);

	const recipeIngredients = await db.query.recipeIngredient.findMany({
		where: (recipeIngredients, { eq }) =>
			eq(recipeIngredients.recipeId, recipe.id),
		with: {
			ingredient: true,
			recipeAsIngredient: true,
		},
	});

	if (!recipeIngredients) {
		return c.newResponse("Recipe not found", 404);
	}

	let totalCalories = 0;
	let totalWeight = 0;

	for (const recipeIngredient of recipeIngredients) {
		const { ingredient, quantity, recipeAsIngredient } = recipeIngredient;
		let unitCalories = 0;
		if (ingredient) {
			const { calories, servingSize } = ingredient;
			unitCalories = calories / servingSize;
		} else if (recipeAsIngredient) {
			const { totalCalories, totalWeight } = recipeAsIngredient;
			unitCalories = Number(totalCalories) / Number(totalWeight);
		}
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

app.get("/search", async (c) => {
	const db = c.get("db");
	// const { searchTerm } = c.req.query;

	const recipes = await db.query.recipe.findMany({
		// where: (ingredients, { contains }) =>
		//   contains(ingredients.name, name as string),
		orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
	});

	return c.json(
		recipes.map((recipe) => new SearchRecipesResponse(recipe).serialize()),
	);
});

app.get("/:id", async (c) => {
	const db = c.get("db");
	const id = c.req.param("id");

	const recipe = await db.query.recipe.findFirst({
		where: (recipes, { eq }) => eq(recipes.id, Number(id)),
		with: {
			recipeIngredients: {
				with: {
					ingredient: true,
					recipeAsIngredient: true,
				},
			},
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
		const receivedIngredientsIds = body.items
			.map((item) => item.itemId)
			.filter(Boolean);

		const deletedIngredients = recipeIngredients.filter(
			(recipeIng) => !receivedIngredientsIds.includes(recipeIng.id),
		);

		let deletedRecipeIngredients: { id: number }[] = [];
		if (deletedIngredients.length) {
			deletedRecipeIngredients = await db
				.delete(schema.recipeIngredient)
				.where(
					inArray(
						schema.recipeIngredient.id,
						deletedIngredients.map((ing) => ing.id),
					),
				)
				.returning({ id: schema.recipeIngredient.id });
		}

		const filteredReceivedIngredients = body.items.filter(
			(ing) =>
				!deletedRecipeIngredients.find((delIng) => delIng.id === ing.itemId),
		);

		for (const ing of filteredReceivedIngredients) {
			const { id, quantity, itemId, type } = ing;
			const existingRecipeIngredient = recipeIngredients.find(
				(recipeIng) => recipeIng.id === itemId,
			);

			if (existingRecipeIngredient) {
				if (Number(existingRecipeIngredient.quantity) === Number(quantity))
					continue;
				await db
					.update(schema.recipeIngredient)
					.set({
						quantity: `${quantity}`,
					})
					.where(eq(schema.recipeIngredient.id, existingRecipeIngredient.id));
			} else {
				await db.insert(schema.recipeIngredient).values({
					ingredientId: type === "ingredient" ? id : null,
					recipeAsIngredientId: type === "recipe" ? id : null,
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
				recipeAsIngredient: true,
			},
		});

		if (!updatedRecipeIngredients) {
			return c.newResponse("Recipe not found", 404);
		}

		let totalCalories = 0;
		let totalWeight = 0;

		for (const recipeIngredient of updatedRecipeIngredients) {
			const { ingredient, quantity, recipeAsIngredient } = recipeIngredient;
			let unitCalories = 0;
			if (ingredient) {
				const { calories, servingSize } = ingredient;
				unitCalories = calories / servingSize;
			} else if (recipeAsIngredient) {
				const { totalCalories, totalWeight } = recipeAsIngredient;
				unitCalories = Number(totalCalories) / Number(totalWeight);
			}
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
	},
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
	},
);

export const recipeRoutes = app;
