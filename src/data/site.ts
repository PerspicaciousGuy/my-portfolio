/**
 * Single source of truth for all site content.
 * Edit this file to update the portfolio — no component changes needed.
 */

export const site = {
  name: "Harshit Bishnoi",
  shortName: "Harshit",
  role: "Full-Stack Developer",
  tagline: "I build APIs, apps, and bots that do something useful.",
  location: "Ganganagar, Rajasthan, India",
  email: "joy.0839b@gmail.com",
  url: "https://harshitbishnoi.dev",
  // ↑ Used by the OG image, sitemap and schema.org markup. Must match the
  //   deployed domain or none of the SEO resolves.
  available: true,
} as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/PerspicaciousGuy", handle: "@PerspicaciousGuy" },
  { label: "X", href: "https://x.com/obrakar", handle: "@obrakar" },
  { label: "Instagram", href: "https://instagram.com/perspicaciousguy", handle: "@perspicaciousguy" },
  { label: "Email", href: `mailto:${site.email}`, handle: site.email },
] as const;

export const about = {
  heading: "About",
  paragraphs: [
    "I'm a self-taught full-stack developer finishing my BCA in August 2026. I've spent the last three years shipping things — production-grade REST APIs, full-stack web apps, and automation bots that run in the wild.",
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
    label: "Wrapping up",
    value: "My BCA — final semester, graduating August 2026",
  },
  {
    label: "Away from the keyboard",
    value: "Video games, and far too much music",
  },
] as const;

export type SkillGroup = {
  title: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "HTML", "CSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "REST APIs", "JWT Auth", "Zod", "OpenAPI"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Vite", "Framer Motion"],
  },
  {
    title: "Data & Infra",
    items: ["PostgreSQL", "Supabase", "MongoDB", "Firebase", "Docker"],
  },
  {
    title: "Testing & Tools",
    items: ["Vitest", "Supertest", "Git", "Vercel", "Heroku"],
  },
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
    period: "Aug 2023 — Aug 2026",
    title: "BCA, Bachelor of Computer Applications",
    org: "Graduating August 2026",
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
      "Shipped two production-grade REST APIs with JWT auth, PostgreSQL, validation, rate limiting and an OpenAPI spec. Learned what 'production-ready' really means.",
    kind: "build",
  },
  {
    period: "2026 — now",
    title: "Full-stack & open source",
    description:
      "Built GymPlanner end to end, and open-sourced a detailed human muscle map for anyone building fitness software.",
    kind: "build",
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
  repo: string;
  live?: string;
  /** Path under /public — shown on hover. Capture from the live deploy. */
  preview?: string;
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
    name: "ExerciseDB API",
    slug: "exercisedb-api",
    blurb: "A metered, production API product — catalog, incremental sync, API keys, billing, dashboard and docs.",
    description:
      "A public exercise catalog client apps can sync and cache offline. Beyond the endpoints: API-key auth with usage tiers and rate limiting, an incremental sync protocol with tombstones, RFC 9457 errors, Lemon Squeezy billing, a developer dashboard and a docs site. 116 tests. You can run real requests against it from the case study.",
    stack: ["Node.js", "Express", "PostgreSQL", "Supabase", "Zod", "Vitest", "OpenAPI", "Vue"],
    repo: "https://github.com/PerspicaciousGuy/exercises-api",
    live: "https://docs.harshitbishnoi.dev",
    featured: true,
    highlight: true,
    metrics: [
      { label: "Tests", value: "116" },
      { label: "Errors", value: "RFC 9457" },
      { label: "Auth", value: "API keys + tiers" },
      { label: "Status", value: "Live in production" },
    ],
    year: "2026",
  },
  {
    name: "GymPlanner",
    slug: "gymplanner",
    blurb: "A full fitness planner with AM/PM scheduling, nutrition tracking, and cloud sync.",
    description:
      "Workout scheduling, exercise logging, nutrition and health tracking, with local-first persistence and optional Firebase sync. Wrapped in a 'Liquid Glass' interface I designed to feel like a premium mobile app.",
    stack: ["React", "Vite", "JavaScript", "Firebase", "Tailwind CSS"],
    repo: "https://github.com/PerspicaciousGuy/GymPlanner",
    live: "https://gym-planner-green.vercel.app",
    preview: "/previews/gymplanner.png",
    featured: true,
    year: "2026",
  },
  {
    name: "Exercise Library API",
    blurb: "A REST API with JWT auth, ownership checks, and user-authored content.",
    description:
      "Register/login/me endpoints, exercise CRUD with ownership enforcement, category and muscle-group management, plus search, filtering and pagination. Hardened with helmet, CORS, and rate-limited auth routes.",
    stack: ["Node.js", "Express", "PostgreSQL", "JWT", "bcrypt"],
    repo: "https://github.com/PerspicaciousGuy/gymlogger_backend",
    featured: true,
    year: "2026",
  },
  {
    name: "Open Muscle Map",
    blurb: "An open-source, anatomically detailed human muscle map.",
    description:
      "I was building a complete muscle map for my own project, so I made it open source. Detailed, correctly-mapped anatomy that anyone building fitness software can use however they want.",
    stack: ["Open Source", "Dataset", "Anatomy"],
    repo: "https://github.com/PerspicaciousGuy/Open-Muscle-Map",
    featured: true,
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

export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Journey", href: "/#journey" },
  { label: "Work", href: "/#work" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "/#contact" },
] as const;
