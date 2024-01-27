import { setupDb, schema } from "db";

export type Env = {
  DATABASE_URL: string;
};

export type Variables = {
  db: ReturnType<typeof setupDb>;
  schema: typeof schema;
};
