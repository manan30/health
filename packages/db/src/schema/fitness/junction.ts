import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { equipment } from './equipment';
import { exerciseType } from './exercise-type';
import { muscleGroup } from './muscle-group';

export const exerciseTypeToMuscleGroup = pgTable(
	'exercise_type_to_muscle_group',
	{
		exerciseTypeId: integer('exercise_type_id')
			.notNull()
			.references(() => exerciseType.id),
		muscleGroupId: integer('muscle_group_id')
			.notNull()
			.references(() => muscleGroup.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.exerciseTypeId, t.muscleGroupId] }),
	}),
);

export const exerciseTypeToMuscleGroupRelations = relations(
	exerciseTypeToMuscleGroup,
	({ one }) => ({
		exerciseType: one(exerciseType, {
			fields: [exerciseTypeToMuscleGroup.exerciseTypeId],
			references: [exerciseType.id],
		}),
		muscleGroup: one(muscleGroup, {
			fields: [exerciseTypeToMuscleGroup.muscleGroupId],
			references: [muscleGroup.id],
		}),
	}),
);

export const exerciseTypeToEquipment = pgTable(
	'exercise_type_to_equipment',
	{
		exerciseTypeId: integer('exercise_type_id')
			.notNull()
			.references(() => exerciseType.id),
		equipmentId: integer('equipment_id')
			.notNull()
			.references(() => equipment.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.exerciseTypeId, t.equipmentId] }),
	}),
);

export const exerciseTypeToEquipmentRelations = relations(
	exerciseTypeToEquipment,
	({ one }) => ({
		exerciseType: one(exerciseType, {
			fields: [exerciseTypeToEquipment.exerciseTypeId],
			references: [exerciseType.id],
		}),
		equipment: one(equipment, {
			fields: [exerciseTypeToEquipment.equipmentId],
			references: [equipment.id],
		}),
	}),
);
