// seed.ts

import { users } from "./schema";
import { drizzle } from "drizzle-orm/d1";
import { D1Database } from "@cloudflare/workers-types";

// Cloudflare D1への接続
declare const DB: D1Database;
export const db = drizzle(DB);

const seedData = async () => {
  await db
    .insert(users)
    .values([{ id: 1, email: "e", password: "p", role: "admin" }]);

  console.log("Seed data inserted successfully.");
};

seedData();
