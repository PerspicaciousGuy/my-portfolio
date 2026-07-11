import { NextResponse } from "next/server";
import { site } from "@/data/site";

type Body = {
  name?: string;
  email?: string;
  message?: string;
  /** Honeypot — real users never fill this; bots do. */
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  // Silently accept and drop honeypot hits, so bots don't learn they failed.
  if (body.website) return NextResponse.json({ ok: true });

  if (name.length < 2) {
    return NextResponse.json({ error: "Tell me your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That email doesn't look right." },
      { status: 400 },
    );
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "A little more detail, please." },
      { status: 400 },
    );
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "That's too long." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;

  // Without a key the form can't send. Say so honestly rather than showing a
  // success state for a message that went nowhere.
  if (!key) {
    return NextResponse.json(
      { error: "unconfigured", fallback: site.email },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [site.email],
        reply_to: email,
        subject: `Portfolio — ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Couldn't send that. Try emailing me directly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Couldn't send that. Try emailing me directly." },
      { status: 502 },
    );
  }
}
