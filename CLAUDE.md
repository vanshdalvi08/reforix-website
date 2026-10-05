# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

This project runs **Next.js 16.2.7** (App Router), which is newer than most training data covers. Before using an API you're not certain about, check `node_modules/next/dist/docs/` rather than assuming older-Next.js conventions apply.

## Commands

Run all commands from `reforix-website/` (the Next.js app; the sibling `Python/` folder is unrelated scratch code, not part of this project).

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (flat config via eslint.config.mjs)
```

There is no test suite configured in this repo.

## Architecture

**Stack:** Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion + lucide-react icons.

**Routing** (`src/app/`): `/` is a single long-scroll marketing page assembled from section components; `/services` and `/careers` are separate routed pages that each render one standalone section component under a shared `Navbar`. Section components double as both in-page anchors (`#about`, `#projects`, `#contact`, referenced by `Navbar`'s `NAV_LINKS`) and, for Services/Careers, full routes — keep both usages in mind when renaming a section's `id`.

**Component organization** (`src/components/`): one folder per section (`navbar/`, `hero/`, `identity/`, `experience/`, `projects/`, `contact/`, `services/`, `careers/`, `stats/`, `footer/`, `ui/`), each holding a single PascalCase component file. Several folders (`about/`, `footer/`) currently contain only a `.gitkeep` — not yet built. Note `src/app/page.tsx` does not import every existing component (e.g. `StatsBar` exists but isn't wired into the homepage) — check `page.tsx` before assuming a component is live.

**Homepage (`/`) — the scroll-driven landing page:** `src/app/page.tsx` renders only components from `src/components/landing/`, wrapped in `<main className="rx">`. It does not use Tailwind or the older section components (`hero/`, `identity/`, `experience/`, `projects/`, `contact/`, `stats/`), which are now unused on `/` but kept; `/services` and `/careers` still use `Navbar`, `Services`, `Careers` and `Footer`.
- Styles: `src/app/landing.css`, one nested block scoped under `.rx` so nothing leaks into other routes. Its tokens (`--accent`, `--bone`, pipe-service colours `--c-proc`, `--c-stm`, …) live on `.rx`. Phone breakpoint is 820px and must match `isNarrow()` in `landing/motion.ts`.
- Fonts: Bebas Neue and JetBrains Mono are loaded in `layout.tsx` as `--font-bebas` / `--font-jbmono`.
- Motion uses **anime.js v4** (`animate`, `createTimeline`, `onScroll`, `svg.createDrawable`), not Framer Motion. Every effect returns a cleanup that reverts its animations, and checks `prefersReducedMotion()`.
- `landing/plantScene.ts` builds the three.js plant (plain three, not react-three-fiber). One anime.js timeline scrubbed by scroll through the `.stage` element drives a state object `S`; the draw loop reads `S`. Layers, explode offsets, clash points and camera keyframes are all defined in that file. The canvas is `position: fixed` and stays behind the whole page.
- `Preloader` locks scroll, plays the logo intro, then calls `markIntroDone()`; `PlantHero` waits for that before animating the first headline.
- The drawings in the projects gallery (`landing/drawings.ts`) and its clash table are illustrative samples, and both forms only show a message. Each is marked with a TODO.

**Styling — Tailwind v4, CSS-first config:** there is no `tailwind.config.ts`. Theme tokens (colors, fonts, animations) are defined directly in `src/app/globals.css` via `@theme`. Design tokens:
- Colors: `background` #0a0a0a, `surface` #111111, `surface2` #1a1a1a, `accent` #E87722 (industrial orange), `gold` #C0922A, `muted` #A0A0A0
- Reusable utility classes: `.section-padding` (standard section gutter), `.orange-glow`, `.text-gradient` (orange→gold), `.no-scrollbar`
- Animation tokens: `--animate-fade-up`, `--animate-fade-in`, `--animate-glow-pulse`

**Client components:** interactive/animated components (scroll tracking, Framer Motion, hooks) are marked `"use client"` — this includes `Navbar`, `StatsBar`, and similar. Scroll-triggered entrance animations follow a consistent pattern: `useInView` (`once: true`) driving a Framer Motion `variants` object with `staggerChildren`, e.g. `src/components/stats/StatsBar.tsx`. Custom hooks live in `src/components/ui/` (e.g. `useCountUp`).

**Styling convention in components:** a mix of Tailwind utility classes and inline `style={{...}}` is used for values that are dynamic/state-dependent (e.g. `Navbar`'s scrolled vs. transparent state), while static styling stays in Tailwind classes.

**`Prompt`** (repo root of `reforix-website/`) is the original phase-by-phase build spec used to scaffold this site — useful as a reference for intended design/copy, but the live components have since diverged from it in places (e.g. section renamed from "About" to `IdentitySection`, an added `Experience` section not in the original spec, Services/Careers promoted from homepage sections to standalone routes). Treat code as the source of truth over `Prompt` when they disagree.
