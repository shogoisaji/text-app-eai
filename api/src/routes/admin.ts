import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { systems } from "../../db/schema";
import { JwtPayload } from "@/types/types";

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
    return c.text(status === 1 ? "Enable!" : "Disable...", 200);
  } catch (error) {
    return c.text("Internal server error!", 500);
  }
});

app.post("/", async (c) => {
  const { role }: JwtPayload = c.get("user");
  if (role !== "admin") {
    return c.text(`no admin: ${role}`);
  }

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
