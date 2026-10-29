# Rudra Sharma — Portfolio

React + TypeScript + Three.js portfolio. Single-page site at `/`, CV at `/cv`.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the built site
npm run typecheck  # tsc --noEmit
```

## Editing content

**All copy lives in `src/data/*.json`.** No text is hard-coded in a component, so
updating the site means editing JSON — never JSX.

| File | Holds |
|---|---|
| `profile.json` | Name, role, contact details, headline, about copy, photo paths |
| `stats.json` | The four figures in the hero strip |
| `projects.json` | Project cards and their detail dialogs |
| `experience.json` | The experience accordion |
| `skills.json` | Skill groups and their tags |
| `education.json` | Degree and institution |
| `achievements.json` | Highlights, certifications, the About chips |
| `sections.json` | Each section's index, eyebrow, heading and description |
| `navigation.json`, `socials.json`, `seo.json` | Nav links, social links, meta tags |

Every file has a matching interface in `src/types/content.ts`. Rename a field in
one without the other and `npm run typecheck` fails before the page can break.
Components read everything through the typed barrel at `src/content/index.ts`.

### Adding a project

Append an object to `projects.json`. The work grid is `auto-fit`, so a third card
reflows without touching any component. `art` picks the CSS thumbnail —
`services`, `realtime` or `ai`. Add a `repo` field and the GitHub link appears
on the card and in its dialog.

## Photos

`public/photos/` holds web-optimised JPEGs generated from the originals, which
are kept in `reference/photos/` (2.3 MB → 236 KB; the 2 MB PNG would have been
the heaviest asset on the site). To swap in a new photo, drop it in, update the
`src`, `width` and `height` in `profile.json`, and aim the crop with
`position` — a CSS `object-position` value, since both source photos are 9:16
and get cropped to 4:5 and 1:1. Photos are rendered with no filter or blend
mode; if a file is ever missing, the slot falls back to a neutral placeholder
rather than a broken image.

## Still to add

- **Project links** — `projects.json` has no `repo` or `live` URLs yet; the CV
  marked both projects as live but didn't include addresses.
- **Social URLs** — `socials.json` guesses `github.com/rudrasharma` and
  `linkedin.com/in/rudrasharma`. Correct them if those aren't your handles.
- **`public/og-image.png`** — 1200×630 preview image for link unfurls.

## Structure

```
src/
  data/         JSON content          types/     interfaces for that content
  content/      typed barrel          context/   global motion switch
  hooks/        reveal, viewport, active section, toast, clipboard
  components/
    ui/         content-agnostic primitives (Button, Tag, Reveal, Modal, Photo…)
    layout/     Header, MobileNav, Footer, PageShell
    three/      the hero WebGL scene — no app content
    sections/   one per page band, reads content, composes ui/
  pages/        Home, CV, NotFound — route composition only
reference/      the original HTML prototype, kept for design reference
```

## The hero scene

`src/components/three/` draws ~2,000 points joined by lines, morphing between a
torus knot (**Mesh** — services calling services), a sphere (**Cluster** —
scaled instances) and a helix (**Stream** — an event log). Shapes are generated
in `shapes.ts`; the morph itself runs in a vertex shader (`shaders.ts`), so the
per-frame cost is on the GPU.

It's deliberately defensive: the chunk is lazy-loaded so the headline paints
first, the render loop idles when the hero scrolls out of view or motion is off,
and `SceneFallback.tsx` renders a static SVG when WebGL is unavailable. The site
is fully usable with the scene never loading at all.

## Accessibility

- `prefers-reduced-motion` is honoured on load; the footer toggle overrides it
  either way. Scroll reveals render content immediately when motion is off.
- The project dialog traps focus, restores it on close, and closes on Esc or a
  backdrop click.
- Experience uses native `<details>`, so it works on Enter/Space.
- The canvas is `aria-hidden`; its meaning sits in the visible captions.

## License

The code in this repository — components, hooks, the 3D scene, build config,
and the overall structure — is licensed under the [MIT License](LICENSE). Use
it, fork it, strip it down for your own portfolio, whatever's useful; the only
requirement is keeping the copyright notice.

### Personal content

The **MIT license covers the code, not the content it renders.** Rudra
Sharma's name, photos, résumé (`public/Rudra_Sharma.pdf`), bio copy, and
project/employment history in `src/data/*.json` are personal information, not
open-source material — don't publish a copy of this site with that content
still in it. If you're using this as a template:

1. Replace every file in `src/data/` with your own information (each has a
   matching type in `src/types/content.ts`, so `npm run typecheck` will catch
   anything you miss).
2. Swap the photos in `public/photos/` and the résumé in `public/`.
3. Update `profile.json`'s `monogram`, `brand`, and `website`, and the meta
   tags in `index.html`.

A contribution to *this* repository (a bug fix, an accessibility
improvement, a genuine feature) is welcome and falls under the MIT license
above like any other code change here — see the
[Code of Conduct](CODE_OF_CONDUCT.md) for how we expect people to treat each
other while doing that.
