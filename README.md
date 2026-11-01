# Harshit Bishnoi — Portfolio

Personal portfolio site: a one-page homepage, case studies, a blog, and a
printable résumé.

**Live:** _not deployed yet_

## Stack

- **Next.js 16** (App Router, Turbopack) and **React 19**
- **TypeScript**
- **Tailwind CSS v4** (CSS-first tokens in `src/app/globals.css`)
- **Pixel design system**: Pixelify Sans and VT323 through `next/font`, hard
  edges and block shadows, no rounded corners
- **MDX** content via `next-mdx-remote` and `gray-matter`
- **Vercel Analytics** and **Speed Insights**

## Routes

| Route | What it is |
| --- | --- |
| `/` | Homepage: hero, live strip, stats, about, skills, work, writing, activity, contact |
| `/work/[slug]` | Case studies as a quest log, from `src/content/work/*.mdx` |
| `/blog`, `/blog/[slug]` | Writing as a shelf of cartridges and a reader mode, from `src/content/posts/*.mdx` |
| `/resume` | Résumé as a paper sheet; only the sheet prints |
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
| `GITHUB_TOKEN` | Contribution calendar (the Activity skyline) and higher API rate limits | The Activity section is not rendered |
| `EXERCISEDB_DEMO_KEY` | API playground (kept server-side) | Playground requests fail |

Put them in `.env.local` for local development.

## The pixel world

The page is a night city that reacts to the visitor. Everything is original
pixel art drawn in code (no image files), and every moving part owns its own
timers and listeners.

- **Theme:** night (default), auto (follows the visitor's clock) and day, from
  `src/lib/theme.ts` and `use-theme.ts`. An inline script sets the `dark`
  class before first paint.
- **Backdrop** (`components/pixel/backdrop.tsx`, `styles/backdrop.css`): sky,
  sun or moon, clouds, four parallax skylines, planes, birds, a rare UFO and
  rain. Parallax and window lighting run on CSS variables written from a
  requestAnimationFrame loop that only runs while something moves. Windows,
  the moon, planes, birds and the UFO are clickable.
- **Critter:** the sprite is pixel rows in `src/lib/critter-sprite.ts`; the
  hero critter's behaviour is a plain state machine in
  `src/lib/critter-brain.ts`. Card critters sit on project cards and have a
  job (laptop, coffee, catching rain).
- **Road:** the footer ends on a street (`components/pixel/road.tsx`): two rows
  of buildings, lamps and cars that honk when clicked.
- **Cheats:** the Konami code, the words `party`, `ufo`, `rain`, `lights`, or
  the command palette (`/` or Ctrl+K). They fire `px-cheat` window events; see
  `src/lib/pixel-events.ts`.
- **404** is a playable runner game.
- **Inner pages:** case studies split the MDX at each `##` into numbered
  chapters (`lib/chapters.ts`); a markdown quote (`>`) renders as the critter's
  speech bubble; `<Playground />` is the handheld API console.
- **Reduced motion:** timers do not start, the sky stays still, and the first
  typed role is rendered in full. Timers also pause off screen and in
  background tabs.

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
    sections/          hero, now-strip, stats, about, skills, work,
                       writing, activity, contact
    pixel/             backdrop, critter, walker, card critter, road, palette,
                       sparks, git city, 404 game
    ui/                reveal, section primitives
  content/
    posts/             blog posts (MDX)
    work/              case studies (MDX)
  data/                site.ts (all copy), playground.ts
  lib/                 posts, case studies, GitHub, theme, weather,
                       pixel events, critter sprite and brain
  styles/              backdrop.css, road.css
```
