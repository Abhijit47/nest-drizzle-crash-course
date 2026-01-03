import { relations } from 'drizzle-orm';
import { jsonb, pgTable, uuid } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const profileInfo = pgTable('profile_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  metadata: jsonb('metadata'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const profileInfoRelations = relations(profileInfo, ({ one }) => ({
  user: one(users, {
    fields: [profileInfo.userId],
    references: [users.id],
  }),
}));

export type InsertProfileInfo = typeof profileInfo.$inferInsert;
export type SelectProfileInfo = typeof profileInfo.$inferSelect;
