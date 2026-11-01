/**
 * Single source of truth for all site content.
 * Edit this file to update the portfolio — no component changes needed.
 */
import type { SceneKind } from "@/lib/scene-art";

export const site = {
  name: "Harshit Bishnoi",
  shortName: "Harshit",
  role: "Full-Stack Developer",
  heroIntro: "Building beautiful interfaces and scalable backends.",
  tagline:
    "I build beautiful interfaces and scalable backends — production APIs, and the apps, dashboards and billing around them.",
  location: "Ganganagar, Rajasthan, India",
  email: "joy.0839b@gmail.com",
  url: "https://www.harshitbishnoi.dev",
  // ↑ The canonical host. Vercel redirects harshitbishnoi.dev to www, so this
  //   must stay www: the sitemap, canonical tags, og:url and schema.org markup
  //   all read it, and any of them pointing at a redirecting host is a mismatch.
  available: true,
} as const;

/**
 * Portrait shown in the About section, as a path under /public. Leave it null
 * until the art exists: the page then shows a labelled placeholder slot.
 */
export const portrait: string | null = null;

/** Homepage hero copy. */
export const hero = {
  greeting: "Hello, world!",
  status: "Open to work",
} as const;

/** When the first public repository went up; "years shipping" counts from here. */
export const shippingSince = "2023-08-10";

/** Tests on the ExerciseDB API, shown in the stats row. */
export const apiTestCount = 116;

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/harshitbishnoi", handle: "Harshit Bishnoi" },
  { label: "GitHub", href: "https://github.com/PerspicaciousGuy", handle: "@PerspicaciousGuy" },
  { label: "X", href: "https://x.com/obrakar", handle: "@obrakar" },
  { label: "Instagram", href: "https://instagram.com/perspicaciousguy", handle: "@perspicaciousguy" },
  { label: "Email", href: `mailto:${site.email}`, handle: site.email },
] as const;

export const about = {
  heading: "About",
  paragraphs: [
    "I'm a self-taught full-stack developer (BCA). I've spent the last three years shipping things — production-grade REST APIs, full-stack web apps, and automation bots that run in the wild.",
    "Most of what I build comes from wanting it to exist. A gym planner because I needed one. An exercise API because app developers had nothing decent to sync against. An open-source muscle map because I was building it anyway, so I made it public.",
    "When I'm not coding, I'm playing video games or working my way through a playlist. I'm currently open to work.",
  ],
} as const;

/**
 * The "Now" card. Keep this current — a stale now-card is worse than none.
 */
export const now = [
  {
    label: "Building",
    value: "ExerciseDB API — a public exercise catalog for fitness apps",
  },
  {
    label: "Learning",
    value: "Testing at scale, and getting properly good at Postgres",
  },
  {
    label: "Away from the keyboard",
    value: "Video games, and far too much music",
  },
] as const;

export type SkillGroup = {
  title: string;
  /** One line on what this actually means in practice — a tag cloud proves
   *  nothing on its own. */
  note: string;
  items: string[];
  /** Where on the site this skill is demonstrated. Evidence beats adjectives. */
  proof?: { label: string; href: string };
};

/**
 * The core stack: what I actually ship with, and where you can see it running.
 * Deliberately not a list of everything I've ever opened — that flattens the
 * things I'm good at into the things I've merely touched.
 */
export const skills: SkillGroup[] = [
  {
    title: "Backend & APIs",
    note: "Where I'm strongest. REST design, auth, validation at the boundary, rate limiting, versioned contracts.",
    items: [
      "Node.js",
      "Express",
      "REST APIs",
      "JWT & API keys",
      "Zod",
      "OpenAPI",
      "RFC 9457",
    ],
    proof: { label: "Run my API live", href: "/work/exercisedb-api" },
  },
  {
    title: "Data",
    note: "Schema design I'd defend, incremental sync, and the migrations I got wrong first.",
    items: ["PostgreSQL", "Supabase", "MongoDB", "Firebase"],
    proof: { label: "How the sync protocol works", href: "/work/exercisedb-api" },
  },
  {
    title: "Frontend",
    note: "Local-first apps that stay usable when the network isn't.",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Swift"],
    proof: { label: "Local-first, then sync", href: "/blog/local-first-then-sync" },
  },
  {
    title: "Testing & shipping",
    note: "Integration tests against real routes. 116 of them on the API alone.",
    items: ["Vitest", "Supertest", "Docker", "Git", "Vercel"],
    proof: {
      label: "Test the API, not the function",
      href: "/blog/test-the-api-not-the-function",
    },
  },
];

