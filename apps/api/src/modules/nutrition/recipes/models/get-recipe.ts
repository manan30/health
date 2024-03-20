import { RecipeIngredientsSelectModel, RecipesSelectModel } from "db";
import { BaseModel } from "~/core/models";

type SerializedGetRecipeResponse = {
  id: number;
  name: string;
  totalCalories: string;
  totalWeight: string;
  completed: boolean;
  recipeIngredients: {
    id: number;
    ingredientId: number;
    quantity: string;
  }[];
};

type Recipe = RecipesSelectModel & {
  recipeIngredients: RecipeIngredientsSelectModel[];
};

export class GetRecipeResponse extends BaseModel<SerializedGetRecipeResponse> {
  recipe: Recipe;

  constructor(values: Recipe) {
    super();
    this.recipe = values;
  }

  serialize() {
    return {
      id: this.recipe.id,
      name: this.recipe.name,
      totalCalories: this.recipe.totalCalories,
      totalWeight: this.recipe.totalWeight,
      completed: this.recipe.completed,
      recipeIngredients: this.recipe.recipeIngredients.map(
        (recipeIngredient) => ({
          id: recipeIngredient.id,
          ingredientId: recipeIngredient.ingredientId,
          quantity: recipeIngredient.quantity,
        })
      ),
    };
  }
}
