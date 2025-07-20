CREATE TYPE "public"."difficulty" AS ENUM('facile', 'moyen', 'difficile');--> statement-breakpoint
CREATE TYPE "public"."exercise_type" AS ENUM('projet', 'quiz', 'tache');--> statement-breakpoint
CREATE TYPE "public"."lesson_type" AS ENUM('texte', 'video', 'pdf');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('choix_multiple', 'texte_libre', 'vrai_faux');--> statement-breakpoint
CREATE TABLE "course_exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"moduleId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" "exercise_type" NOT NULL,
	"submissionUrl" varchar(500),
	"score" real DEFAULT 0,
	"maxScore" real NOT NULL,
	"deadline" timestamp,
	"difficulty" "difficulty" DEFAULT 'facile',
	"tags" jsonb DEFAULT '[]'::jsonb,
	"instructions" jsonb DEFAULT '{}'::jsonb,
	"feedback" text,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"moduleId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" "lesson_type" DEFAULT 'texte' NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"videoUrl" varchar(500),
	"pdfUrl" varchar(500),
	"orderIndex" integer NOT NULL,
	"estimatedTime" integer,
	"difficulty" "difficulty" DEFAULT 'facile',
	"tags" jsonb DEFAULT '[]'::jsonb,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"lessonId" integer NOT NULL,
	"type" "question_type" DEFAULT 'choix_multiple' NOT NULL,
	"questionText" text NOT NULL,
	"options" jsonb DEFAULT '{}'::jsonb,
	"correctAnswer" text,
	"explanation" text,
	"maxScore" real DEFAULT 1 NOT NULL,
	"orderIndex" integer NOT NULL,
	"difficulty" "difficulty" DEFAULT 'facile',
	"tags" jsonb DEFAULT '[]'::jsonb,
	"timeLimit" integer,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "course_exercises" ADD CONSTRAINT "course_exercises_moduleId_course_modules_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."course_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_moduleId_course_modules_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."course_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_questions" ADD CONSTRAINT "course_questions_lessonId_course_lessons_id_fk" FOREIGN KEY ("lessonId") REFERENCES "public"."course_lessons"("id") ON DELETE cascade ON UPDATE no action;