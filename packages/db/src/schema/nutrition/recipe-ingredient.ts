import { relations } from 'drizzle-orm';
import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { recipe } from './recipe';
import { ingredient } from './ingredient';

export const recipeIngredient = pgTable('recipe_ingredient', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id').notNull(),
  ingredientId: integer('ingredient_id').notNull(),
  quantity: decimal('quantity').notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const recipeIngredientRelations = relations(
  recipeIngredient,
  ({ one }) => ({
    recipe: one(recipe, {
      fields: [recipeIngredient.recipeId],
      references: [recipe.id],
    }),
    ingredient: one(ingredient, {
      fields: [recipeIngredient.ingredientId],
      references: [ingredient.id],
    }),
  })
);
