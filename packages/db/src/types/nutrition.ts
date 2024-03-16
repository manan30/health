import { recipe } from '../schema/nutrition/recipe';
import { recipeIngredient } from '../schema/nutrition/recipe-ingredient';
import { ingredient } from '../schema/nutrition/ingredient';

export type RecipesSelectModel = typeof recipe.$inferSelect;
export type RecipesInsertModel = typeof recipe.$inferInsert;

export type RecipeIngredientsSelectModel = typeof recipeIngredient.$inferSelect;
export type RecipeIngredientsInsertModel = typeof recipeIngredient.$inferInsert;

export type IngredientsSelectModel = typeof ingredient.$inferSelect;
export type IngredientsInsertModel = typeof ingredient.$inferInsert;
