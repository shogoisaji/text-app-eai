import { Context, Next } from "hono";
import { verify } from "jsonwebtoken";

export const jwtMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.text("Unauthorized", 401);
  }

  try {
    const payload = verify(token, process.env.JWT_SECRET as string);
    c.set("user", payload);
    await next();
  } catch (error) {
    return c.text("Invalid token", 401);
  }
};
