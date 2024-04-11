import {
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export type Macros = {
	protein?: number;
	fat?: number;
	carbs?: number;
	fiber?: number;
	sugar?: number;
};

export const ingredient = pgTable("ingredient", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	calories: integer("calories").notNull(),
	servingSize: integer("serving_size").notNull(),
	servingUnit: text("serving_unit").notNull(),
	store: text("store"),
	brand: text("brand"),
	macros: jsonb("macros").$type<Macros>().default({}),
	createdAt: timestamp("created_at", { precision: 3, mode: "string" })
		.defaultNow()
		.notNull(),
});
