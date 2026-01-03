import { config } from 'dotenv';
// import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
config({ path: '.env.local' });
// Validate the environment variable exists
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}
export default defineConfig({
  schema: './src/drizzle/schemas.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
