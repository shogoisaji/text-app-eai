import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Welcome to the public area"));

export default app;
