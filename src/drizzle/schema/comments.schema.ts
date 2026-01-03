import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { posts } from './posts.schema';
import { users } from './users.schema';

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  comment: varchar('content').notNull(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});
