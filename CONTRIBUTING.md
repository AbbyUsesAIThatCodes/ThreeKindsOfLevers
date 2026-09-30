# Contributing

Read `STATUS.md`, the latest `docs/checkpoints/`, and [Build Identity](docs/BUILD_IDENTITY.md) before resuming review work. The current drafts are a stack: modes → construction/examples → classroom → integration. Keep each change reviewable and retain unrelated working files.

Use Comic Sans with the licensed Comic Neue fallback, authored Title Case display headings, full-window 3D with floating controls, accessible text alongside color, and the original curricular audit's source IDs and gaps. Do not claim a digital construction demonstrates physical assembly mastery.

Run `npm test` and the relevant local browser suites. `CHROMIUM_EXECUTABLE` can select existing Edge/Chromium. On constrained process sandboxes, `node --test --test-isolation=none tests/*.test.mjs` runs logic tests without worker spawning. Build before browser tests or point `REVIEW_ROOT` at an existing exact package's `site` folder.

Do not merge, enable auto-merge, run a deployment workflow or change Pages settings during this review task. Pages runs on main pushes; keep work on task branches. The owner will test and manually merge. Every PR must have an issue and a playable exact-source review package.
