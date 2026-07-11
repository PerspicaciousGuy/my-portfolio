"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";
import { site } from "@/data/site";

type State =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

const field =
  "w-full rounded-lg border border-border bg-bg/50 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-fg-subtle focus:border-accent/60";

export function ContactForm() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.status === "sending") return;

    // Hold the element: React pools the synthetic event, so e.currentTarget is
    // null once we're past an await. Touching it there throws, and the throw
    // lands in the catch below — reporting a network error for a request that
    // actually succeeded.
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({ status: "sending" });

    let res: Response;
    let json: { error?: string };

    // Only the network call belongs in the try. A broad try/catch around the
    // whole handler turns any bug in the success path into a bogus "couldn't
    // reach the server" — which is exactly what it did.
    try {
      res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      json = await res.json();
    } catch {
      setState({
        status: "error",
        message: `Couldn't reach the server. Email me at ${site.email}.`,
      });
      return;
    }

    if (res.ok) {
      setState({ status: "sent" });
      form.reset();
      return;
    }

    setState({
      status: "error",
      message:
        json.error === "unconfigured"
          ? `The form isn't hooked up yet — email me at ${site.email}.`
          : (json.error ?? "Something went wrong."),
    });
  }

  if (state.status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-xl border border-accent/40 bg-accent/5 p-5"
      >
        <Check className="size-5 shrink-0 text-accent" />
        <p className="text-sm text-fg-muted">
          Sent. I&apos;ll get back to you.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          required
          minLength={2}
          placeholder="Your name"
          aria-label="Your name"
          className={field}
        />
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          aria-label="Your email"
          className={field}
        />
      </div>

      <textarea
        name="message"
        required
        minLength={10}
        rows={4}
        placeholder="What are you building?"
        aria-label="Your message"
        className={`${field} resize-none`}
      />

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] size-0"
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state.status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition hover:opacity-90 disabled:opacity-60"
        >
          {state.status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              <Send className="size-4" />
              Send message
            </>
          )}
        </button>

        {state.status === "error" && (
          <p className="text-sm text-accent">{state.message}</p>
        )}
      </div>
    </form>
  );
}
