import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { drizzle } from "drizzle-orm/d1";
import { systems, users } from "../../db/schema";
import { eq } from "drizzle-orm";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const system = await db.select().from(systems).get();
    // return c.json(system, 200);
    const status = system ? system!.status : 0;
    return c.text(status === 1 ? "Enable!" : "Disable...", 200);
  } catch (error) {
    return c.text("Internal server error!", 500);
  }
});

export default app;
