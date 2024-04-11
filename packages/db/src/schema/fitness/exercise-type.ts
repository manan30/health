import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { exercise } from './exercise';
import { exerciseTypeToMuscleGroup } from './junction';

export const exerciseType = pgTable('exercise_type', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
		.defaultNow()
		.notNull(),
});

export const exerciseTypeRelations = relations(exerciseType, ({ many }) => ({
	exercises: many(exercise),
	exerciseTypeToMuscleGroup: many(exerciseTypeToMuscleGroup),
}));
