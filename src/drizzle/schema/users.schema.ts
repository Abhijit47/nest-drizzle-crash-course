import { relations } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { comments } from './comments.schema';
import { usersToGroups } from './groups.schema';
import { posts } from './posts.schema';
import { profileInfo } from './profileInfo.schema';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  comments: many(comments),
  posts: many(posts),
  profileInfo: one(profileInfo),
  usersToGroups: many(usersToGroups),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
