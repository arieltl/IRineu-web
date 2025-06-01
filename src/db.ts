import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// Database connection
export const db = drizzle({
  connection: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5433/mydb',
  schema,
});

// Export schema for use in other files
export { schema };