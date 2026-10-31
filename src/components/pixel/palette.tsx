"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { emit, type CheatName } from "@/lib/pixel-events";
import { site } from "@/data/site";

/**
 * Cheats and a command palette in one component.
 *   Konami code (up up down down left right left right B A) -> party
 *   typed words anywhere on the page: party, ufo, rain, lights, critter
 *   "/" or Ctrl/Cmd+K opens the palette: arrows move, Enter runs, Esc closes
 * Every cheat is announced to the rest of the page with a px-cheat event.
 */
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const WORDS: Record<string, CheatName> = { party: "party", critter: "party", ufo: "ufo", rain: "rain", lights: "lights" };

type Command = {
  label: string;
  hint: string;
  run: (ctx: { go: (href: string) => void; fire: (name: CheatName, msg: string) => void; say: (msg: string) => void }) => void;
};

const COMMANDS: Command[] = [
  ...(["about", "skills", "work", "journey", "writing", "contact"] as const).map(
    (id): Command => ({
      label: `Go to ${id[0].toUpperCase()}${id.slice(1)}`,
      hint: "section",
      run: ({ go }) => go(id === "writing" ? "/blog" : `/#${id}`),
    }),
  ),
  { label: "Open the résumé", hint: "page", run: ({ go }) => go("/resume") },
  { label: "Toggle the city lights", hint: "cheat", run: ({ fire }) => fire("lights", "Lights toggled") },
  { label: "Make it rain", hint: "cheat", run: ({ fire }) => fire("rain", "Rain for 25 seconds") },
  { label: "Call the UFO", hint: "cheat", run: ({ fire }) => fire("ufo", "Incoming") },
  { label: "Party mode", hint: "cheat", run: ({ fire }) => fire("party", "Party mode") },
  {
    label: "Copy email address",
    hint: "action",
    run: ({ say }) => {
      navigator.clipboard
        .writeText(site.email)
        .then(() => say("Email copied"))
        .catch(() => say(site.email));
    },
  },
  { label: "Show the Konami code", hint: "hint", run: ({ say }) => say("Up Up Down Down Left Right Left Right B A") },
];

export function Palette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const toastTimer = useRef(0);

  const say = useCallback((msg: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = window.setTimeout(() => setToast(""), 2800);
  }, []);
  const fire = useCallback(
    (name: CheatName, msg: string) => {
      emit("px-cheat", { name });
      say(msg);
    },
    [say],
  );
  const go = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  const items = COMMANDS.filter((c) => !query.trim() || c.label.toLowerCase().includes(query.trim().toLowerCase()));
  const active = Math.min(sel, Math.max(0, items.length - 1));

  const close = useCallback(() => {
    setOpen(false);
    opener.current?.focus();
  }, []);
  const run = (c: Command) => {
    close();
    c.run({ go, fire, say });
  };

  useEffect(() => {
    let keys: string[] = [];
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        opener.current = document.activeElement as HTMLElement | null;
        setQuery("");
        setSel(0);
        setOpen(true);
        return;
      }
      if (typing || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "/") {
        e.preventDefault();
        opener.current = document.activeElement as HTMLElement | null;
        setQuery("");
        setSel(0);
        setOpen(true);
        return;
      }
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keys.push(k);
      if (keys.length > KONAMI.length) keys.shift();
      if (keys.join(",") === KONAMI.join(",")) {
        keys = [];
        fire("party", "+30 lives: party mode");
        return;
      }
      if (e.key.length === 1) {
        typed = (typed + k).slice(-8);
        for (const w of Object.keys(WORDS)) {
          if (typed.endsWith(w)) {
            typed = "";
            fire(WORDS[w], `Cheat: ${w}`);
            break;
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(toastTimer.current);
    };
  }, [fire]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          opener.current = e.currentTarget;
          setQuery("");
          setSel(0);
          setOpen(true);
        }}
        aria-label="Open the command palette"
        className="px-label fixed bottom-4 right-4 z-[8] hidden min-h-11 cursor-pointer items-center gap-2 border-0 bg-raised px-3.5 py-2 font-semibold text-fg shadow-[0_0_0_3px_rgb(var(--edge)),4px_6px_0_rgb(var(--shade))] hover:shadow-[0_0_0_3px_rgb(var(--accent)),4px_6px_0_rgb(var(--shade))] sm:inline-flex print:hidden"
      >
        <kbd className="bg-edge px-1.5 text-[18px] leading-tight text-fg">/</kbd> commands
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="fixed inset-0 z-10 flex items-start justify-center bg-black/60 px-4 pt-[12vh]"
          onClick={close}
        >
          <div
            className="w-[min(620px,92vw)] bg-panel shadow-[0_0_0_4px_rgb(var(--accent)),8px_12px_0_rgb(var(--shade))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 border-b-4 border-raised px-3.5 py-3">
              <span className="font-display text-xl font-bold text-accent">&gt;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSel(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault();
                    close();
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSel(items.length ? (active + 1) % items.length : 0);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSel(items.length ? (active + items.length - 1) % items.length : 0);
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (items[active]) run(items[active]);
                  }
                }}
                placeholder="type a command: work, rain, lights, ufo, party"
                aria-label="Command"
                autoComplete="off"
                spellCheck={false}
                className="min-h-9 min-w-0 flex-1 bg-transparent text-2xl text-fg outline-none placeholder:text-fg-muted"
              />
              <span className="px-label text-[12px]">esc</span>
            </div>
            <ul role="listbox" aria-label="Commands" className="m-0 max-h-[48vh] list-none overflow-auto p-0">
              {items.map((c, i) => (
                <li key={c.label} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onClick={() => run(c)}
                    className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 px-3.5 py-2.5 text-left text-[22px] text-fg ${i === active ? "bg-raised" : ""}`}
                  >
                    <span>{c.label}</span>
                    <span className="px-label text-[12px]">{c.hint}</span>
                  </button>
                </li>
              ))}
              {items.length === 0 && (
                <li className="px-3.5 py-4 text-[22px] text-fg-muted">No match. Some commands are not listed. Try the Konami code.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="px-label fixed bottom-7 left-1/2 z-[11] -translate-x-1/2 whitespace-nowrap bg-[#ECECF0] px-4 py-2.5 text-base font-semibold text-[#131418] shadow-[4px_4px_0_#07080B]"
        >
          {toast}
        </div>
      )}
    </>
  );
}
