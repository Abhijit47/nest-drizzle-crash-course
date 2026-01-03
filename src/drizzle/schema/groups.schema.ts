import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

// Join table for many-to-many relationship between users and groups
export const usersToGroups = pgTable('usersToGroups', {
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  groupId: integer('group_id')
    .notNull()
    .references(() => groups.id),
});
