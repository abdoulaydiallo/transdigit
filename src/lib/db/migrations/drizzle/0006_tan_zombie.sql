ALTER TABLE "course_lessons" ALTER COLUMN "tags" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "course_lessons" ALTER COLUMN "tags" SET DEFAULT '{}';