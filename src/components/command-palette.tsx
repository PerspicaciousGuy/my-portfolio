"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  Check,
  Copy,
  FileText,
  Moon,
  Search,
  Sun,
  Terminal as TerminalIcon,
} from "lucide-react";
import { navLinks, projects, site, socials } from "@/data/site";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      if (href.startsWith("/#")) {
        // Same-page anchors: route home first if we're on another page.
        if (window.location.pathname !== "/") router.push(href);
        else
          document
            .querySelector(href.slice(1))
            ?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(href);
      }
    },
    [close, router],
  );

  const actions = useMemo<Action[]>(() => {
    const isDark = resolvedTheme === "dark";

    return [
      ...navLinks.map((l) => ({
        id: `nav-${l.href}`,
        label: l.label,
        group: "Go to",
        icon: ArrowRight,
        run: () => go(l.href),
      })),
      {
        id: "resume",
        label: "Résumé",
        hint: "view & download",
        group: "Go to",
        icon: FileText,
        run: () => go("/resume"),
      },
      ...projects.map((p) => ({
        id: `proj-${p.name}`,
        label: p.name,
        hint: p.blurb,
        group: "Projects",
        icon: ArrowRight,
        run: () => {
          close();
          window.open(p.repo, "_blank", "noopener");
        },
      })),
      {
        id: "copy-email",
        label: "Copy email address",
        hint: site.email,
        group: "Actions",
        icon: copied ? Check : Copy,
        run: () => {
          navigator.clipboard.writeText(site.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        },
      },
      {
        id: "theme",
        label: `Switch to ${isDark ? "light" : "dark"} theme`,
        group: "Actions",
        icon: isDark ? Sun : Moon,
        run: () => {
          setTheme(isDark ? "light" : "dark");
          close();
        },
      },
      {
        id: "terminal",
        label: "Open the terminal",
        hint: "or press `",
        group: "Actions",
        icon: TerminalIcon,
        run: () => {
          close();
          // The Terminal listens for a backtick keydown on window.
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "`", bubbles: true }),
          );
        },
      },
      ...socials
        .filter((s) => s.label !== "Email")
        .map((s) => ({
          id: `social-${s.label}`,
          label: s.label,
          hint: s.handle,
          group: "Elsewhere",
          icon: ArrowRight,
          run: () => {
            close();
            window.open(s.href, "_blank", "noopener");
          },
        })),
    ];
  }, [go, close, resolvedTheme, setTheme, copied]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      `${a.label} ${a.hint ?? ""} ${a.group}`.toLowerCase().includes(q),
    );
  }, [actions, query]);

  // Grouped, preserving result order.
  const groups = useMemo(() => {
    const map = new Map<string, Action[]>();
    for (const a of results) {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group)!.push(a);
    }
    return [...map.entries()];
  }, [results]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => setActive(0), [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    }
  }

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let index = -1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-full border border-border bg-bg-elevated/60 px-3 py-1.5 text-xs text-fg-subtle backdrop-blur transition hover:border-accent/50 hover:text-accent sm:inline-flex"
        aria-label="Open command palette"
      >
        <Search className="size-3.5" />
        <span>Search</span>
        <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ y: -18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -18, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="mt-[12vh] w-full max-w-lg overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-2xl"
              role="dialog"
              aria-label="Command palette"
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search className="size-4 shrink-0 text-fg-subtle" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search or jump to…"
                  aria-label="Search commands"
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-fg-subtle"
                />
                <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">
                  esc
                </kbd>
              </div>

              <ul ref={listRef} className="max-h-80 overflow-y-auto p-2">
                {results.length === 0 && (
                  <li className="px-3 py-8 text-center text-sm text-fg-subtle">
                    Nothing matches “{query}”.
                  </li>
                )}

                {groups.map(([group, items]) => (
                  <li key={group}>
                    <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
                      {group}
                    </p>
                    <ul>
                      {items.map((a) => {
                        index += 1;
                        const i = index;
                        const Icon = a.icon;
                        return (
                          <li key={a.id}>
                            <button
                              type="button"
                              data-active={i === active}
                              onMouseEnter={() => setActive(i)}
                              onClick={a.run}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                                i === active
                                  ? "bg-accent/10 text-accent"
                                  : "text-fg-muted"
                              }`}
                            >
                              <Icon className="size-4 shrink-0" />
                              {/* min-w-0 lets the label truncate instead of
                                  being squeezed out by a long hint. */}
                              <span className="shrink-0 whitespace-nowrap">
                                {a.label}
                              </span>
                              {a.hint && (
                                <span className="min-w-0 flex-1 truncate text-right font-mono text-[11px] text-fg-subtle">
                                  {a.hint}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
