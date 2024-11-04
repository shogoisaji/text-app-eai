import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  password: text("password").notNull(),
  role: text().notNull(),
});

export const systems = sqliteTable("systems", {
  status: integer().notNull(), // 1: Enable, 0: Disable
  expire: text().notNull(),
});
