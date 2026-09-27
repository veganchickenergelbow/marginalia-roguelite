# Marginalia — State

Last updated: 2026-09-27 (handoff from Claude cloud session to Claude Code)

## Status: v4 shipped as Claude Artifact prototype

Playable prototype exists and was bot-playtested end-to-end (full 3-act win, no console errors, no skippable books). Published as a Claude Artifact at https://claude.ai/artifact/FaznyShBq3jG6jZ1n9wTAy (private, v4) — this repo is now the source of truth going forward; treat the artifact as a historical snapshot, not something to keep syncing to.

## What's done

- Core loop: shelves of mandatory books → questions (multiple-choice/true-false/estimate/order) → reveal (untimed) → reward choice → shop/rest/curio bonuses → disguised boss per act → 3 acts total.
- Universal (non-Singlish) mascot dialogue.
- Balanced category weighting (Singapore no longer overrepresented), harder Singapore-history tier added.
- 22 library/bookworm/global-artifact-themed relics ("bookmarks"), 8 quills (power-ups).
- Subtopic-based book titles.
- Fixed the v3 skip-exploit (picking a non-book item no longer skips books on that shelf).
- Boss disguise + dramatic reveal animation.

## Open items / next steps

1. **Set up as a real repo**: `git init`, add a `build.py` (see CLAUDE.md for the concat logic), `.gitignore` for scratch/debug files (`qdump.json`, `qtagged.json`, `questions.v2.js`, `questions.v3.js`, `blk_*.js`, `tag.py`, `game.html` are all superseded/scratch — decide whether to keep as history or drop).
2. **Deploy**: pick a static host (GitHub Pages is the natural fit given the connected GitHub — enable Pages on this repo, serve `marginalia.html` as `index.html` at repo root or `/docs`).
3. **Fresh balance pass**: wax/damage/page-income/shop-price tuning was last verified before the v3→v4 shelf redesign — worth one more full bot-playtest run to confirm balance still feels right now that no books can be skipped (runs are now guaranteed-longer than before, which changes income/attrition curves).
4. **Boss-disguise feel check**: confirmed working mechanically; open question is whether it needs a subtle tell before commit (raised but not resolved) vs. staying a pure surprise.
5. **Playtest tooling**: no Playwright test scripts are checked into this repo yet (they lived in a scratch dir on the cloud session). Worth writing a proper `test/playtest.js` here so future sessions have a repeatable regression check.

## File inventory notes

Superseded/scratch files included in this handoff for reference only (not needed going forward): `game.html` (pre-v3 original), `questions.v2.js`, `questions.v3.js` (pre-tagging backups), `blk_case.js`/`blk_data.js`/`blk_draw.js`/`blk_finish.js` (intermediate refactor scratch), `qdump.json`/`qtagged.json`/`tag.py` (subtopic-tagging scratch script + dumps). Safe to delete after confirming `questions.js` is complete and correct.
