import { Hono, MiddlewareHandler } from "hono";
import { jwtMiddleware } from "./middleware/auth";
import adminRoutes from "@/routes/admin";
import authRoutes from "@/routes/auth";
import indexPage from "@/routes/index";
import generateRouts from "@/routes/generate";
import statusPage from "@/routes/status";
import { corsMiddleware } from "./middleware/cors";

const app = new Hono();

// ミドルウェア設定
app.use("*", corsMiddleware);
app.use("/admin/*", jwtMiddleware);

app.route("/", indexPage);
app.route("/status", statusPage);
app.route("/auth", authRoutes);
app.route("/generate", generateRouts);

app.route("/admin", adminRoutes);

export default app;
