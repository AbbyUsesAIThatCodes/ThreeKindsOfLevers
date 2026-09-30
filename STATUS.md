# Overnight Review Status

## Recovered Baseline

- Production/main: `b017384dbcd433ab34e8c432e2a5d4a94846e6e2` (PR #1).
- A new isolated clone on Jess_PC; no pre-existing checkout or dirty files modified.
- No AGENTS.md, CONTRIBUTING.md, STATUS.md or `.agents/skills` existed in this baseline. README, teacher notes, workflows, model and browser tests inspected.
- Six existing model tests; initial sandbox run encountered process-spawn EPERM, so test execution requires the supported elevated process path.
- Pages workflow is restricted to `push` on `main` or explicit manual dispatch. No production pushes, dispatches, merges, auto-merge or Pages settings changes are authorized.

## Review Sequence

1. #2: `overnight/curriculum-modes` — curriculum mapping and Play/Learn/Quiz.
2. #3: `overnight/construction-examples` — actual-arrangement checks and pictured examples; stacked on step 1.
3. #4: `overnight/classroom` — reusable room with four desks/two pairs, front push bar and extinguisher; stacked on step 2.
4. #5: `overnight/integrated-review` — build identity, complete QA, downloadable package; stacked on step 3.

All PRs stay draft. Draft PR checks skip the Actions job; local checks supply review evidence. The Pages workflow remains unchanged.

## Source Recovery

Approved curricular goals: EES 2.2.1 R01 at EngineeringEssentials26-27 commit `ef996b67f272c5c37ebd1161809a2840a94666b3`. Local Gxx IDs are audit targets, not official standards. Original document is kept outside the game checkout. Full mapping follows in teacher documentation.

Original classroom photos `1000008853.jpg`, `1000008855.jpg`, `1000008854.jpg`, `1000008856.jpg` materialized and visually inspected in the private workspace; never committed or used as textures. ClassroomVirtualization `1f25638e64861424a52f8bf381cea2a247cfe74e` is the reusable source.

## Restart

Completed: PR #6 (`b6eb88dd4ecbf26f5d4be18993b5bec1e166e417`), nine logic tests and both browser suites. Construction/example branch passes 11 logic tests and the expanded 17-item learning/browser suite. See `docs/checkpoints/02-CONSTRUCTION-EXAMPLES.md`.

Read this file and `docs/checkpoints/` before continuing. Inspect `git status` and branch heads. Resume the first unfinished step; never reset unrelated files. Build output and private references are outside tracked sources. Commit each meaningful step with local test results before pushing its named task branch.
