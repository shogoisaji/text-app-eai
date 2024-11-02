import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const userList = await db.select().from(users).get();

    return c.json(userList, 200);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return c.text("Internal server error!", 500);
  }
});

export default app;
