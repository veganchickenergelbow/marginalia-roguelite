# Marginalia — Trivia Roguelite

A single-page HTML/JS trivia roguelite themed around a grand library. No build step, no framework — vanilla JS, assembled by concatenation into one shippable file.

## Architecture

Source files (edit these, never edit `marginalia.html` directly):
- `shell.html` — page skeleton, fonts, all base CSS (HUD, title screen, encounter card, panels).
- `extra.css` — shelf/bookcase UI CSS (`.shelfwrap`, `.shelf`, `.cover`, boss-reveal animation, etc.).
- `icons.js` — SVG icon path definitions (`ICONS` object).
- `art.js` — procedural canvas library background + reusable SVG art generators (mascot, bosses).
- `questions.js` — the question bank (500+ questions across 7 categories: sg/food/sea/world/sci/sport/word), each tagged with difficulty (`d`, 1-3) and a subtopic used for book titles. Built via `M()/TF()/E()/O()` helper functions into `B`, flattened into `BANK`.
- `app.js` — all game logic: state machine (`S.screen`), run state (`R`), encounter state (`EN`/`QS`), shelf/act generation, question rendering for 4 question types, quills (power-ups), relics/bookmarks, shop, chests, boss fights with disguise+reveal, save system (localStorage).

Build: `marginalia.html` = `shell.html` + `extra.css` (wrapped in `<style>`) + `questions.js` (wrapped in `<script>`) + `app.js` (already wrapped). Rebuild with:
```python
shell = open('shell.html').read()
c = '<style>' + open('extra.css').read() + '</style>'
q = open('questions.js').read()
a = open('app.js').read()
out = shell + c + '\n<script>\n' + q + '\n</script>\n' + a
open('marginalia.html', 'w').write(out)
```
There's no separate build tool checked in yet — write this as a small script (e.g. `build.py`) in the repo root and run it after every source edit.

## Current state (v4)

- 3 acts × 3 shelves × 3 books per shelf (9 books/act, 27 total). Book size: stars(1/2/3) → n=stars+2 questions (3/4/5 questions).
- Every book on a shelf is mandatory — chests/curios attach as bonuses to a specific book (revealed after finishing it), never as alternative picks. This fixed a critical skip-exploit from v3.
- Boss is disguised as a normal book on each act's final shelf; picking it triggers a flip/flash reveal animation before the fight.
- Book titles are subtopic-based (e.g. "Singapore: Streets & Places ★★"), not flavor text.
- Save data lives in browser localStorage (`marginalia.v2` key) — Codex progress, best runs.

See `STATE.md` for open items and next steps.

## Working conventions

- One task per session — pick the next item from STATE.md, do it, update STATE.md, stop.
- Test changes with a Playwright bot-playtest before considering a mechanic change done (see prior sessions' pattern: simulate ~80% correct answers, click through all screen types, screenshot key states).
- Never edit `marginalia.html` by hand — always edit sources and rebuild.
- Keep the CDN/library footprint at zero — this ships as a single static HTML file with no external runtime dependencies (Google Fonts links are fine).
