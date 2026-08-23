import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL || 'postgres://placeholder:placeholder@ep-placeholder.us-east-1.aws.neon.tech/neondb';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
export { schema };
