CREATE TABLE IF NOT EXISTS "workout" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"date" timestamp(3) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sets" text[],
	"date" timestamp(3) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"workout_id" integer NOT NULL,
	"exercise_type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "muscle_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_type_to_equipment" (
	"exercise_type_id" integer NOT NULL,
	"equipment_id" integer NOT NULL,
	CONSTRAINT "exercise_type_to_equipment_exercise_type_id_equipment_id_pk" PRIMARY KEY("exercise_type_id","equipment_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_type_to_muscle_group" (
	"exercise_type_id" integer NOT NULL,
	"muscle_group_id" integer NOT NULL,
	CONSTRAINT "exercise_type_to_muscle_group_exercise_type_id_muscle_group_id_pk" PRIMARY KEY("exercise_type_id","muscle_group_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise" ADD CONSTRAINT "exercise_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise" ADD CONSTRAINT "exercise_exercise_type_id_exercise_type_id_fk" FOREIGN KEY ("exercise_type_id") REFERENCES "exercise_type"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_type_to_equipment" ADD CONSTRAINT "exercise_type_to_equipment_exercise_type_id_exercise_type_id_fk" FOREIGN KEY ("exercise_type_id") REFERENCES "exercise_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_type_to_equipment" ADD CONSTRAINT "exercise_type_to_equipment_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_type_to_muscle_group" ADD CONSTRAINT "exercise_type_to_muscle_group_exercise_type_id_exercise_type_id_fk" FOREIGN KEY ("exercise_type_id") REFERENCES "exercise_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_type_to_muscle_group" ADD CONSTRAINT "exercise_type_to_muscle_group_muscle_group_id_muscle_group_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