/** Everything else I've worked with. Honest, but not competing for attention. */
export const alsoUsed = [
  "Python",
  "SQL",
  "Vue",
  "Framer Motion",
  "Telegram API",
  "Heroku",
  "HTML",
  "CSS",
];

export type TimelineEntry = {
  period: string;
  title: string;
  org?: string;
  description: string;
  kind: "education" | "build" | "milestone";
};

/**
 * Honest timeline. Dates come from real GitHub history and education.
 * No fabricated employment.
 */
export const timeline: TimelineEntry[] = [
  {
    period: "From Aug 2023",
    title: "BCA, Bachelor of Computer Applications",
    description:
      "Three-year degree in computer applications, taken alongside a self-directed track of shipping real projects.",
    kind: "education",
  },
  {
    period: "Aug 2023",
    title: "Started writing code in public",
    description:
      "First public repository. Began teaching myself development in the open, one project at a time.",
    kind: "milestone",
  },
  {
    period: "2025",
    title: "Automation & bots",
    description:
      "Built Telegram bots and a URL shortener with Node, Express and MongoDB — my first taste of running services other people actually use.",
    kind: "build",
  },
  {
    period: "Early 2026",
    title: "Went deep on backend",
    description:
      "Shipped production REST APIs with JWT auth, PostgreSQL, validation, rate limiting and an OpenAPI spec. Learned what 'production-ready' actually costs.",
    kind: "build",
  },
  {
    period: "2026 — now",
    title: "Shipped a product, not just an API",
    description:
      "ExerciseDB went from a catalog to a metered API product: API keys and usage tiers, an incremental sync protocol, RFC 9457 errors, billing, a developer dashboard and a docs site. Live in production, 116 tests. That's where I learned the difference between writing an endpoint and running a service other people depend on.",
    kind: "milestone",
  },
];

export type Project = {
  name: string;
  /** Set this to publish a case study at /work/<slug>. It must match the
   *  filename of an MDX file in src/content/work/. Omit for repo-only links. */
  slug?: string;
  blurb: string;
  description: string;
  stack: string[];
  /** Omit for a private repository. */
  repo?: string;
  live?: string;
  /** Shown in place of the buttons when there is nothing public to open. */
  note?: string;
  /** Text of the live button when "Live" is not right, for example "Live docs". */
  liveLabel?: string;
  /** Pixel scene drawn on the card and the case study cover (src/lib/scene-art.ts). */
  art?: SceneKind;
  featured: boolean;
  /** The one project that leads the section, in a full-width card. Exactly one
   *  project should set this — if everything is emphasised, nothing is. */
  highlight?: boolean;
  /** Hard numbers for the lead card. Evidence beats adjectives. */
  metrics?: { label: string; value: string }[];
  year: string;
};

