# Portfolio Depth Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fluid, depth-rich vertical reel to the existing static portfolio so sections tilt linearly away from a flat centre focus and settle there with a soft snap.

**Architecture:** Keep the existing single-file HTML architecture. Add a shared reel class to the four major sections, use CSS custom properties for the transform state, animate background fields with decorative pseudo-elements, and update reel transforms in one passive scroll-driven `requestAnimationFrame` loop. Use `scroll-snap-type: y proximity` plus a debounced settle step rather than forcing every scroll event into a snap.

**Tech Stack:** Static HTML, inline CSS, vanilla JavaScript, browser-native `requestAnimationFrame`, `scrollend` fallback, CSS 3D transforms, and `prefers-reduced-motion`.

## Global Constraints

- Preserve project order: A-kod Automation, Click Notes, Hem-Listan, Budgetly, Visual Code Editor.
- Fillguard remains excluded.
- Keep project tiles rectangular with three desktop columns, two tablet columns, and one mobile column.
- The hero must render immediately and must not stream its text.
- Keep A-kod Automation anonymous and preserve its documented image replacement slot.
- Keep modal content, keyboard focus handling, mobile navigation, contact links, and CV link working.
- No new dependencies or framework migration.
- Reduced-motion mode removes tilt, scale, blur, translateZ, background drift, smooth scrolling, and automatic snap while preserving content and interactions.

---

### Task 1: Add the shared reel structure and fluid background layers

**Files:**
- Modify: `index.html` in the root style block and the four main section elements.
- Test: static assertions in this task.

**Interfaces:**
- Consumes: existing `.page-shell`, `.section`, `#home`, `#about`, `#projects`, and `#contact` markup.
- Produces: four elements with class `reel-section`, shared CSS variables `--reel-tilt`, `--reel-depth`, `--reel-scale`, and `--reel-opacity`.

- [ ] **Step 1: Add a shared perspective and animated background layer.**

Add the following rules near `.page-shell` and `.section` without changing the existing colour tokens:

```css
html { scroll-behavior: smooth; scroll-snap-type: y proximity; }

body::before,
body::after,
.page-shell::after {
  position: fixed;
  z-index: -2;
  width: 58vw;
  height: 58vw;
  border-radius: 50%;
  content: "";
  filter: blur(92px);
  opacity: 0.18;
  pointer-events: none;
  will-change: transform;
}

body::before { animation: fluid-cyan 18s ease-in-out infinite alternate; }
body::after { animation: fluid-lilac 23s ease-in-out infinite alternate; }
.page-shell::after {
  right: 20vw;
  bottom: -36vw;
  background: var(--mint);
  animation: fluid-mint 27s ease-in-out infinite alternate;
}

@keyframes fluid-cyan { to { transform: translate(16vw, 12vh) scale(1.16); } }
@keyframes fluid-lilac { to { transform: translate(-14vw, -10vh) scale(0.9); } }
@keyframes fluid-mint { to { transform: translate(12vw, -14vh) scale(1.22); } }

main {
  perspective: 1100px;
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
}

.reel-section {
  position: relative;
  scroll-snap-align: center;
  scroll-snap-stop: normal;
  transform: perspective(1100px) rotateX(var(--reel-tilt, 0deg)) translateZ(var(--reel-depth, 0px)) scale(var(--reel-scale, 1));
  transform-origin: 50% 50%;
  opacity: var(--reel-opacity, 1);
  will-change: transform, opacity;
}

.reel-section::before {
  position: absolute;
  z-index: -1;
  inset: 9% 7%;
  background: radial-gradient(ellipse, rgba(0, 209, 255, 0.07), transparent 68%);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.24);
  content: "";
  pointer-events: none;
}
```

