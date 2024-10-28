import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Welcome to the admin area"));

export default app;
