import { pgTable, text, varchar, integer, boolean, timestamp, serial, jsonb, uuid, real, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum Definitions
export const lessonTypeEnum = pgEnum('lesson_type', ['texte', 'video', 'pdf']);
export const questionTypeEnum = pgEnum('question_type', ['choix_multiple', 'texte_libre', 'vrai_faux']);
export const exerciseTypeEnum = pgEnum('exercise_type', ['projet', 'quiz', 'tache']);
export const difficultyEnum = pgEnum('difficulty', ['facile', 'moyen', 'difficile']);

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
  courseId: integer('course_id').references(() => courses.id, {onDelete: 'cascade'}),
  key: varchar('key', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(false),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table du contenu des sections par cours
export const courseSections = pgTable('course_sections', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, {onDelete: 'cascade'}),
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
  courseId: integer('course_id').references(() => courses.id, {onDelete: 'cascade'}),
  title: varchar('title', { length: 255 }).notNull(),
  duration: integer('duration'), // ex: 30
  description: text('description'),
  steps: jsonb('steps'), // Array de strings
  tools: jsonb('tools'),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});


// Table des leçons (mise à jour)
export const lessons = pgTable('course_lessons', {
  id: serial('id').primaryKey(),
  moduleId: integer('moduleId').notNull().references(() => courseModules.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  type: lessonTypeEnum('type').notNull().default('texte'),
  content: jsonb('content').notNull().default({}),
  videoUrl: varchar('videoUrl', { length: 500 }),
  pdfUrl: varchar('pdfUrl', { length: 500 }),
  orderIndex: integer('orderIndex').notNull(),
  estimatedTime: integer('estimatedTime'),
  difficulty: difficultyEnum('difficulty').default('facile'),
  tags: text('tags').array().default([]), // ex. : ["SQL", "bases"]
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Table des questions (mise à jour)
export const questions = pgTable('course_questions', {
  id: serial('id').primaryKey(),
  lessonId: integer('lessonId').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  type: questionTypeEnum('type').notNull().default('choix_multiple'),
  questionText: text('questionText').notNull(),
  options: jsonb('options').default({}),
  correctAnswer: text('correctAnswer'),
  explanation: text('explanation'),
  maxScore: real('maxScore').notNull().default(1),
  orderIndex: integer('orderIndex').notNull(),
  difficulty: difficultyEnum('difficulty').default('facile'),
  tags: text('tags').array().default([]),
  timeLimit: integer('timeLimit'), // en secondes
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Table des exercices (mise à jour)
export const exercises = pgTable('course_exercises', {
  id: serial('id').primaryKey(),
  moduleId: integer('moduleId').notNull().references(() => courseModules.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: exerciseTypeEnum('type').notNull(),
  submissionUrl: varchar('submissionUrl', { length: 500 }),
  score: real('score').default(0),
  maxScore: real('maxScore').notNull(),
  deadline: timestamp('deadline'),
  difficulty: difficultyEnum('difficulty').default('facile'),
  tags: text('tags').array().default([]),
  instructions: jsonb('instructions').default({}), // ex. : {"steps": ["Étape 1", "Étape 2"]}
  feedback: text('feedback'),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
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
  }),
  lessons: many(lessons),
  exercises: many(exercises),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(courseModules, {
    fields: [lessons.moduleId],
    references: [courseModules.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  lesson: one(lessons, {
    fields: [questions.lessonId],
    references: [lessons.id],
  }),
}));

export const exercisesRelations = relations(exercises, ({ one }) => ({
  module: one(courseModules, {
    fields: [exercises.moduleId],
    references: [courseModules.id],
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
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;