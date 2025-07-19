import { pgTable, text, varchar, integer, boolean, timestamp, serial, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Table principale des cours
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageSrc: varchar('image_src', { length: 500 }),
  duration: varchar('duration', { length: 50 }), // ex: "9 semaines"
  totalHours: integer('total_hours'), // ex: 400
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Table des onglets/sections de cours
export const courseTabs = pgTable('course_tabs', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  key: varchar('key', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(false),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table du contenu des sections par cours
export const courseSections = pgTable('course_sections', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  tabKey: varchar('tab_key', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 500 }),
  description: text('description'),
  items: jsonb('items'), // Array de strings
  children: jsonb('children'), // Structure flexible pour données spécifiques
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Table des modules de formation
export const courseModules = pgTable('course_modules', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  title: varchar('title', { length: 255 }).notNull(),
  duration: varchar('duration', { length: 50 }), // ex: "90H"
  description: text('description'),
  steps: jsonb('steps'), // Array de strings
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});


// Relations Drizzle
export const coursesRelations = relations(courses, ({ many }) => ({
  sections: many(courseSections),
  modules: many(courseModules),
}));

export const courseTabsRelations = relations(courseTabs, ({ many }) => ({
  sections: many(courseSections),
}));

export const courseSectionsRelations = relations(courseSections, ({ one }) => ({
  course: one(courses, {
    fields: [courseSections.courseId],
    references: [courses.id],
  }),
}));

export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseModules.courseId],
    references: [courses.id],
  })
}));


// Types TypeScript dérivés
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type CourseTab = typeof courseTabs.$inferSelect;
export type NewCourseTab = typeof courseTabs.$inferInsert;
export type CourseSection = typeof courseSections.$inferSelect;
export type NewCourseSection = typeof courseSections.$inferInsert;
export type CourseModule = typeof courseModules.$inferSelect;
export type NewCourseModule = typeof courseModules.$inferInsert;