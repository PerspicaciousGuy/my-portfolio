"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { site, socials } from "@/data/site";
import { onAnchorClick } from "@/lib/scroll-to";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center px-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-5xl"
      >
        {site.available && (
          <motion.div variants={item} className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated/50 px-3 py-1.5 font-mono text-xs text-fg-muted backdrop-blur">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              Available for work
            </span>
          </motion.div>
        )}

        <motion.h1
          variants={item}
          className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl"
        >
          {site.name}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-pretty text-lg text-fg-muted sm:text-xl"
        >
          <span className="text-fg">{site.role}</span> based in {site.location}.{" "}
          {site.tagline}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            onClick={onAnchorClick}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition hover:opacity-90"
          >
            See my work
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href="#contact"
            onClick={onAnchorClick}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated/50 px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:border-accent/50 hover:text-accent"
          >
            Get in touch
            <ArrowUpRight className="size-4" />
          </a>
          <a
            href="/resume"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium text-fg-muted transition hover:text-accent"
          >
            <FileText className="size-4" />
            Résumé
          </a>
        </motion.div>

        <motion.ul variants={item} className="mt-14 flex flex-wrap gap-x-6 gap-y-2">
          {socials
            .filter((s) => s.label !== "Email")
            .map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-fg-subtle transition hover:text-accent"
                >
                  {s.label.toLowerCase()} ↗
                </a>
              </li>
            ))}
        </motion.ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
      >
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-fg-subtle"
        >
          scroll
        </motion.span>
      </motion.div>
    </section>
  );
}