- [ ] **Step 2: Add reduced-motion overrides immediately after the new motion rules.**

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; scroll-snap-type: none; }
  body::before, body::after, .page-shell::after { animation: none; }
  .reel-section {
    transform: none;
    opacity: 1;
    will-change: auto;
  }
}
```

- [ ] **Step 3: Mark the four major sections as reel sections.**

Change only the class attributes:

```html
<section class="hero reel-section" id="home">
<section class="section reveal reel-section" id="about">
<section class="section reel-section" id="projects">
<section class="section reveal reel-section" id="contact">
```

- [ ] **Step 4: Run the static structure check.**

Run:

```powershell
$html = Get-Content -Raw index.html
if (($html | Select-String -AllMatches 'reel-section').Matches.Count -lt 4) { throw 'Expected four reel sections' }
if (-not $html.Contains('scroll-snap-type: y proximity')) { throw 'Soft snap missing' }
if (-not $html.Contains('@keyframes fluid-cyan')) { throw 'Fluid background missing' }
Write-Output 'Reel structure assertions passed'
```

Expected: `Reel structure assertions passed`.

- [ ] **Step 5: Commit the structure and background layer.**

```powershell
git add index.html
git commit -m "feat: add portfolio reel structure and fluid background"
```

### Task 2: Implement linear centre-based 3D scroll geometry

**Files:**
- Modify: `index.html` in the existing script block after `renderProjects()` and before modal event wiring.
- Test: temporary Playwright smoke script outside the repository.

**Interfaces:**
- Consumes: `.reel-section` elements and the `prefers-reduced-motion` media query.
- Produces: `updateReelDepth()`, `scheduleReelDepthUpdate()`, and `settleReel()` functions with passive scroll handling.

- [ ] **Step 1: Add the centre-distance transform calculation.**

```js
const reelSections = [...document.querySelectorAll(".reel-section")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let reelFrame = 0;
let settleTimer;

function updateReelDepth() {
  reelFrame = 0;
  if (reducedMotion.matches) {
    reelSections.forEach((section) => {
      section.style.removeProperty("--reel-tilt");
      section.style.removeProperty("--reel-depth");
      section.style.removeProperty("--reel-scale");
      section.style.removeProperty("--reel-opacity");
    });
    return;
  }

  const viewportCenter = window.innerHeight / 2;
  const focusRange = Math.max(window.innerHeight * 0.72, 480);

  reelSections.forEach((section) => {
    const bounds = section.getBoundingClientRect();
    const distance = bounds.top + bounds.height / 2 - viewportCenter;
    const normalized = Math.max(-1, Math.min(1, distance / focusRange));
    const falloff = Math.abs(normalized);
    section.style.setProperty("--reel-tilt", `${(normalized * 11).toFixed(2)}deg`);
    section.style.setProperty("--reel-depth", `${(-falloff * 74).toFixed(1)}px`);
    section.style.setProperty("--reel-scale", (1 - falloff * 0.045).toFixed(3));
    section.style.setProperty("--reel-opacity", (1 - falloff * 0.16).toFixed(3));
    section.toggleAttribute("data-reel-focus", falloff < 0.16);
  });
}

function scheduleReelDepthUpdate() {
  if (reelFrame) return;
  reelFrame = requestAnimationFrame(updateReelDepth);
}
```

- [ ] **Step 2: Add passive scroll/resize listeners and an initial update.**

```js
window.addEventListener("scroll", scheduleReelDepthUpdate, { passive: true });
window.addEventListener("resize", scheduleReelDepthUpdate, { passive: true });
reducedMotion.addEventListener("change", scheduleReelDepthUpdate);
scheduleReelDepthUpdate();
```

- [ ] **Step 3: Add a soft settle after scrolling stops.**

```js
function settleReel() {
  if (reducedMotion.matches) return;
  const viewportCenter = window.innerHeight / 2;
  const nearest = reelSections.reduce((current, section) => {
    const bounds = section.getBoundingClientRect();
    const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);
    return !current || distance < current.distance ? { section, distance } : current;
  }, null);
  if (!nearest || nearest.distance > window.innerHeight * 0.24) return;
  nearest.section.scrollIntoView({ behavior: "smooth", block: "center" });
}

function queueReelSettle() {
  window.clearTimeout(settleTimer);
  settleTimer = window.setTimeout(settleReel, 140);
}

