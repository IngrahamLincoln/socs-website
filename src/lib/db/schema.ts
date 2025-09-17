import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().unique(),
  isTeacher: boolean('is_teacher'),
  gradeLevel: text('grade_level'),
  school: text('school'),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const trackingEvents = pgTable('tracking_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'),
  eventType: text('event_type').notNull(),
  eventData: text('event_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});