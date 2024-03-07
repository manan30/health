import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { mealItem } from './meal-item';

export const mealTypeEnum = pgEnum('meal_type', [
  'breakfast',
  'lunch',
  'dinner',
  'evening-snack',
  'morning-snack',
  'afternoon-snack',
  'anytime',
]);

export const meal = pgTable('meal', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  mealType: mealTypeEnum('meal_type').notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const mealRelations = relations(meal, ({ many }) => ({
  mealItems: many(mealItem),
}));