window.addEventListener("scroll", queueReelSettle, { passive: true });
```

- [ ] **Step 4: Run the browser smoke checks.**

Run a Playwright check at 1440×900 and 390×844 that asserts:

```js
const sectionState = await page.locator("#projects").evaluate((element) => ({
  tilt: getComputedStyle(element).getPropertyValue("--reel-tilt"),
  depth: getComputedStyle(element).getPropertyValue("--reel-depth"),
  transform: getComputedStyle(element).transform,
}));
expect(sectionState.tilt).toContain("deg");
expect(sectionState.depth).toContain("px");
expect(sectionState.transform).not.toBe("none");
```

Also emulate reduced motion and assert that `.reel-section` has `transform: none` and no horizontal overflow.

- [ ] **Step 5: Commit the scroll geometry.**

```powershell
git add index.html
git commit -m "feat: add centre-based portfolio reel motion"
```

### Task 3: Tune depth details, project handoff, and responsive fallback

**Files:**
- Modify: `index.html` in project media/card, modal, responsive, and reduced-motion CSS rules.
- Test: browser screenshots and interaction smoke.

**Interfaces:**
- Consumes: reel custom properties and current project card/modal classes.
- Produces: a coherent depth hierarchy where sections, tiles, and modal share the same visual camera.

- [ ] **Step 1: Add focus-state styling without decorative clutter.**

```css
.reel-section[data-reel-focus] .section-heading h2,
.reel-section[data-reel-focus] .hero-copy,
.reel-section[data-reel-focus] .project-card,
.reel-section[data-reel-focus] .contact-card {
  filter: none;
}

.reel-section:not([data-reel-focus]) .section-heading,
.reel-section:not([data-reel-focus]) .project-card,
.reel-section:not([data-reel-focus]) .contact-card {
  filter: saturate(0.88);
}
```

Keep existing rectangular tile geometry and three-column breakpoints unchanged.

- [ ] **Step 2: Preserve modal origin behaviour while adding only the section depth context.**

When opening a project, keep the current `openProject()` focus restoration and modal content updates. Do not add a second scroll handler to the modal; the dialog stays above the reel through its existing top-layer behaviour.

- [ ] **Step 3: Reduce tilt and glow at the current mobile breakpoint.**

Add inside the existing `@media (max-width: 600px)` block:

```css
.reel-section { transform: perspective(900px) rotateX(var(--reel-tilt, 0deg)) translateZ(var(--reel-depth, 0px)) scale(var(--reel-scale, 1)); }
.reel-section::before { inset: 8% 0; }
```

The JavaScript uses the same geometry with a smaller mobile `focusRange` and a max tilt of 6 degrees when `window.innerWidth <= 600`.

- [ ] **Step 4: Verify project modal and responsive layout after depth changes.**

At desktop and mobile, verify:

1. `#projects` still contains five cards and three equal columns at 1440px.
2. A-kod remains anonymous.
3. Clicking Budgetly opens its modal and Escape restores focus to the tile.
4. `document.documentElement.scrollWidth === window.innerWidth`.
5. Console has no errors or warnings.

- [ ] **Step 5: Commit the responsive and depth tuning.**

```powershell
git add index.html
git commit -m "style: tune portfolio depth across devices"
```

### Task 4: Final visual verification and handoff

**Files:**
- Modify: `README.md` only if the manual test command or motion behaviour needs documenting.
- Test: Playwright screenshots outside the repository, `git diff --check`, static assertions, and `view_image` on final screenshots.

**Interfaces:**
- Consumes: the completed static portfolio page.
- Produces: verified desktop/mobile evidence and a clean branch ready for PR review.

- [ ] **Step 1: Run final static checks.**

Run:

```powershell
git diff --check origin/main...HEAD
$html = Get-Content -Raw index.html
if ($html -match 'Fillguard') { throw 'Fillguard must remain excluded' }
if (($html | Select-String -AllMatches 'reel-section').Matches.Count -lt 4) { throw 'All four sections must be reel sections' }
Write-Output 'Final static checks passed'
```

- [ ] **Step 2: Capture final desktop and mobile screenshots.**

Use Playwright against a local static server at 1440×900 and 390×844. Capture hero, projects while the projects section is in focus, Budgetly modal, and reduced-motion hero into the external evidence directory:

`C:\Users\kristoma\OneDrive - Den Hartogh Logistics\Documents\GITHUB\portfolio-evidence-20260819`

- [ ] **Step 3: Inspect screenshots for the five fidelity points.**

Review background motion, centre focus geometry, opposing linear tilt, rectangular three-column project grid, and mobile clipping/overflow using `view_image`.

- [ ] **Step 4: Confirm the manual test path.**

1. Open the local page.
2. Scroll slowly from hero through contact and observe each section settle into focus.
3. Scroll quickly and confirm the page does not fight the user or trap the trackpad.
4. Open a project tile, close with Escape, and verify focus restoration.
5. Enable reduced motion and confirm content remains readable without transforms.

- [ ] **Step 5: Confirm a clean branch.**

```powershell
git status --short --branch
git log --oneline -5
```

Expected: clean `codex/portfolio-wheel-depth-20260819` branch with all verification commands passing.
