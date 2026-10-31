## Project Overview
Personal Next.js portfolio, redesigned as a pixel-art night city with an interactive mascot. Designed first on a Claude Design canvas, then built here.

## Current State
The homepage sections were re-checked against the Main board and rebuilt from its markup (hero, stats, skills, work, journey, writing). Stats come from site data, not GitHub.
Homepage is rebuilt in the pixel design (hero with typed roles and the critter's ground line, live strip, stats, about, skills, work, journey, writing, GitHub activity skyline, contact, and a footer that ends on a street). Shared pieces live in the root layout: backdrop, nav, sparks, command palette and cheats. The 404 is a playable game. Case studies (quest log), the blog index (cartridge shelf), posts (reader mode) and the résumé (paper sheet) are built from the canvas options the user picked. The user confirmed résumé B.

## Last Action
Built the redesign in phases: tokens/fonts/theme, backdrop and sprite libs, critter brain and walker, homepage sections, extras (sparks, palette, cheats, 404), docs.

## In Progress
None.

## Pending
- Mobile layout (desktop-first by decision): the pixel design on narrow screens is not designed yet.
- Confirm the résumé style (B, the paper sheet, was assumed).
- Art the user will generate: portrait (`portrait` in src/data/site.ts), project thumbnails (`preview` per project), Open Graph image (src/app/opengraph-image.tsx is still the old non-pixel card).
- Performance pass against the earlier Lighthouse audit (mobile LCP).

## Known Issues
Favicon is the critter head (src/app/icon.svg, favicon.ico, apple-icon.png). The skyline scales building heights to the 90th percentile of active weeks so one huge week does not flatten the rest, and phones show the latest 26 weeks. Activity section needs `GITHUB_TOKEN`; without it the section and its number are skipped. The live strip's latest commit comes from the public events API and is omitted when it is unavailable.

## Files Status
- Created: src/components/pixel/*, src/lib/{theme,use-theme,theme-script,weather,pixel-events,critter-sprite,critter-brain,car-sprite,hash}.ts, src/data/skyline.ts, src/styles/{backdrop,road}.css, src/app/not-found.tsx, new homepage sections.
- Removed: Geist, next-themes, framer-motion, lucide-react, terminal, cursor, loader, scroll progress, old command palette, heatmap, mobile nav, Last.fm now-playing, contact form and /api/contact, old table of contents, post list, figure and API playground (replaced by pixel versions).
- Untouched: content (MDX), API routes, data in src/data/site.ts apart from the portrait field and nav order.
