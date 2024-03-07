DO $$ BEGIN
 CREATE TYPE "meal_type" AS ENUM('breakfast', 'lunch', 'dinner', 'evening-snack', 'morning-snack', 'afternoon-snack', 'anytime');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meal" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"meal_type" "meal_type" NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meal_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"meal_id" serial NOT NULL,
	"recipe_id" serial NOT NULL,
	"ingredient_id" serial NOT NULL,
	"servings" numeric NOT NULL,
	"calories" numeric NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
