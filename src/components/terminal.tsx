"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site, socials, projects, skills } from "@/data/site";

type Line = { kind: "in" | "out"; text: string };

const BANNER = [
  `${site.name} — ${site.role}`,
  `Type 'help' for commands. Esc or 'exit' to close.`,
];

function run(raw: string): string[] {
  const [cmd, ...args] = raw.trim().split(/\s+/);

  switch (cmd.toLowerCase()) {
    case "":
      return [];

    case "help":
      return [
        "whoami      who you're talking to",
        "about       the short version",
        "skills      what I work with",
        "projects    what I've shipped",
        "contact     how to reach me",
        "socials     where to find me",
        "open <n>    open the nth project on GitHub",
        "clear       clear the screen",
        "exit        close the terminal",
      ];

    case "whoami":
      return [`${site.name} · ${site.role} · ${site.location}`];

    case "about":
      return [
        "Self-taught full-stack dev, BCA finishing Aug 2026.",
        "Three years of shipping: REST APIs, web apps, automation bots.",
        "Most of it built because I wanted it to exist.",
      ];

    case "skills":
      return skills.map((g) => `${g.title.padEnd(16)} ${g.items.join(", ")}`);

    case "projects":
      return projects.map(
        (p, i) => `[${i + 1}] ${p.name.padEnd(22)} ${p.blurb}`,
      );

    case "open": {
      const i = Number(args[0]) - 1;
      const p = projects[i];
      if (!p) return [`no project ${args[0] ?? ""} — try 'projects'`];
      window.open(p.repo, "_blank", "noopener");
      return [`opening ${p.name}…`];
    }

    case "contact":
      return [site.email, "(it's the fastest way to reach me)"];

    case "socials":
      return socials.map((s) => `${s.label.padEnd(12)} ${s.href}`);

    case "sudo":
      return ["nice try."];

    case "ls":
      return projects.map((p) => p.name.toLowerCase().replace(/\s+/g, "-"));

    default:
      return [`${cmd}: command not found. try 'help'`];
  }
}

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(
    BANNER.map((t) => ({ kind: "out" as const, text: t })),
  );
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;

      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines, open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const input = value;
    setValue("");
    setHistory((h) => [input, ...h]);
    setHIndex(-1);

    if (input.trim().toLowerCase() === "clear") {
      setLines([]);
      return;
    }
    if (input.trim().toLowerCase() === "exit") {
      setOpen(false);
      return;
    }

    setLines((l) => [
      ...l,
      { kind: "in", text: input },
      ...run(input).map((text) => ({ kind: "out" as const, text })),
    ]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Up/down walk the command history, like a real shell.
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(hIndex + 1, history.length - 1);
      if (history[i] !== undefined) {
        setHIndex(i);
        setValue(history[i]);
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIndex - 1;
      setHIndex(i);
      setValue(i >= 0 ? (history[i] ?? "") : "");
    }
  }

  return (
    <>
      {/* Discoverability: without a hint, nobody ever finds the easter egg. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full border border-border bg-bg-elevated/70 px-3.5 py-2 font-mono text-xs text-fg-subtle backdrop-blur transition hover:border-accent/50 hover:text-accent lg:inline-flex"
      >
        <span className="text-accent">$</span>
        press
        <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">
          `
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: -24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -24, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="mt-[6vh] flex h-[min(30rem,70vh)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-2xl"
              role="dialog"
              aria-label="Terminal"
            >
              <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 font-mono text-xs text-fg-subtle">
                  {site.shortName.toLowerCase()}@portfolio — zsh
                </span>
              </div>

              <div
                className="flex-1 overflow-y-auto p-4 font-mono text-sm"
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((l, i) => (
                  <p
                    key={i}
                    className={`whitespace-pre-wrap ${
                      l.kind === "in" ? "text-fg" : "text-fg-muted"
                    }`}
                  >
                    {l.kind === "in" && <span className="text-accent">❯ </span>}
                    {l.text}
                  </p>
                ))}

                <form onSubmit={submit} className="mt-1 flex items-center gap-2">
                  <span className="text-accent">❯</span>
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="Terminal input"
                    className="flex-1 bg-transparent text-fg caret-accent outline-none"
                  />
                </form>
                <div ref={bottomRef} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
