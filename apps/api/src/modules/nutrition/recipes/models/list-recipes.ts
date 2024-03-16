import {
  RecipesSelectModel,
  RecipeIngredientsSelectModel,
  IngredientsSelectModel,
} from "db";
import { BaseModel } from "~/core/models";

interface SerializedRecipe {
  name: string;
  totalCalories: number;
  totalWeight: number;
  completed: boolean;
}

type RecipeIngredient = RecipeIngredientsSelectModel & {
  ingredient: IngredientsSelectModel;
};

export type IRecipe = RecipesSelectModel & {
  recipeIngredients: RecipeIngredient[];
};

export class ListRecipes extends BaseModel<SerializedRecipe[]> {
  recipes: IRecipe[];

  constructor(recipes: IRecipe[]) {
    super();
    this.recipes = recipes;
  }

  serialize() {
    return this.recipes.map((recipe) => {
      return {
        name: recipe.name,
        totalCalories: Number(recipe.totalCalories),
        totalWeight: Number(recipe.totalWeight),
        completed: recipe.completed,
      };
    });
  }
}
