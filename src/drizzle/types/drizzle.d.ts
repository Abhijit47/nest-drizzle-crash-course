import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from '../schema';

export type DrizzleDB = NeonDatabase<typeof schema>;
