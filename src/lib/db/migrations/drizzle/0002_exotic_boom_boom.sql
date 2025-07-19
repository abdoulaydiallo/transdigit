DROP TABLE "course_partners" CASCADE;--> statement-breakpoint
DROP TABLE "course_tools" CASCADE;--> statement-breakpoint
DROP TABLE "module_steps" CASCADE;--> statement-breakpoint
DROP TABLE "module_tools" CASCADE;--> statement-breakpoint
DROP TABLE "partners" CASCADE;--> statement-breakpoint
DROP TABLE "tools" CASCADE;--> statement-breakpoint
ALTER TABLE "course_modules" RENAME COLUMN "number" TO "steps";