export const projects: Project[] = [
  {
    name: "Sessionbook",
    slug: "sessionbook",
    blurb: "A trading journal for forex and prop traders: it records every trade, totals your mistakes and setups, and ends each week with one action.",
    description:
      "A trading journal for forex and prop traders. Statements import from CSV with every row checked and reconciled before anything is saved. Trades carry R multiples, chart snapshots and a strategy checklist; results break down by setup, symbol, session, weekday and mistake; a weekly review puts the week's results next to the trades behind them. Strategies are versioned with adherence per rule, and backtesting studies sit beside live results. Journal data stays in the browser. A NestJS and Prisma API exists but the interface does not use it yet.",
    stack: ["Next.js", "React", "TypeScript", "Vitest", "Playwright", "NestJS", "Prisma"],
    live: "https://openzilla.vercel.app",
    art: "journal",
    highlight: true,
    metrics: [
      { label: "Data", value: "Stays in your browser" },
      { label: "Import", value: "CSV, every row reconciled" },
      { label: "Checks", value: "Vitest + Playwright" },
      { label: "Status", value: "Live" },
    ],
    featured: true,
    year: "2026",
  },
  {
    name: "ExerciseDB API",
    slug: "exercisedb-api",
    art: "api",
    blurb: "A metered, production API product — catalog, incremental sync, API keys, billing, dashboard and docs.",
    description:
      "A public exercise catalog client apps can sync and cache offline. Beyond the endpoints: API-key auth with usage tiers and rate limiting, an incremental sync protocol with tombstones, RFC 9457 errors, Lemon Squeezy billing, a developer dashboard and a docs site. The catalog holds 221 exercises across eight movement patterns, with a graph layer for variations, progressions and equipment-aware substitutes, plus a typed SDK and client examples in five languages. 116 tests. You can run real requests against it from the case study.",
    stack: ["Node.js", "Express", "PostgreSQL", "Supabase", "Zod", "Vitest", "OpenAPI", "Vue"],
    repo: "https://github.com/PerspicaciousGuy/exercises-api",
    live: "https://docs.harshitbishnoi.dev",
    liveLabel: "Live docs",
    featured: true,
    year: "2026",
  },
  {
    name: "GymPlanner",
    slug: "gymplanner",
    art: "gym",
    blurb: "A full fitness planner with AM/PM scheduling, nutrition tracking, and cloud sync.",
    description:
      "Workout scheduling, exercise logging, nutrition and health tracking, with local-first persistence and optional Firebase sync. Wrapped in a 'Liquid Glass' interface I designed to feel like a premium mobile app.",
    stack: ["React", "Vite", "JavaScript", "Firebase", "Tailwind CSS"],
    repo: "https://github.com/PerspicaciousGuy/GymPlanner",
    live: "https://gym-planner-green.vercel.app",
    featured: true,
    year: "2026",
  },
  {
    name: "Open Muscle Map",
    art: "muscle",
    blurb: "An open-source, tappable front and rear muscle map: SVG art, JSON data and a small JavaScript controller.",
    description:
      "I was building a muscle map for my own project, so I made it open source. Front and rear views for male and female bodies, 112 named panels covering 32 muscles or muscle groups, heatmap colouring and keyboard-accessible selection. Schematic rather than a dissection-grade atlas. MIT licensed.",
    stack: ["SVG", "JSON", "JavaScript"],
    repo: "https://github.com/PerspicaciousGuy/Open-Muscle-Map",
    live: "https://perspicaciousguy.github.io/Open-Muscle-Map/",
    featured: true,
    year: "2026",
  },
  {
    name: "FitTrack",
    blurb: "A native iOS workout logger and plan coach, written in SwiftUI.",
    description:
      "A SwiftUI app for logging workouts set by set and following a training plan. Five tabs, row-based set logging, a home-screen widget and Live Activity, a shared design-system palette, unit tests in Swift Testing and UI tests that record screenshot tours. Builds against the newest iOS SDK with an iOS 18 deployment target. Working name: Strive.",
    stack: ["Swift", "SwiftUI", "WidgetKit", "Swift Testing"],
    art: "ios",
    note: "In development · private repository",
    featured: true,
    year: "2026",
  },
  {
    name: "Gleam",
    blurb: "A fast, local file and app launcher for Windows: press Alt+Space, type, press Enter.",
    description:
      "Searches file, folder, app and Start Menu names, including Microsoft Store apps, from a local SQLite index. Rust and Tauri 2 with a React front end, slash commands and recent searches. Its own code makes no network requests. Early 0.x release with a Windows installer, tested on Windows 11.",
    stack: ["Rust", "Tauri 2", "React", "TypeScript", "SQLite"],
    repo: "https://github.com/PerspicaciousGuy/SpotlightSearch",
    featured: false,
    year: "2026",
  },
  {
    name: "Quiet Library",
    slug: "quiet-library",
    art: "library",
    blurb: "A PWA audiobook player that streams from your own Google Drive — and keeps playing offline.",
    description:
      "Streams audiobook files straight from a user's Google Drive through an authenticated bounded-Range proxy, without ever copying them to app storage. Versioned progress sync with atomic stale-write rejection, an offline-first PWA (service worker, OPFS/Cache downloads via Dexie, airplane-mode playback), Media Session controls, RLS-backed Supabase, and RFC 9457 errors behind CSP/HSTS.",
    stack: ["Next.js", "TypeScript", "Supabase", "Dexie", "PWA", "Web Audio", "Zod"],
    repo: "https://github.com/PerspicaciousGuy/audiobooks-player",
    live: "https://greasy-bethanne-ebooks-0926d76e.koyeb.app",
    featured: false,
    year: "2026",
  },
  {
    name: "Exercise Library API",
    blurb: "A REST API with JWT auth, ownership checks, and user-authored content.",
    description:
      "Register/login/me endpoints, exercise CRUD with ownership enforcement, category and muscle-group management, plus search, filtering and pagination. Hardened with helmet, CORS, and rate-limited auth routes.",
    stack: ["Node.js", "Express", "PostgreSQL", "JWT", "bcrypt"],
    repo: "https://github.com/PerspicaciousGuy/gymlogger_backend",
    featured: false,
    year: "2026",
  },
  {
    name: "Forex News Bot",
    blurb: "A Telegram bot tracking the four global Forex sessions with precision alerts.",
    description:
      "Monitors the Sydney, Tokyo, London and New York sessions, firing 30-minute warnings, 5-minute prep pings, and open/close/overlap alerts so traders can time their day.",
    stack: ["Python", "Telegram API", "Scheduling"],
    repo: "https://github.com/PerspicaciousGuy/Forex-News-Bot",
    featured: false,
    year: "2026",
  },
  {
    name: "URL Shortener",
    blurb: "A custom link shortener with an interstitial page and click tracking.",
    description:
      "Shorten-URL API with a timed interstitial page for monetization and basic click analytics. Built on Node, Express and MongoDB.",
    stack: ["Node.js", "Express", "MongoDB"],
    repo: "https://github.com/PerspicaciousGuy/Shortener",
    featured: false,
    year: "2025",
  },
  {
    name: "Filtering Bot",
    blurb: "A Dockerized Python bot with payment integration.",
    description:
      "A containerized Telegram bot with a database layer and integrated payment flow, deployable straight to Heroku.",
    stack: ["Python", "Docker", "Payments"],
    repo: "https://github.com/PerspicaciousGuy/filtering-bot",
    featured: false,
    year: "2026",
  },
  {
    name: "Telegram Link Bot",
    blurb: "A lightweight Python bot for link handling.",
    description: "A small utility bot built on the Telegram API.",
    stack: ["Python", "Telegram API"],
    repo: "https://github.com/PerspicaciousGuy/telegram-link-bot",
    featured: false,
    year: "2025",
  },
];

/** The lead project, shown full-width above the grid. */
export const highlightProject = projects.find((p) => p.highlight);
/** Featured, minus the lead — these fill the grid beneath it. */
export const featuredProjects = projects.filter((p) => p.featured && !p.highlight);
export const otherProjects = projects.filter((p) => !p.featured);
/** Everything featured, lead first. A CV has no "hero card" — it just needs
 *  the best work listed, in order. */
export const resumeProjects = projects.filter((p) => p.featured);

export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Work", href: "/#work" },
  { label: "Writing", href: "/#writing" },
  { label: "Contact", href: "/#contact" },
] as const;
