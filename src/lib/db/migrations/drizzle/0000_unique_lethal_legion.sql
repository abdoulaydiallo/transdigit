CREATE TYPE "public"."difficulty" AS ENUM('facile', 'moyen', 'difficile');--> statement-breakpoint
CREATE TYPE "public"."exercise_type" AS ENUM('projet', 'quiz', 'tache');--> statement-breakpoint
CREATE TYPE "public"."lesson_type" AS ENUM('texte', 'video', 'pdf');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('choix_multiple', 'texte_libre', 'vrai_faux');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'teacher', 'admin');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"title" varchar(255) NOT NULL,
	"duration" integer,
	"description" text,
	"steps" jsonb,
	"tools" jsonb,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"tab_key" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(500),
	"description" text,
	"items" jsonb,
	"children" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_tabs" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"key" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT false,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"image_src" varchar(500),
	"duration" varchar(50),
	"total_hours" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "courses_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "course_exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"moduleId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" "exercise_type" NOT NULL,
	"submissionUrl" varchar(500),
	"score" real DEFAULT 0,
	"maxScore" real NOT NULL,
	"deadline" timestamp (0),
	"difficulty" "difficulty" DEFAULT 'facile',
	"tags" text[] DEFAULT '{}',
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
	"tags" text[] DEFAULT '{}',
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
	"tags" text[] DEFAULT '{}',
	"timeLimit" integer,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_sections" ADD CONSTRAINT "course_sections_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_tabs" ADD CONSTRAINT "course_tabs_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_exercises" ADD CONSTRAINT "course_exercises_moduleId_course_modules_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."course_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_moduleId_course_modules_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."course_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_questions" ADD CONSTRAINT "course_questions_lessonId_course_lessons_id_fk" FOREIGN KEY ("lessonId") REFERENCES "public"."course_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;