import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  return c.text("Welcome eai", 200);
});

export default app;
