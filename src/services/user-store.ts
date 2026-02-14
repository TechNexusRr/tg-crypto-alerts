import { eq } from "drizzle-orm";
import { db } from "../db/client.ts";
import { users } from "../db/schema.ts";

export function findOrCreateUser(chatId: string, username?: string) {
  const existing = db.select().from(users).where(eq(users.chatId, chatId)).get();
  if (existing) return existing;

  return db
    .insert(users)
    .values({ chatId, username: username ?? null })
    .returning()
    .get();
}
