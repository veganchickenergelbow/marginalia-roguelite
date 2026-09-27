# Marginalia — State

Last updated: 2026-09-27 (git repo set up, deployed to GitHub Pages, visual polish pass)

## Status: live on GitHub Pages, visual polish in progress

Repo: https://github.com/veganchickenergelbow/marginalia-roguelite — live at https://veganchickenergelbow.github.io/marginalia-roguelite/
`index.html` is a checked-in copy of `marginalia.html` (GitHub Pages needs `index.html` at root) — **remember to re-copy after every rebuild** (`build.ps1`/`build.py` both do this automatically now).

No Python on this dev machine — use `build.ps1` (PowerShell, does the same shell+extra.css+questions.js+app.js concat as `build.py`, UTF-8 no-BOM to avoid mojibake on special chars like the `·` separator). `serve.ps1` + `.claude/launch.json` spin up a local static server for browser-pane previewing (no node/python needed either).

Note: `icons.js` and `art.js` are **stale/unused** — `app.js` already contains its own complete copies of `ICONS`, the `BG` canvas background, and `folioSVG`/`blotSVG`/etc. Only `app.js` is in the build. Edit `app.js` directly for any of that; the standalone `icons.js`/`art.js` files are leftover duplicates from an earlier refactor and don't affect the shipped game (worth deleting or reconciling in a future session).

### Visual polish (in progress, started 2026-09-27)
User wants a "cuter, less AI-looking" painterly asset upgrade inspired by a reference concept sheet. Agreed approach: hybrid — keep the lightweight vector/CSS system for UI chrome, layer in a handful of hero illustrations.
- **Done**: mascot swapped from the hand-drawn SVG bookworm to a fox (3 states: `assets/fox-neutral.png`, `fox-happy.png`, `fox-hurt.png`, 420×420, real alpha — user's source images were flattened JPEGs with baked-in checkerboard, chroma-keyed via a PowerShell/System.Drawing script). `folioSVG()` in app.js now returns a `<div class="folio">` wrapping 3 `<img class="fe fe-x">` swapped via the existing `data-mood` CSS rule — same hop/wince/bob animations as before, no JS changes needed beyond the markup swap.
- **Done**: CSS-only ornamental polish — gold diamond "keystone" ornament on `.card`/`.sheet` top edge, gold flourish line under `.panel-head h2`, hover lift/glow on relic chips and wing pills.
- **Not done / open**: location banner art for the 6 wings (Lion City Wing/Singapore, Banquet Hall/Istanbul, Monsoon Gallery/Melaka, Silk Road Stacks/Samarkand, The Orrery/Jaipur, Stadium Archive/Olympia) — currently flat color swatches behind icon+name. User explicitly deferred this (asked to skip for now, 2026-09-27) rather than have Claude build vector versions or wait for more generated images. Revisit if the user brings it up again — no image-gen tool is available in-session, so any raster art needs the user to generate it externally (same chroma-key pipeline as the fox can reuse `ChromaKey` approach from this session if future uploads are flattened JPEGs again).
- Claude has **no image-generation tool** in this environment — confirmed twice this session. Don't imply otherwise; any painterly/illustrated asset needs the user to generate it externally and hand it over.

## What's done

- Core loop: shelves of mandatory books → questions (multiple-choice/true-false/estimate/order) → reveal (untimed) → reward choice → shop/rest/curio bonuses → disguised boss per act → 3 acts total.
- Universal (non-Singlish) mascot dialogue.
- Balanced category weighting (Singapore no longer overrepresented), harder Singapore-history tier added.
- 22 library/bookworm/global-artifact-themed relics ("bookmarks"), 8 quills (power-ups).
- Subtopic-based book titles.
- Fixed the v3 skip-exploit (picking a non-book item no longer skips books on that shelf).
- Boss disguise + dramatic reveal animation.

## Open items / next steps

1. ~~Set up as a real repo~~ — done 2026-09-27.
2. ~~Deploy~~ — done 2026-09-27, GitHub Pages serving `index.html` at repo root.
3. **Location banner art** — deferred by user 2026-09-27, see Visual polish section above.
4. **Fresh balance pass**: wax/damage/page-income/shop-price tuning was last verified before the v3→v4 shelf redesign — worth one more full bot-playtest run to confirm balance still feels right now that no books can be skipped (runs are now guaranteed-longer than before, which changes income/attrition curves).
5. **Boss-disguise feel check**: confirmed working mechanically; open question is whether it needs a subtle tell before commit (raised but not resolved) vs. staying a pure surprise.
6. **Playtest tooling**: no Playwright test scripts are checked into this repo yet (they lived in a scratch dir on the cloud session). Worth writing a proper `test/playtest.js` here so future sessions have a repeatable regression check.

## File inventory notes

Superseded/scratch files included in this handoff for reference only (not needed going forward): `game.html` (pre-v3 original), `questions.v2.js`, `questions.v3.js` (pre-tagging backups), `blk_case.js`/`blk_data.js`/`blk_draw.js`/`blk_finish.js` (intermediate refactor scratch), `qdump.json`/`qtagged.json`/`tag.py` (subtopic-tagging scratch script + dumps). Safe to delete after confirming `questions.js` is complete and correct.
