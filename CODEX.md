# Codex guide for this repo

Short reference for Codex CLI agents working in this project.

- Project type: photography portfolio website with modular architecture (experimental-book-journal.html + external CSS/JS).
- Primary tasks: tweak HTML/CSS/JS, add content, and manage images referenced by the page.
- Serve locally (optional): python3 -m http.server 8000 and open http://localhost:8000/experimental-book-journal.html

## File Structure (Modularized)

The project has been split into separate files for better maintainability:

### Core Files
- **experimental-book-journal.html**: Main HTML structure, references external assets
- **css/styles.css**: All styling extracted from HTML - book layouts, spine effects, responsive design
- **js/main.js**: Main initialization coordinator - handles DOMContentLoaded and coordinates other modules
- **js/blob-effects.js**: Image effects module - spine blending, lightbox, smooth scroll, blob generation
- **js/grid-background.js**: Generative grid background system with toggle controls

### Additional Features
- **Generative Grid Background**: Canvas-based progressive color blocks system with Y/N toggle
- **Blob Effects**: SVG-based organic shapes overlaid on images
- **Spine Blending**: 3D rotation effects for images near the book center

Operational rules
- Keep changes minimal and focused; match the existing style.
- Use apply_patch for edits; do not ask the user to copy/paste code you already changed.
- Do not add license headers. Avoid inline comments unless absolutely necessary.
- Do not modify Archive/ unless asked.
- When editing functionality, respect the modular structure - edit the appropriate separate file.

Critical constraint: images folder
- Treat images/ as binary/byte files. Do not read, dump, or embed file bytes (e.g., JPEG/JPG/PNG) into the chat/context.
- Never cat/print or base64 any file from images/ unless the user explicitly asks for the file contents.
- Prefer referencing paths (e.g., images/severn_sisters/hills.jpg). Only manipulate bytes when explicitly requested.

Testing and checks
- If you need to sanity-check layout, spin up a local static server as above.
- There is no pre-commit config in this repo at the time of writing; run only what's necessary for the task.
- Test functionality after modifying any JS modules to ensure proper initialization.

Notes for future edits
- The project is now modular - CSS and JS are in separate files, NOT inline in HTML.
- Main functionality is coordinated through js/main.js which calls initialization functions from other modules.
- Avoid reading large/binary assets into the conversation to conserve context and keep outputs clean.

Last updated: 2025-09-14
