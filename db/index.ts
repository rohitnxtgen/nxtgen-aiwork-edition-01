import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  if (!env.DB) {
    throw new Error("The subscription service is not available yet.");
  }
  return drizzle(env.DB, { schema });
}

export async function ensureSubscriberSchema() {
  if (!env.DB) {
    throw new Error("The subscription service is not available yet.");
  }

  await env.DB.batch([
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        email TEXT NOT NULL,
        source TEXT DEFAULT 'aiwork-edition-01' NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `),
    env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_unique ON subscribers (email)"),
  ]);
}
