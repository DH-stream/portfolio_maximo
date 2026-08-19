# Portfolio Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing static portfolio into a cohesive, responsive Swedish portfolio landing page with captured project imagery, accessible project modals, and restrained neon motion.

**Architecture:** Keep the current GitHub Pages-compatible static HTML/CSS/JavaScript approach. `index.html` owns the page structure, `assets/projects/` owns local project screenshots/placeholders, and one `PROJECTS` data array drives both project tiles and the modal. Existing `cv.html` stays as the CV destination; `projects.html` remains untouched except for no longer being the primary project route.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, local PNG/SVG assets, GitHub Pages static hosting, Playwright CLI for rendered verification.

## Global Constraints

- Use the existing dark cyan/lilac visual language; do not redesign into a different style.
- Keep the hero stable and non-streaming; reveal effects begin below the hero.
- Show exactly A-kod Automation, Click Notes, Hem-Listan, Budgetly, and Visual Code Editor; do not show Fillguard or old placeholder projects.
- Use 390×844 mobile screenshots for web apps when available and a desktop screenshot for Visual Code Editor.
- Keep A-kod Automation anonymous and replaceable via `assets/projects/a-kod-automation.png`.
- Do not add a framework, backend, build step, or new runtime dependency.
- Preserve accessible keyboard navigation, visible focus, reduced-motion behavior, and mobile responsiveness.

---

### Task 1: Add stable project image assets

**Files:**
- Create: `assets/projects/budgetly-mobile.png`
- Create: `assets/projects/hem-listan-mobile.png`
- Create: `assets/projects/visual-code-editor.png`
- Create: `assets/projects/click-notes.png`
- Create: `assets/projects/a-kod-automation-placeholder.svg`

**Interfaces:**
- Produces stable relative paths consumed by the `PROJECTS` array in `index.html`.

- [ ] **Step 1: Copy the already captured Budgetly, Hem-Listan, and Visual Code Editor screenshots into `assets/projects/` with the exact filenames above.**

- [ ] **Step 2: Capture the Click Notes extension surface at a readable size and save it as `assets/projects/click-notes.png`.** The image must show the actual Click Notes popup or notes workflow, not a generic icon-only placeholder.

- [ ] **Step 3: Create `a-kod-automation-placeholder.svg` as a neutral dark anonymous panel with a small cyan image icon and the text “Bild läggs till senare”. Keep it generic and free of customer/company identifiers.**

- [ ] **Step 4: Verify each asset exists and is readable.**

Run:

```powershell
Get-ChildItem assets/projects
```

Expected: five files with non-zero size, including the SVG placeholder.

- [ ] **Step 5: Commit the asset-only change.**

```powershell
git add assets/projects
git commit -m "assets: add portfolio project screenshots"
```

### Task 2: Replace the terminal-first landing page with the portfolio structure

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes the five local image paths from Task 1.
- Produces the visible hero, about, project grid, and contact sections.

- [ ] **Step 1: Write a smoke-check script before changing page markup.** Create a temporary script outside the repo that loads `index.html` through a local static server and asserts the desired `Se mina projekt` button, four section anchors, five project names, and the project modal are present. Run it once to establish the expected RED state, then remove the temporary script after the implementation.

- [ ] **Step 2: Replace the current terminal-first `<main>` and inline styling with semantic sections using these anchors: `#home`, `#about`, `#projects`, and `#contact`. Keep the existing LinkedIn, e-mail, GitHub, and CV destinations.

- [ ] **Step 3: Add a single `PROJECTS` array with exact fields `id`, `name`, `description`, `tags`, `image`, `imageAlt`, `problem`, `howItWorks`, `status`, and optional `href`. Use concise Swedish copy based on the linked project repositories and do not invent customer claims or metrics.

- [ ] **Step 4: Render every project tile from `PROJECTS`. Each tile must be a keyboard-focusable button-like article with an image frame, title, description, tags, and an “Öppna projekt” cue. Use `loading="lazy"` for cards below the fold.

- [ ] **Step 5: Add the responsive navigation and CTA buttons. Desktop navigation remains horizontal; mobile navigation opens a small menu with links to Om mig, Projekt, Kontakt, and CV.

- [ ] **Step 6: Add CSS tokens, glass surfaces, cyan/lilac glows, depth shadows, card tilt variables, and responsive breakpoints while preserving a clear professional reading hierarchy.

- [ ] **Step 7: Run the smoke-check again and confirm the new hero, five project names, and contact anchors are present.**

### Task 3: Add reveal motion, project tilt, and connected modals

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes the DOM rendered from `PROJECTS` in Task 2.
- Produces `openProject(projectId)`, `closeProject()`, and keyboard/backdrop behavior used by project tiles and the modal.

- [ ] **Step 1: Add a native `<dialog id="project-modal">` with title, image, problem, how-it-works, status, tags, optional GitHub link, and a labeled close button.**

- [ ] **Step 2: Implement `openProject(projectId)` to populate the modal from the matching project, remember the triggering tile, call `showModal()` when supported, add the active class, lock body scrolling, and focus the close button.**

- [ ] **Step 3: Implement `closeProject()` for the close button, Escape, dialog cancel, and backdrop click. Restore body scrolling and focus to the originating tile.

- [ ] **Step 4: Add a small pointer tilt handler guarded by `(pointer: fine)`. Clamp rotation to ±4 degrees and reset on pointer leave. Do not use tilt on touch screens.

- [ ] **Step 5: Add Intersection Observer reveal classes with per-card waterfall delay. Ensure all reveal elements are visible by default when JavaScript is unavailable and fully visible under `prefers-reduced-motion: reduce`.

- [ ] **Step 6: Run a rendered interaction smoke test: load page, click a project tile, assert modal copy matches the selected project, press Escape, assert modal closes, then activate a second tile with keyboard focus.

- [ ] **Step 7: Commit the page and interaction implementation.**

```powershell
git add index.html
git commit -m "feat: rebuild portfolio landing page"
```

### Task 4: Verify responsive layout and finish the branch

**Files:**
- Modify: `README.md` only if the new asset replacement instruction needs to be documented.
- Remove: temporary `.playwright-cli/` artifacts before handoff.

**Interfaces:**
- Verifies the static page and all user-facing interactions from Tasks 1–3.

- [ ] **Step 1: Serve the portfolio locally.**

```powershell
python -m http.server 4173
```

- [ ] **Step 2: Verify desktop 1440×900.** Confirm hero hierarchy, no terminal-first content, project grid, contact section, image loading, and absence of Fillguard/old placeholder names.

- [ ] **Step 3: Verify mobile 390×844.** Confirm the mobile menu, no horizontal overflow, readable tile images, modal fit, CTA wrapping, and fixed navigation behavior.

- [ ] **Step 4: Verify reduced motion with the browser media setting.** Confirm content stays visible and no card tilt/reveal transform causes clipping.

- [ ] **Step 5: Run `git diff --check` and inspect `git status`.** Remove only generated QA artifacts and leave unrelated user files untouched.

- [ ] **Step 6: Run final smoke checks and record any remaining intentional deviations before using the finishing-a-development-branch skill.**
