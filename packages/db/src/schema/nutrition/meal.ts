import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { mealItem } from './meal-item';

export const meal = pgTable('meal', {
  id: serial('id').primaryKey(),
  date: timestamp('date', { precision: 3, mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const mealRelations = relations(meal, ({ many }) => ({
  mealItems: many(mealItem),
}));
