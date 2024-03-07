CREATE TABLE IF NOT EXISTS "ingredient" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"calories" integer NOT NULL,
	"serving_size" integer NOT NULL,
	"serving_unit" text NOT NULL,
	"store" text,
	"brand" text,
	"macros" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workout" ALTER COLUMN "name" DROP NOT NULL;