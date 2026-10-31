## Project Overview
Personal Next.js portfolio, redesigned as a pixel-art night city with an interactive mascot. Designed first on a Claude Design canvas, then built here.

## Current State
Homepage is rebuilt in the pixel design (hero with typed roles and the critter's ground line, live strip, stats, about, skills, work, journey, writing, GitHub activity skyline, contact, and a footer that ends on a street). Shared pieces live in the root layout: backdrop, nav, sparks, command palette and cheats. The 404 is a playable game. Inner pages (work, blog, résumé) inherit the new tokens, fonts and square corners but have not been redrawn.

## Last Action
Built the redesign in phases: tokens/fonts/theme, backdrop and sprite libs, critter brain and walker, homepage sections, extras (sparks, palette, cheats, 404), docs.

## In Progress
None.

## Pending
- Mobile layout (desktop-first by decision): the pixel design on narrow screens is not designed yet.
- Case study, blog and résumé pages are not redrawn.
- Art the user will generate: portrait (`portrait` in src/data/site.ts), project thumbnails (`preview` per project), favicon, Open Graph image.
- Performance pass against the earlier Lighthouse audit (mobile LCP).
- Remove framer-motion if the blog's table of contents and filters are rebuilt without it.

## Known Issues
Activity section needs `GITHUB_TOKEN`; without it the section and its number are skipped. The live strip's latest commit comes from the public events API and is omitted when it is unavailable.

## Files Status
- Created: src/components/pixel/*, src/lib/{theme,use-theme,theme-script,weather,pixel-events,critter-sprite,critter-brain,car-sprite,hash}.ts, src/data/skyline.ts, src/styles/{backdrop,road}.css, src/app/not-found.tsx, new homepage sections.
- Removed: Geist and next-themes, terminal, cursor, loader, scroll progress, old command palette, heatmap.
- Untouched: content (MDX), API routes, data in src/data/site.ts apart from the portrait field and nav order.
