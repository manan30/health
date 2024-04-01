import { relations } from 'drizzle-orm';
import {
  decimal,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { meal } from './meal';
import { recipe } from './recipe';
import { ingredient } from './ingredient';

export const mealItem = pgTable('meal_item', {
  id: serial('id').primaryKey(),
  mealId: serial('meal_id').notNull(),
  recipeId: serial('recipe_id'),
  ingredientId: serial('ingredient_id'),
  quantity: decimal('servings').notNull(),
  calories: decimal('calories').notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const mealItemRelations = relations(mealItem, ({ one, many }) => ({
  meal: one(meal, { fields: [mealItem.mealId], references: [meal.id] }),
  recipe: one(recipe, { fields: [mealItem.recipeId], references: [recipe.id] }),
  ingredient: one(ingredient, {
    fields: [mealItem.ingredientId],
    references: [ingredient.id],
  }),
}));
