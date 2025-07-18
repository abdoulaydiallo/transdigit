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
  number: integer('number').notNull(),// Numéro du module dans le cours
  title: varchar('title', { length: 255 }).notNull(),
  duration: varchar('duration', { length: 50 }), // ex: "90H"
  description: text('description'),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Table des étapes/steps par module
export const moduleSteps = pgTable('module_steps', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id').references(() => courseModules.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table des outils/technologies
export const tools = pgTable('tools', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  iconSrc: varchar('icon_src', { length: 500 }),
  category: varchar('category', { length: 100 }), // ex: "language", "framework", "tool"
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table de liaison entre modules et outils
export const moduleTools = pgTable('module_tools', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id').references(() => courseModules.id),
  toolId: integer('tool_id').references(() => tools.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table de liaison entre cours et outils (pour les outils généraux du cours)
export const courseTools = pgTable('course_tools', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  toolId: integer('tool_id').references(() => tools.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table des partenaires
export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  website: varchar('website', { length: 500 }),
  logo: varchar('logo', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table de liaison entre cours et partenaires
export const coursePartners = pgTable('course_partners', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  partnerId: integer('partner_id').references(() => partners.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations Drizzle
export const coursesRelations = relations(courses, ({ many }) => ({
  sections: many(courseSections),
  modules: many(courseModules),
  courseTools: many(courseTools),
  coursePartners: many(coursePartners),
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
  }),
  steps: many(moduleSteps),
  moduleTools: many(moduleTools),
}));

export const moduleStepsRelations = relations(moduleSteps, ({ one }) => ({
  module: one(courseModules, {
    fields: [moduleSteps.moduleId],
    references: [courseModules.id],
  }),
}));

export const toolsRelations = relations(tools, ({ many }) => ({
  moduleTools: many(moduleTools),
  courseTools: many(courseTools),
}));

export const moduleToolsRelations = relations(moduleTools, ({ one }) => ({
  module: one(courseModules, {
    fields: [moduleTools.moduleId],
    references: [courseModules.id],
  }),
  tool: one(tools, {
    fields: [moduleTools.toolId],
    references: [tools.id],
  }),
}));

export const courseToolsRelations = relations(courseTools, ({ one }) => ({
  course: one(courses, {
    fields: [courseTools.courseId],
    references: [courses.id],
  }),
  tool: one(tools, {
    fields: [courseTools.toolId],
    references: [tools.id],
  }),
}));

export const partnersRelations = relations(partners, ({ many }) => ({
  coursePartners: many(coursePartners),
}));

export const coursePartnersRelations = relations(coursePartners, ({ one }) => ({
  course: one(courses, {
    fields: [coursePartners.courseId],
    references: [courses.id],
  }),
  partner: one(partners, {
    fields: [coursePartners.partnerId],
    references: [partners.id],
  }),
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
export type ModuleStep = typeof moduleSteps.$inferSelect;
export type NewModuleStep = typeof moduleSteps.$inferInsert;
export type Tool = typeof tools.$inferSelect;
export type NewTool = typeof tools.$inferInsert;
export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;