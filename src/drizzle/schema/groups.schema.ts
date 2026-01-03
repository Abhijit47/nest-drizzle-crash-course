import { index, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
});

// Join table for many-to-many relationship between users and groups
export const usersToGroups = pgTable(
  'users_to_groups',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
  },
  // old way = Deprecated
  // (table) => ({
  //   // Composite primary key
  //   pk: primaryKey({ columns: [table.userId, table.groupId] }),
  // }),

  // new way
  (table) => [
    // Composite primary key
    primaryKey({ name: 'pk', columns: [table.userId, table.groupId] }),

    // Indexes for faster queries
    index('idx_user_id').on(table.userId),
  ],
);
