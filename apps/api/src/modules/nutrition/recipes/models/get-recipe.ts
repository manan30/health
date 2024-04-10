import type {
	IngredientsSelectModel,
	RecipeIngredientsSelectModel,
	RecipesSelectModel,
} from "db";
import { BaseResponse } from "~/core/response";

enum ItemType {
	Recipe = "recipe",
	Ingredient = "ingredient",
}

type SerializedGetRecipeResponse = {
	id: number;
	name: string;
	completed: boolean;
	recipeIngredients: {
		id: number;
		itemId: number;
		quantity: string;
		type: ItemType;
	}[];
};

type RecipeIngredients = RecipeIngredientsSelectModel & {
	ingredients?: IngredientsSelectModel[];
	recipeAsIngredients?: RecipesSelectModel[];
};

type Recipe = RecipesSelectModel & {
	recipeIngredients: RecipeIngredients[];
};

export class GetRecipeResponse extends BaseResponse<SerializedGetRecipeResponse> {
	recipe: Recipe;

	constructor(values: Recipe) {
		super();
		this.recipe = values;
	}

	serialize() {
		return {
			id: this.recipe.id,
			name: this.recipe.name,
			completed: this.recipe.completed,
			recipeIngredients: this.recipe.recipeIngredients.map(
				(recipeIngredient) => ({
					id: recipeIngredient.id,
					quantity: recipeIngredient.quantity,
					itemId: (recipeIngredient.recipeAsIngredientId ??
						recipeIngredient.ingredientId) as number,
					type: recipeIngredient.recipeAsIngredientId
						? ItemType.Recipe
						: ItemType.Ingredient,
				}),
			),
		};
	}
}
