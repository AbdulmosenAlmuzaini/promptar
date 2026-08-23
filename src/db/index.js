import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || 'postgres://placeholder:placeholder@ep-placeholder.us-east-1.aws.neon.tech/neondb';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
export { schema };
