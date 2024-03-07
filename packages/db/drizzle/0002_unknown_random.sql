CREATE TABLE IF NOT EXISTS "recipe" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"total_calories" numeric NOT NULL,
	"total_weight" numeric NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipe_ingredient" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	"quantity" numeric NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
