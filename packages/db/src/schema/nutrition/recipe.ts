import { relations } from 'drizzle-orm';
import {
	boolean,
	decimal,
	pgTable,
	serial,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { recipeIngredient } from './recipe-ingredient';

export const recipe = pgTable('recipe', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	totalCalories: decimal('total_calories').notNull(),
	totalWeight: decimal('total_weight').notNull(),
	completed: boolean('completed').notNull().default(false),
	createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
		.defaultNow()
		.notNull(),
});

export const recipeRelations = relations(recipe, ({ many }) => ({
	recipeIngredients: many(recipeIngredient, { relationName: 'recipe' }),
	recipeAsIngredients: many(recipeIngredient, {
		relationName: 'recipeAsIngredient',
	}),
}));
