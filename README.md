# Joe Baltazar — portfolio

My portfolio site: a home page and three case studies (Good Code POS, Overwatch, XStreamr). I designed it in Figma and built it with Next.js 15 (App Router), TypeScript and CSS Modules, with no UI or animation libraries. Every page is static.

**Worth a look in the code:**

- **Scroll-driven motion from one listener.** `components/Chrome.tsx` writes two CSS variables on scroll, and the CSS does the rest: the pinned portrait zoom, parallax, and the nav that hides on scroll. Scroll progress never goes through React state, so scrolling causes no re-renders, and updates are batched with `requestAnimationFrame`.
- **Reduced motion as a separate layout.** With `prefers-reduced-motion`, scroll-linked transforms are removed and the pinned hero splits into two plain sections, not just shorter animations.
- **Content as typed data.** All copy lives in `src/content/`. Case studies are objects in `stories.ts` that are rendered by one `Story` component, so adding one means adding data, not markup.

Code samples for the patterns in the case studies are in separate repos, rebuilt from scratch with fake data. No client code is published here or there:

- [uncertain-payments](https://github.com/thejoebltzr/uncertain-payments): the Good Code "uncertain is not declined" card-payment recovery, as a tested state machine.
- [fire-exposure](https://github.com/thejoebltzr/fire-exposure) ([live demo](https://thejoebltzr.github.io/fire-exposure/)): Overwatch's forecast-keyed risk queries and map markers that never hide a policy.
- [build-time-brands](https://github.com/thejoebltzr/build-time-brands): XStreamr's build-time brand resolution in Metro, with a CI gate against cross-brand leaks.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build, includes lint and type checks
pnpm start
```

## Edit content

All copy lives in `src/content/site.ts`. In serif headings, `[text]` marks the italic span.

Three links stay hidden until you add their URLs to `site`:

- `linkedinUrl`, `githubUrl`: shown in the Contact section
- `resumeUrl`: the "Download résumé" link in About. Put the PDF in `public/` and set it to, for example, `/Joe-Baltazar-Resume.pdf`.

## Motion (from the Figma "Scroll & motion spec")

| Spec | Where |
|---|---|
| Nav: active pill slides between chapters, nav hides on scroll down and returns on scroll up | `components/Chrome.tsx` |
| Progress rail: one dash per chapter, active dash 12 → 28px, click to jump | `components/Chrome.tsx` |
| 01 → 02 zoom-out: portrait pinned and scaled from the close-up to the full figure, ink → studio grey, copy swaps | `components/HeroAbout.*` |
| 02 callouts: leader line draws, then the number counts up | `HeroAbout.module.css`, `components/CountUp.tsx` |
| 03 Fig. 1 parallax (about 0.85× scroll); capability rows rise 40px and fade | `Sections.module.css` (`.fig`), `globals.css` (`[data-reveal]`) |
| 04 tiles scale 0.96 → 1; device screen drifts about 24px more than the desktop screen | `Sections.module.css` (`.tile`, `.screenPhone`) |
| 08 portrait detail crop scales 1.0 → 1.06 | `Sections.module.css` (`.contactImage`) |
| `prefers-reduced-motion`: scroll-linked transforms are removed, and hero and About become two plain sections | all of the above |

One scroll listener in `Chrome.tsx` writes CSS variables: `--p` on the pinned section and `--sp` on `[data-sp]` elements. The CSS does the rest. Below 1024px the hero and About stack, as in the mobile Figma frame.

## Deploy

On Vercel, import the repo and set the root directory to `site/` if the repo includes the parent folder. No environment variables are required. You can set `NEXT_PUBLIC_SITE_URL` to the final domain so social previews use absolute URLs; on Vercel, the production domain is detected automatically.

From the CLI: `vercel` (preview) or `vercel --prod`.

## Story pages

`/work/good-code`, `/work/overwatch` and `/work/xstreamr` are pre-rendered from `src/content/stories.ts`, following the Figma "Story — … (1440)" frames and their 390 versions. Each story sets its own accent, deep and tile colours. Its chapters are listed as data: stakes, chapter (big stat, results, problem/decision columns, state flow, figures), gallery and lessons. All of them render through `src/components/story/Story.tsx`. To add a story, add an object to `stories` and a tile to `work.tiles` in `site.ts`.
