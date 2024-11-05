import { Hono } from "hono";
import { generate } from "@/api/generate";
import { drizzle } from "drizzle-orm/d1";
import { systems } from "db/schema";

const MODELS: Record<string, string> = {
  flash: "gemini-1.5-flash",
  pro: "gemini-1.5-pro",
};

type Bindings = {
  GEMINI_API_KEY: string;
  PASS: string;
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  const db = drizzle(c.env.DB);

  const apiKey = c.env.GEMINI_API_KEY;
  const { text, chatPass, model } = await c.req.json();
  try {
    const system = await db.select().from(systems).get();
    if (!system) return c.text("Disable: system", 401);
    if (system.status !== 1) return c.text("Disable: system", 401);
    if (system.chatPass !== chatPass) return c.text("wrong pass", 401);
    const modelValue = MODELS[model];
    console.log("model", modelValue);

    const translatedWord = await generate(text, apiKey, modelValue);
    return c.json(translatedWord, 200);
  } catch (error) {
    return c.json({ error }, 500);
  }
});

export default app;
