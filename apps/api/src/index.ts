import { Hono } from "hono";
import { db } from "./middleware/db";
import { Env, Variables } from "./types";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("*", db());

export default app;
