# Harshit Bishnoi — Portfolio

Personal portfolio site: a one-page homepage, case studies, a blog, and a
printable résumé.

**Live:** _not deployed yet_

## Stack

- **Next.js 16** (App Router, Turbopack) and **React 19**
- **TypeScript**
- **Tailwind CSS v4** (CSS-first tokens in `src/app/globals.css`)
- **Framer Motion** for animation
- **next-themes** for dark and light
- **MDX** content via `next-mdx-remote` and `gray-matter`
- **Vercel Analytics** and **Speed Insights**

## Routes

| Route | What it is |
| --- | --- |
| `/` | Homepage: hero, stats, about, skills, journey, work, writing, contact |
| `/work/[slug]` | Case studies, from `src/content/work/*.mdx` |
| `/blog`, `/blog/[slug]` | Writing, from `src/content/posts/*.mdx` |
| `/resume` | Printable résumé |
| `/api/contact` | Contact form, sends mail through Resend |
| `/api/playground` | Proxy for the live ExerciseDB API console |

Sitemap, robots and the Open Graph image are generated in `src/app`.

## Editing content

- **Site copy** (bio, links, skills, timeline, projects) is typed data in
  [`src/data/site.ts`](src/data/site.ts). Edit that file and every section
  updates.
- **Case studies** and **posts** are MDX files with frontmatter in
  `src/content/work` and `src/content/posts`.
- **Playground requests** are listed in `src/data/playground.ts`.

## Environment variables

All are optional. Features that need a missing variable switch themselves off
rather than failing.

| Variable | Used for | Without it |
| --- | --- | --- |
| `LASTFM_API_KEY`, `LASTFM_USERNAME` | Now-playing card | Card is not shown |
| `GITHUB_TOKEN` | Contribution heatmap and GitHub stats | Heatmap is not rendered |
| `RESEND_API_KEY` | Contact form delivery | Form cannot send |
| `CONTACT_FROM` | Sender address for contact mail | Falls back to `Portfolio <onboarding@resend.dev>` |
| `EXERCISEDB_DEMO_KEY` | API playground (kept server-side) | Playground requests fail |

Put them in `.env.local` for local development.

## Navigation and motion

- The header has a keyboard-accessible Menu disclosure below the `lg`
  breakpoint, with section links, Writing and Résumé. Escape, an outside click,
  or moving focus outside closes it.
- The About grid constrains long Last.fm track titles so they truncate inside
  the card on narrow screens.
- The custom cursor and the loading screen are skipped for touch devices and
  for `prefers-reduced-motion`. In-page anchor scrolling is animated by
  `src/lib/scroll-to.ts`, with a shorter duration for reduced motion.
- Remote images: Last.fm album art is allowed in `next.config.ts`.

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build   # production build
```

## Structure

```
src/
  app/                 routes, API handlers, global styles
  components/
    sections/          hero, stats, about, skills, journey, work, writing, contact
    ui/                reveal, section primitives
  content/
    posts/             blog posts (MDX)
    work/              case studies (MDX)
  data/                site.ts (all copy), playground.ts
  lib/                 posts, case studies, GitHub, Last.fm, scroll and hooks
```
