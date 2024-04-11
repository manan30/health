import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { exercise } from './exercise';

export const workout = pgTable('workout', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	description: text('description'),
	date: timestamp('date', { precision: 3, mode: 'string' }).notNull(),
	createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
		.defaultNow()
		.notNull(),
});

export const workoutRelations = relations(workout, ({ many }) => ({
	exercises: many(exercise),
}));
