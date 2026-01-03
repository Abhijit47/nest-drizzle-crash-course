// import { config } from 'dotenv';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// config({ path: '.env.local' });

export default defineConfig({
  schema: './src/drizzle/schemas.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
