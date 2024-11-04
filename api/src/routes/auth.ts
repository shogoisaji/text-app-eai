import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { JwtPayload } from "@/types/types";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/login", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const { email, password } = await c.req.json();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (user && user.password === password) {
      const payload: JwtPayload = {
        userId: user.id.toString(),
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
      };
      const token = jwt.sign(payload, c.env.JWT_SECRET);
      return c.json({ token });
    }

    return c.text("Invalid credentials", 401);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return c.text("Internal server error!", 500);
  }
});

export default app;
