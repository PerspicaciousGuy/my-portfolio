## Project Overview
Personal Next.js portfolio, redesigned as a pixel-art night city with an interactive mascot. Designed first on a Claude Design canvas, then built here.

## Current State
The homepage sections were re-checked against the Main board and rebuilt from its markup (hero, stats, skills, work, writing). Stats come from site data, not GitHub.
Homepage is rebuilt in the pixel design (hero with typed roles and the critter's ground line, live strip, stats, about, skills, work, writing, GitHub activity skyline, contact, and a footer that ends on a street). Shared pieces live in the root layout: backdrop, nav, sparks, command palette and cheats. The 404 is a playable game. Case studies (quest log), the blog index (cartridge shelf), posts (reader mode) and the résumé (paper sheet) are built from the canvas options the user picked. The user confirmed résumé B. The homepage Journey section was removed (the résumé still prints the timeline). Sessionbook (live at openzilla.vercel.app) is the lead card, ExerciseDB API is a regular card, Quiet Library moved to More builds (its case study page still exists), and FitTrack is a private-repo card with no buttons. The grid has five cards, so the last one sits alone in its row.

## Last Action
Built the redesign in phases: tokens/fonts/theme, backdrop and sprite libs, critter brain and walker, homepage sections, extras (sparks, palette, cheats, 404), docs.

## In Progress
None.

## Pending
- Mobile layout, first pass done for the homepage (canvas board "Mobile 390: menu button, open menu, city dimmed"): below 768px the nav is one 60px row (logo, weather, theme, MENU) and the links and résumé live in a pixel sheet (src/components/mobile-menu.tsx: closes on link, scrim, Escape or widening the window; locks page scroll while open); the toggle labels are hidden on phones; stats are a 2x2 grid; the three skyline layers drop to 40% opacity under 768px (src/styles/backdrop.css); long links in case-study prose wrap. Still to do on phones: the inner pages (case study, blog, post, résumé) and a check of the sky objects, which can sit behind the hero name.
- Confirm the résumé style (B, the paper sheet, was assumed).
- Art: the five project covers and the case-study cover are pixel scenes drawn in code (`art` per project in src/data/site.ts, drawn in src/lib/scene-art.ts). Each scene has a night and a day palette (`composeScene(kind, theme)`); SceneArt renders both and the `dark` class on <html> shows one, so the cards follow the theme. The share cards use the night version. The About portrait is an animated night desk (src/lib/desk-scene.ts, CSS animation in globals.css); a `portrait` image in src/data/site.ts would replace it. Link previews: every page has a 1200x630 Open Graph card in the same pixel style, drawn by src/lib/share-card.tsx (homepage card, blog post card with date and reading time, case study card with the project cover). The routes are opengraph-image.tsx in app/, app/blog, app/blog/[slug], app/work/[slug] and app/resume; they are prerendered at build. Fonts for the card are bundled in src/assets/fonts (Pixelify Sans, VT323, both OFL, WOFF because the renderer cannot read WOFF2). A new page with its own title and description needs its own opengraph-image.tsx, or its og:image is dropped.
- Performance pass against the earlier Lighthouse audit (mobile LCP).

## Known Issues
Favicon is the critter head (src/app/icon.svg, favicon.ico, apple-icon.png). The skyline scales building heights to the 90th percentile of active weeks so one huge week does not flatten the rest, and phones show the latest 26 weeks. Activity section needs `GITHUB_TOKEN`; without it the section and its number are skipped. The live strip's latest commit comes from the public events API and is omitted when it is unavailable.

## Files Status
- Created: src/components/pixel/*, src/lib/{theme,use-theme,theme-script,weather,pixel-events,critter-sprite,critter-brain,car-sprite,hash}.ts, src/data/skyline.ts, src/styles/{backdrop,road}.css, src/app/not-found.tsx, new homepage sections.
- Removed: Geist, next-themes, framer-motion, lucide-react, terminal, cursor, loader, scroll progress, old command palette, heatmap, old mobile nav (replaced by the MENU sheet), Last.fm now-playing, contact form and /api/contact, old table of contents, post list, figure and API playground (replaced by pixel versions).
- Untouched: content (MDX), API routes, data in src/data/site.ts apart from the portrait field and nav order.
