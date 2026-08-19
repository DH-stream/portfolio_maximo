# Portfolio refresh design

## Goal

Replace the current terminal-first portfolio landing page with one cohesive, recruiter-friendly dark portfolio experience for Max Kristoffersson. The visual language remains dark, cyan/lilac, technical, and glass/neon-inspired, but the hero and project content become the primary experience.

## Scope

The portfolio remains a static GitHub Pages site. The implementation is intentionally limited to the existing HTML/CSS/JavaScript stack and does not add a framework or build step.

The page will show these projects, in this order:

1. A-kod Automation
2. Click Notes
3. Hem-Listan
4. Budgetly (IPA-builder)
5. Visual Code Editor

Fillguard and the old placeholder projects are removed from the visible portfolio.

## Page structure

`index.html` becomes the primary one-page experience with four connected regions:

- Hero: Max Kristoffersson, the requested transport/logistics/process/automation tagline, short intro, “Se mina projekt”, and “Ladda ner CV”. No typewriter or streaming effect is used above the fold.
- Om mig: compact Swedish copy about logistics, process improvement, and practical automation. Elements reveal as they enter the viewport.
- Projekt: a responsive tile grid. Each tile contains a real application screenshot where available, project name, short description, and a small technology/status label. Cards use depth, hover tilt, and sequential reveal.
- Kontakt: clickable LinkedIn, e-mail, and GitHub cards in the same visual system.

The existing `cv.html` remains the CV destination. `projects.html` remains available as a compatibility page but is no longer linked as the primary project experience.

## Project assets

Project screenshots are stored in `assets/projects/` and referenced with stable relative paths so GitHub Pages can serve them without remote image dependencies:

- `budgetly-mobile.png`: captured from the public Budgetly landing page at 390×844.
- `hem-listan-mobile.png`: captured from the public Hem-Listan app at 390×844.
- `visual-code-editor.png`: captured from the latest `origin/main` Visual Code Editor app at desktop size.
- `click-notes.png`: captured from the Click Notes extension surface.
- `a-kod-automation-placeholder.svg`: neutral anonymous placeholder, intentionally easy to replace with `a-kod-automation.png` later.

If a project screenshot is not available, the tile uses the neutral placeholder treatment rather than a broken image. A short comment in the project data identifies the replacement filename for the A-kod image.

## Component/data boundaries

The page remains static, but repeated project content is defined in one JavaScript `PROJECTS` array. Each item has `id`, `name`, `description`, `tags`, `image`, `imageAlt`, `problem`, `howItWorks`, `status`, and optional `href`. The grid and modal are rendered from this data so modal copy and tile copy cannot drift.

The modal is a native `<dialog>` when supported, with a fallback class-based overlay. Opening a tile records the triggering card, fills the modal from the project data, locks page scrolling, and animates the modal from the tile's approximate position. Escape, backdrop click, and the close button restore focus to the originating card.

## Motion and accessibility

- Intersection Observer adds `.is-visible` to sections and project cards with a capped waterfall delay.
- Cards apply a small pointer-driven `rotateX`/`rotateY` effect only on fine pointers; touch devices keep a stable layout.
- `prefers-reduced-motion: reduce` disables tilt, floating background motion, and reveal transforms while keeping content visible.
- All project cards are keyboard-focusable buttons, modal controls have accessible labels, and the dialog has a visible focus ring.
- The navigation includes a compact mobile menu without changing the desktop layout.

## Visual tokens

- Background: near-black blue-charcoal with subtle cyan/lilac radial glows.
- Text: warm white, cool muted gray, and cyan for primary emphasis.
- Accents: cyan `#00d1ff`, pale cyan `#a4e6ff`, lilac `#f5d0ff`, green `#36ffc4`.
- Surfaces: translucent charcoal glass with restrained borders and shadows.
- Typography: Geist/Inter for readable portfolio copy and JetBrains Mono for small technical labels.

## Acceptance criteria

- Hero is the first rendered meaningful content and contains no streamed text.
- User can jump from the hero to projects and CV.
- Exactly the five named projects above are visible; Fillguard and old placeholder projects are absent.
- Tiles use the captured mobile or desktop screenshots and the A-kod tile has a replaceable anonymous image slot.
- Clicking a tile opens a visually connected modal with project name, image, problem, how it works, current status, and relevant links.
- Scroll reveal/waterfall, hover tilt, reduced-motion, modal close behavior, keyboard focus, desktop layout, and 390px mobile layout are verified.
- Static files continue to work when opened through GitHub Pages or a local static server.
