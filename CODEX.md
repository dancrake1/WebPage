# Codex guide for this repo

Short reference for Codex CLI agents working in this project.

- Project type: single-page static site (experimental-book-journal.html).
- Primary tasks: tweak HTML/CSS/JS, add content, and manage images referenced by the page.
- Serve locally (optional): python3 -m http.server 8000 and open http://localhost:8000/experimental-book-journal.html

Operational rules
- Keep changes minimal and focused; match the existing style.
- Use apply_patch for edits; do not ask the user to copy/paste code you already changed.
- Do not add license headers. Avoid inline comments unless absolutely necessary.
- Do not modify Archive/ unless asked.

Critical constraint: images folder
- Treat images/ as binary/byte files. Do not read, dump, or embed file bytes (e.g., JPEG/JPG/PNG) into the chat/context.
- Never cat/print or base64 any file from images/ unless the user explicitly asks for the file contents.
- Prefer referencing paths (e.g., images/severn_sisters/hills.jpg). Only manipulate bytes when explicitly requested.

Testing and checks
- If you need to sanity-check layout, spin up a local static server as above.
- There is no pre-commit config in this repo at the time of writing; run only what’s necessary for the task.

Notes for future edits
- The main entry point is experimental-book-journal.html. Keep CSS and JS inline unless asked to split.
- Avoid reading large/binary assets into the conversation to conserve context and keep outputs clean.

Last updated: 2025-09-04
