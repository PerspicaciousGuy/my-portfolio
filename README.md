# Harshit Bishnoi — Portfolio

Personal portfolio site. Built with Next.js, Three.js and Framer Motion.

**Live:** _not deployed yet_

## The idea

A persistent WebGL particle cloud sits behind the whole page and morphs as you
scroll: a humanoid figure in the hero (a nod to
[Open-Muscle-Map](https://github.com/PerspicaciousGuy/Open-Muscle-Map)), a
constellation over the skills grid, a dispersed starfield behind the work, and
a convergent pulse at the contact section.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4** (CSS-first tokens)
- **React Three Fiber** + **drei** + **three**
- **Framer Motion**
- **next-themes** — dark and light

## Graceful degradation

The 3D scene is a progressive enhancement, never a requirement:

- `src/lib/use-capability.ts` checks WebGL support, CPU cores, device memory,
  pointer type and `prefers-reduced-motion`.
- Below threshold → a static CSS gradient backdrop renders instead, and
  `three` is never even downloaded (the scene is a `dynamic()` import).
- The render loop pauses when the tab is hidden; DPR is capped at 1.6.

## Editing content

**All copy lives in [`src/data/site.ts`](src/data/site.ts).** Bio, links,
skills, timeline and projects are typed data — edit that one file and every
section updates. No component changes needed.

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Structure

```
src/
  app/                 layout, page, global tokens
  components/
    sections/          hero, about, skills, journey, work, contact
    three/             particle-field (the morph), scene (canvas host)
    ui/                reveal, section primitives
    backdrop.tsx       picks WebGL scene vs. static fallback
  data/site.ts         ← all content
  lib/use-capability.ts
```
