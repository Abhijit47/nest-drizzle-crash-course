import { Pool } from '@neondatabase/serverless';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';
import { DrizzleDB } from './types/drizzle';
// import { drizzle } from 'drizzle-orm/neon-http';
// import { Pool } from 'pg';
// import { drizzle, NodePgDatabase} from 'drizzle-orm/node-postgres';

export const DRIZZLE = Symbol('drizzle-connection');

@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Initialize and return your Drizzle connection here
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const pool = new Pool({ connectionString: databaseUrl, ssl: true });
        // return drizzle(pool, { schema: schemas }) as NodePgDatabase<
        //   typeof schemas
        // >;
        return drizzle(pool, { schema }) as DrizzleDB;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
