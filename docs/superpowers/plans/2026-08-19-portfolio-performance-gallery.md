# Portfolio Performance and Project Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce scroll jank in the portfolio and add a lightweight, lazy-loaded image gallery to each expanded project modal.

**Architecture:** Keep the existing static HTML page and vanilla JavaScript. Replace filter-heavy ambient layers with transform-driven radial gradients, combine motion work into one animation frame, and batch DOM reads before writes. Add a gallery data array to `PROJECTS` and render one active modal image with controls, dots, keyboard support, and adjacent-slide preloading.

**Tech Stack:** Static HTML/CSS, vanilla JavaScript, native `<dialog>`, local project image assets, Playwright for rendered QA.

## Global Constraints

- Preserve the current dark cyan/lilac/mint visual language and rectangular project tiles.
- Do not migrate the page to React or add a package manager solely for the gallery.
- Keep A-kod Automation anonymous.
- Avoid loading all gallery images at modal open; load the active image and preload only adjacent images.
- Preserve reduced-motion support, modal focus behavior, mobile responsiveness, and project links.

### Task 1: Capture and register project detail images

**Files:**
- Create: `assets/projects/gallery/` image assets captured from the approved project pages/program.
- Modify: `index.html:PROJECTS` gallery metadata.

**Interfaces:**
- Each project exposes `gallery: [{ src, alt, caption }]`.
- The first gallery item remains the existing tile image so the modal opens with the same visual as the card.

- [ ] Verify available live/local project views and capture only screenshots that show actual use or landing-page detail.
- [ ] Keep A-kod's gallery to the anonymous placeholder until the user supplies an image.
- [ ] Add gallery arrays with stable relative asset paths and descriptive alt text.

### Task 2: Replace expensive ambient rendering

**Files:**
- Modify: `index.html` CSS near the ambient body/page-shell layers.

**Interfaces:**
- Ambient layers remain decorative and pointer-events-free.
- `--ambient-x` and `--ambient-y` move a composited layer with `transform`, not a full-page `background` repaint.

- [ ] Remove the large filter blur from fixed animated blobs.
- [ ] Use radial gradients with transparent edges for soft color falloff.
- [ ] Keep one transform-driven reactive layer and preserve the reduced-motion media query.

### Task 3: Batch motion work into one frame

**Files:**
- Modify: `index.html` script near `updateAmbient`, `updateReelDepth`, and motion event listeners.

**Interfaces:**
- `scheduleMotionUpdate()` is the only RAF scheduler for ambient and reel updates.
- Layout reads happen before card/section style writes in each frame.

- [ ] Replace separate ambient/reel RAF queues with one scheduler.
- [ ] Cache pointer media-query objects instead of creating them on every pointer event.
- [ ] Batch card geometry reads, then apply CSS custom properties in a write pass.
- [ ] Preserve snap timing and reduced-motion behavior.

### Task 4: Implement the modal gallery

**Files:**
- Modify: `index.html` modal markup, gallery CSS, `PROJECTS`, `openProject`, `closeProject`, and modal event handlers.

**Interfaces:**
- `renderGallery(project)` renders the active image, caption, dots, and previous/next controls.
- `setGallerySlide(index, { focusControl = false })` clamps/wraps the index, updates the image/caption/dots, and preloads adjacent slides.
- Gallery controls are keyboard accessible and touch-friendly.

- [ ] Add a gallery viewport and controls without changing the modal's existing problem/how/status sections.
- [ ] Add previous/next buttons, dot buttons, `ArrowLeft`, `ArrowRight`, and swipe handling.
- [ ] Keep one main `<img>` in the DOM and preload adjacent images with `Image()`.
- [ ] Disable or hide redundant controls for a one-image gallery.
- [ ] Reset gallery state when a different project opens and restore modal focus on close.

### Task 5: Verify performance and interactions

**Files:**
- No committed test files; use temporary Playwright scripts outside the repository.

- [ ] Run `git diff --check`.
- [ ] Measure idle and scroll RAF counts before/after the optimization using the same local URL.
- [ ] Verify desktop and mobile page identity, non-blank render, no console errors, and no horizontal overflow.
- [ ] Open a project from the whole tile, move through gallery slides with buttons, keyboard, and swipe, and verify captions/images change.
- [ ] Verify reduced motion removes transforms/ambient movement while keeping the gallery usable.
- [ ] Capture desktop modal and mobile modal screenshots outside the repository.

## Follow-up polish approved 2026-08-19

- Keep the background visibly alive without requiring pointer interaction by adding one slow, transform-only ambient drift while retaining pointer response as an enhancement.
- Make project media more readable by increasing the tile media height and showing portrait gallery slides in a taller modal frame.
- Make reel settling user-safe: cancel an in-progress smooth settle before accepting new wheel/touch input, allow the top of the document to remain reachable, and only settle after scroll idle.
- Add a LinkedIn-aligned professional profile section between About and Projects using the existing CV facts: Den Hartogh Liquid Logistics, Link Logistics AB, education, and skills. Keep it professional and link to the existing LinkedIn profile.
