ALTER TABLE "course_exercises" ALTER COLUMN "deadline" SET DATA TYPE timestamp (0);--> statement-breakpoint
ALTER TABLE "course_exercises" ALTER COLUMN "tags" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "course_exercises" ALTER COLUMN "tags" SET DEFAULT '{}';