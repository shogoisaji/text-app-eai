import { JwtPayload } from "@/types/types";
import { systems } from "db/schema";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: { user: JwtPayload } }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);

  try {
    const system = await db.select().from(systems).get();
    const status = system ? system!.status : 0;
    return c.json({ status }, 200);
  } catch (error) {
    return c.text("Internal server error!", 500);
  }
});

app.post("/", async (c) => {
  // const user: JwtPayload = c.get("user");
  // if (!user) {
  //   return c.text("User not found!", 401);
  // }
  // if (user.role !== "admin") {
  //   return c.text(`no admin: ${user.role}`);
  // }

  const { status } = await c.req.json();
  const db = drizzle(c.env.DB);

  try {
    await db.update(systems).set({ status }).execute();

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
});

export default app;
