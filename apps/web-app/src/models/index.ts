import { RecipeIngredientsSelectModel, RecipesSelectModel } from "db";

export interface Ingredient {
  id: number;
  name: string;
  calories: number;
  servingSize: number;
  servingUnit: string;
  store: string | null;
  brand: string | null;
  macros: {
    protein?: number;
    fat?: number;
    carbs?: number;
    fiber?: number;
    sugar?: number;
  } | null;
  createdAt: Date;
}

export type Recipe = RecipesSelectModel & {
  recipeIngredients: RecipeIngredientsSelectModel[];
};
