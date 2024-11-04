import { Hono } from "hono";
import { generate } from "@/api/generate";
import { drizzle } from "drizzle-orm/d1";
import { systems } from "db/schema";

type Bindings = {
  GEMINI_API_KEY: string;
  PASS: string;
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  const db = drizzle(c.env.DB);

  const apiKey = c.env.GEMINI_API_KEY;
  const { text, pass } = await c.req.json();
  try {
    const system = await db.select().from(systems).get();
    if (!system) return c.text("Disable: system", 401);
    if (system.status !== 1) return c.text("Disable: system", 401);
    if (system.chatPass !== pass) return c.text("wrong pass", 401);

    const translatedWord = await generate(text, apiKey);
    return c.json(translatedWord, 200);
  } catch (error) {
    return c.json({ error }, 500);
  }
});

export default app;
