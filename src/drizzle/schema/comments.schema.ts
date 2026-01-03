import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { posts } from './posts.schema';
import { users } from './users.schema';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  comment: varchar('content', { length: 500 }).notNull(),
  postId: integer('post_id')
    .notNull()
    .references(() => posts.id),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id),
});
