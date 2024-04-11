import { relations } from 'drizzle-orm';
import {
	jsonb,
	pgEnum,
	pgTable,
	real,
	serial,
	timestamp,
} from 'drizzle-orm/pg-core';
import { ingredient } from './ingredient';
import { meal } from './meal';
import { recipe } from './recipe';

export const mealTypeEnum = pgEnum('meal_type', [
	'breakfast',
	'lunch',
	'dinner',
	'evening-snack',
	'morning-snack',
	'afternoon-snack',
	'anytime',
]);

export type Macros = {
	protein?: number;
	fat?: number;
	carbs?: number;
	fiber?: number;
	sugar?: number;
};

export const log = pgTable('log', {
	id: serial('id').primaryKey(),
	date: timestamp('date', { precision: 3, mode: 'string' }).notNull(),
	mealType: mealTypeEnum('meal_type').notNull(),
	quantity: real('quantity').notNull(),
	calories: real('calories').notNull(),
	macros: jsonb('macros').$type<Macros>().default({}),
	mealId: serial('meal_id'),
	ingredientId: serial('ingredient_id'),
	recipeId: serial('recipe_id'),
	createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
		.defaultNow()
		.notNull(),
});

export const logRelations = relations(log, ({ one }) => ({
	meal: one(meal, {
		fields: [log.mealId],
		references: [meal.id],
	}),
	ingredient: one(ingredient, {
		fields: [log.ingredientId],
		references: [ingredient.id],
	}),
	recipe: one(recipe, {
		fields: [log.recipeId],
		references: [recipe.id],
	}),
}));
