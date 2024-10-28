import { Hono } from "hono";
import { jwtMiddleware } from "./middleware/auth";
import adminRoutes from "@/routes/admin";
import authRoutes from "@/routes/auth";
import indexPage from "@/routes/index";

const app = new Hono();

// ログイン
app.route("/", indexPage);
app.route("/auth", authRoutes);

// ミドルウェア設定
app.use("/admin/*", jwtMiddleware);

// ルート設定
app.route("/admin", adminRoutes);

export default app;
