import { JwtPayload } from "@/types/types";
import { systems } from "db/schema";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { verify } from "jsonwebtoken";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: { user: JwtPayload } }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const system = await db.select().from(systems).get();
    if (!system) return c.text("Internal server error!", 500);
    const status = system ? system.status : 0;
    const now = new Date(Date.now());
    const expire = new Date(system.expire);
    if (expire < now) {
      return c.text("expired!", 401);
    }
    return c.json({ status, expire }, 200);
  } catch (error) {
    return c.text("Internal server error!", 500);
  }
});

app.post("/", async (c) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return c.text("Unauthorized", 401);
  }
  try {
    const payload = verify(token, c.env.JWT_SECRET) as JwtPayload;
    const role = payload.role;
    if (role !== "admin") {
      return c.text(`no admin: ${role}`);
    }
    const { status, expire } = await c.req.json();
    const db = drizzle(c.env.DB);

    try {
      await db.update(systems).set({ status, expire }).execute();

      const updatedSystem = await db.select().from(systems).get();
      return c.text(
        updatedSystem
          ? updatedSystem.status === 1
            ? "Enable"
            : "Disable"
          : "No system found",
        200
      );
    } catch (error) {
      return c.text("Internal server error!", 500);
    }
  } catch (error) {
    return c.text("Invalid token", 401);
  }
});

export default app;
