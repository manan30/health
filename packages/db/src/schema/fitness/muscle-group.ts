import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { exerciseTypeToMuscleGroup } from './junction';

export const muscleGroup = pgTable('muscle_group', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const muscleGroupRelations = relations(muscleGroup, ({ many }) => ({
  exerciseTypeToMuscleGroup: many(exerciseTypeToMuscleGroup),
}));
