# Repository Guidelines

## Project Structure & Module Organization
The site is anchored by `experimental-book-journal.html`, with earlier experiments and reference assets preserved in `Archive/`. Core styling lives in `css/styles.css`, which defines global custom properties, font imports, and component rules used across the page. Interactive behaviors are modularized in `js/`: `main.js` wires up lifecycle hooks, `blob-effects.js` handles hero and spine visuals, and `grid-background.js` manages the generative grid toggle. Media assets (optimized JPG/PNG) reside in `images/`, while font files are stored in `fonts/`. Keep new assets grouped in these directories so paths remain consistent with existing imports.

## Build, Test, and Development Commands
- `python3 -m http.server 8000` (run from the repo root) serves the site locally without additional tooling.
- `open http://localhost:8000/experimental-book-journal.html` launches the current build in the default browser for manual review. When working on historical variants, point the URL to the matching file under `Archive/`.

## Coding Style & Naming Conventions
Use two-space indentation in HTML, CSS, and JavaScript. Favor semantic HTML sections and descriptive IDs that match the visual element (e.g., `grid-toggle-container`). In CSS, extend the existing custom property palette declared in `:root` before introducing hard-coded colors, and keep selector chains shallow. JavaScript modules follow an `initFeature` pattern; expose a single initializer per module, guard against missing DOM nodes, and avoid introducing global variables outside the existing namespace.

## Testing Guidelines
There is no automated test harness, so rely on quick manual passes: confirm layout stability in Chrome and Safari, toggle the grid controls, and verify blob animations on resize. Use browser devtools’ responsive mode to check breakpoints and watch the console for errors. Document any known limitations in your PR description so the next contributor can reproduce them.

## Commit & Pull Request Guidelines
Git history favors concise, present-tense summaries (e.g., `tweaks to adding new section and formatting`). Keep commits scoped to one concern, and update screenshots in `Archive/` when visual changes are significant. For pull requests, include a short overview, before/after captures for UI changes, and reference the related issue or design note. Call out manual test steps you completed so reviewers can focus on unverified paths.
