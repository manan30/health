import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { workout } from './workout';
import { relations } from 'drizzle-orm';
import { exerciseType } from './exercise-type';

export const exercise = pgTable('exercise', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  sets: text('sets').array(),
  date: timestamp('date', { precision: 3, mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  workoutId: integer('workout_id')
    .references(() => workout.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    })
    .notNull(),
  exerciseTypeId: integer('exercise_type_id')
    .references(() => exerciseType.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    })
    .notNull(),
});

export const exerciseRelations = relations(exercise, ({ one }) => ({
  exerciseType: one(exerciseType, {
    fields: [exercise.exerciseTypeId],
    references: [exerciseType.id],
  }),
  workout: one(workout, {
    fields: [exercise.workoutId],
    references: [workout.id],
  }),
}));
