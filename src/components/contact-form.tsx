"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { site } from "@/data/site";

type State =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

const field =
  "w-full border-4 border-border bg-slot px-3.5 py-2.5 text-lg outline-none placeholder:text-fg-muted focus:border-accent";

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

  // Hold the card's height on success. Collapsing to a one-line stub leaves a
  // hole where the form was and makes the whole section look broken.
  if (state.status === "sent") {
    return (
      <div className="flex min-h-[17rem] flex-col items-center justify-center gap-3 text-center">
        <span className="grid size-11 place-items-center border-4 border-accent">
          <Check className="size-5 text-accent" />
        </span>
        <p className="font-display text-xl font-bold uppercase">Sent. I&apos;ll get back to you.</p>
        <p className="max-w-xs text-fg-muted">
          Usually within a day or two. If it&apos;s urgent, {site.email} reaches
          me faster.
        </p>
        <button
          type="button"
          onClick={() => setState({ status: "idle" })}
          className="mt-2 min-h-11 text-fg-muted underline underline-offset-4 hover:text-accent"
        >
          Send another
        </button>
      </div>
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
          className="px-btn px-btn-primary cursor-pointer disabled:opacity-60"
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
          <p className="text-accent">{state.message}</p>
        )}
      </div>
    </form>
  );
}
