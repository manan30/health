import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { exerciseTypeToEquipment } from "./junction";

export const equipment = pgTable("equipment", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at", { precision: 3, mode: "string" })
		.defaultNow()
		.notNull(),
});

export const equipmentRelations = relations(equipment, ({ many }) => ({
	exerciseTypeToEquipment: many(exerciseTypeToEquipment),
}));
