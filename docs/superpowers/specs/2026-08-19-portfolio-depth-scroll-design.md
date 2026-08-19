# Portfolio depth scroll design

## Status

Approved visual direction from the vertical wheel companion demo. This document defines the next implementation pass; it does not change the current page by itself.

## Goal

Make the portfolio feel like one continuous, premium surface that the visitor moves through as a vertical reel. The page should have real spatial depth in the background, section transitions, project tiles, and modal handoff while remaining readable and professional for a LinkedIn audience.

The interaction is a vertical cover-flow / cylindrical wheel picker: content near the viewport centre is flat, sharp, and visually recessed into the page. Content above and below the centre tilts linearly away from the viewer, becomes slightly smaller and softer, and returns to a flat state as it reaches the focus band.

## Visual direction

### Fluid background

- Keep the dark navy base and cyan/lilac accents.
- Replace the mostly static background treatment with several large, blurred colour fields moving slowly behind the content.
- Use separate cyan, lilac, and restrained mint layers with different animation durations and positions so the motion feels organic rather than like a looping gradient preset.
- Add a faint grid/noise layer for material depth, but keep contrast low enough that text remains the first read.
- Background layers must be decorative only: `pointer-events: none`, no layout impact, and no horizontal overflow.

### Reel surface

- Treat `main` as a vertical reel with a shared perspective camera rather than a stack of unrelated sections.
- Each major section (`hero`, `about`, `projects`, `contact`) has a focus position around the viewport centre.
- A narrow focus band is allowed as a subtle visual guide, but it should not look like a HUD or gaming interface.
- Project tiles remain rectangular with no rounded corners and keep the three-column desktop grid.
- Tiles gain depth from layered borders, controlled shadows, image recession, and the section transform—not from additional decorative widgets.

## Scroll geometry

For each reel section, calculate its centre relative to the viewport centre inside one `requestAnimationFrame` scroll loop:

- `distance = sectionCenter - viewportCenter`
- `normalizedDistance = clamp(distance / focusRange, -1, 1)`
- `rotateX = normalizedDistance * maxTilt`
- `translateZ = -abs(normalizedDistance) * depthFalloff`
- `scale = 1 - abs(normalizedDistance) * scaleFalloff`
- `opacity` and blur fall off slightly with distance, never enough to hide required content.

The centre state is always `rotateX(0deg)`, with the strongest text contrast and a deeper inner shadow/backdrop. The top and bottom states use equal and opposite tilt, producing the linear wheel shape described in the companion example.

Use CSS custom properties for these values so the motion remains inspectable and easy to tune. The scroll loop must be passive, read layout once per frame, and avoid per-scroll style recalculation outside the scheduled frame.

## Soft snap

- Use `scroll-snap-type: y proximity` on the page reel so the visitor retains control during normal scrolling.
- Mark the four major sections with `scroll-snap-align: center` and suitable `scroll-margin`.
- After scroll settles, allow the nearest section to ease into the focus band. Do not force a snap during fast trackpad or touch movement.
- Keep normal anchor navigation functional; when a nav link is used, the target section should land centred.
- The focus state must be readable without relying on motion: active section gets a data/state class and the same hierarchy can be understood from colour, contrast, and layout.

## Depth details

- Add a shared perspective context to the reel, with `transform-style: preserve-3d` on the section track.
- Use shallow, directional shadows that change with section position instead of a single uniform glow.
- Let screenshots sit one layer behind their card text while keeping rectangular edges crisp.
- Keep modal opening connected to the tile: use the tile's current transform/origin as the starting point, then bring the modal forward on the same depth axis.
- Limit glows to edges and moving background fields; avoid neon outlines on every element.

## Responsive behaviour

- Desktop: full wheel geometry, three project tiles per row, clear depth range.
- Tablet: two project tiles per row and a reduced tilt range so the section remains readable.
- Mobile: one tile per row, smaller focus range and tilt angle, no horizontal overflow, and no partial content hidden by the focus band.
- Preserve the current phone-format project screenshots for Budgetly and Hem-Listan.

## Motion safety and fallback

When `prefers-reduced-motion: reduce` is active:

- stop animated background drift;
- remove section tilt, scale, blur, and translateZ transforms;
- keep the page readable in normal document flow;
- retain focus styling and modal functionality without animated handoff;
- avoid smooth scrolling and automatic snap behaviour.

If scroll-linked animation features are unavailable, the JavaScript `requestAnimationFrame` loop provides the geometry. If JavaScript is unavailable, the semantic sections and project grid remain usable as ordinary document flow.

## Preserved requirements

- Hero renders first and contains no streamed text.
- Projects remain A-kod Automation, Click Notes, Hem-Listan, Budgetly, and Visual Code Editor.
- Fillguard remains excluded.
- A-kod Automation remains anonymous with the documented image replacement slot.
- Project modals continue to show the problem, how it works, current status, and relevant links.
- Contact links and CV action remain available.

## Reference direction

The visual ambition is informed by Zauberberg's unusual layout and moving-image direction, while the scroll geometry follows the vertical cover-flow / wheel-picker family described in these references:

- https://zauberbergproductions.com/
- https://codepen.io/Mouradif/pen/dWJoZo
- https://addyosmani.com/blog/coverflow/
- https://www.outsystems.com/forge/component-overview/24007/infinitywheel-odc

The portfolio will use the interaction principle, not copy the reference site's branding, content, or layout.

## Verification criteria

- Desktop screenshot visibly shows a flat, deep centre section and opposing linear tilt above/below it.
- Scrolling through hero, about, projects, and contact lands each section softly in the focus band.
- Background colour fields move continuously without causing horizontal overflow or distracting from text.
- Three rectangular project tiles still fit across desktop width.
- Mobile remains readable with one-column tiles and no clipped primary content.
- Reduced-motion mode removes the transforms and animated background while preserving all content and interactions.
- Browser console is clean, modal open/close still works, and keyboard focus remains visible.
