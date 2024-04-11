import { log } from "../schema";
import type { ingredient } from "../schema/nutrition/ingredient";
import type { recipe } from "../schema/nutrition/recipe";
import type { recipeIngredient } from "../schema/nutrition/recipe-ingredient";

export type RecipesSelectModel = typeof recipe.$inferSelect;
export type RecipesInsertModel = typeof recipe.$inferInsert;

export type RecipeIngredientsSelectModel = typeof recipeIngredient.$inferSelect;
export type RecipeIngredientsInsertModel = typeof recipeIngredient.$inferInsert;

export type IngredientsSelectModel = typeof ingredient.$inferSelect;
export type IngredientsInsertModel = typeof ingredient.$inferInsert;
