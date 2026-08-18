import { eq } from "drizzle-orm";
import { ensureSubscriberSchema, getDb } from "../../../db";
import { subscribers } from "../../../db/schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { email?: string };
    const email = payload.email?.trim().toLowerCase() ?? "";

    if (!emailPattern.test(email) || email.length > 254) {
      return Response.json({ error: "Enter a valid work email address." }, { status: 400 });
    }

    await ensureSubscriberSchema();
    const db = getDb();
    const existing = await db
      .select({ id: subscribers.id })
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return Response.json({ ok: true, alreadySubscribed: true });
    }

    await db.insert(subscribers).values({ email, source: "aiwork-edition-01" });
    return Response.json({ ok: true, alreadySubscribed: false }, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unexpected error";
    return Response.json(
      { error: detail.includes("not available") ? detail : "We could not register your interest. Please try again." },
      { status: 500 },
    );
  }
}
