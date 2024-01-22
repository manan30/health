import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/index.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
