ALTER TABLE "course_modules" DROP CONSTRAINT "course_modules_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "course_sections" DROP CONSTRAINT "course_sections_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "course_tabs" DROP CONSTRAINT "course_tabs_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "course_questions" ALTER COLUMN "tags" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "course_questions" ALTER COLUMN "tags" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_sections" ADD CONSTRAINT "course_sections_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_tabs" ADD CONSTRAINT "course_tabs_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;