import { faker } from '@faker-js/faker';
import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables.');
}

async function main() {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: true,
  });

  const db = drizzle({
    client: pool,
    schema,
  });
  console.log(
    'Connected to the database using Drizzle ORM with Neon Serverless.',
  );

  console.log('Seeding started... 🌱🌱🌱');
  const [userIds] = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const user = await db
        .insert(schema.users)
        .values({
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          password: faker.internet.password(),
        })
        .returning();

      return Promise.resolve([user[0].id]);
    }),
  );
  const [postIds] = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const post = await db
        .insert(schema.posts)
        .values({
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs({ min: 1, max: 3 }),
          authorId: faker.helpers.arrayElement(userIds),
        })
        .returning();

      return Promise.resolve([post[0].id]);
    }),
  );
  await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const comment = await db
        .insert(schema.comments)
        .values({
          comment: faker.lorem.paragraphs({ min: 1, max: 3 }),
          postId: faker.helpers.arrayElement(postIds),
          authorId: faker.helpers.arrayElement(userIds),
        })
        .returning();

      return Promise.resolve([comment[0].id]);
    }),
  );
  const insertedGroups = await db
    .insert(schema.groups)
    .values([{ name: 'JS' }, { name: 'TS' }])
    .returning({ id: schema.groups.id });

  const groupIds = insertedGroups.map((g) => g.id);

  await Promise.all(
    userIds.map(async (userId) => {
      const u2g = await db
        .insert(schema.usersToGroups)
        .values({
          userId,
          groupId: faker.helpers.arrayElement(groupIds),
        })
        .returning();
      return Promise.resolve(u2g);
    }),
  );
}

main().catch((error) => {
  console.error('Error seeding the database:', error);
  process.exit(0);
});
