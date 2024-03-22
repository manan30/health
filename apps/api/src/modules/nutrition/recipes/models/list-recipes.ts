import {
  RecipesSelectModel,
  RecipeIngredientsSelectModel,
  IngredientsSelectModel,
} from "db";
import { BaseModel } from "~/core/models";

interface SerializedRecipe {
  id: number;
  name: string;
  totalCalories: number;
  totalWeight: number;
  completed: boolean;
  createdAt: string;
}

type RecipeIngredient = RecipeIngredientsSelectModel & {
  ingredient: IngredientsSelectModel | null;
  recipeAsIngredient: RecipesSelectModel | null;
};

export type IRecipe = RecipesSelectModel & {
  recipeIngredients: RecipeIngredient[] | null;
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
        id: recipe.id,
        name: recipe.name,
        totalCalories: Number(recipe.totalCalories),
        totalWeight: Number(recipe.totalWeight),
        completed: recipe.completed,
        createdAt: recipe.createdAt,
      };
    });
  }
}
