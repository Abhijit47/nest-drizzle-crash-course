import { jsonb, pgTable, uuid } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const profileInfo = pgTable('profile_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  metadata: jsonb('metadata'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});
