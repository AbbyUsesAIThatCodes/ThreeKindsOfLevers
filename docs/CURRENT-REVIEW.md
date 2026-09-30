# Banner And Camera Review

Draft [PR #13](https://github.com/AbbyUsesAIThatCodes/ThreeKindsOfLevers/pull/13), [issue #12](https://github.com/AbbyUsesAIThatCodes/ThreeKindsOfLevers/issues/12), targets main after merged integration PR #11. The owner will merge manually after testing. No production action was taken.

## Exact Playable Build

`0.1.0_Unassigned_pr-13_build-005_20260930T132654Z_g9daf2a8bbde5_web-review`

Clean runtime source: `9daf2a8bbde5c4d838988e7bd160763c12602089`. Built UTC: `2026-09-30T13:26:54.601Z`. Runtime input SHA256: `c7adc0e71748a6630d55b01388bb77d14b502eb809d02a6289f6f994a74e86fa`. Version remains 0.1.0 development; Unassigned preserves the documented absence of an accepted codename.

The ZIP is named `0.1.0_Unassigned_pr-13_build-005_20260930T132654Z_g9daf2a8bbde5_web-review.zip`. Unzip the entire folder, double-click **Start Review.cmd**, or use Node.js 22+: `node serve-review.mjs`. Open `http://127.0.0.1:43163/`; Ctrl+C stops the server. No npm install, account, hosting service or external runtime download is needed. Do not open site/index.html directly. The Library download and screenshots are delivered privately in the conversation; no private links are published on GitHub.

Manifest, report, persistent game footer, launcher console and enclosing folder share the exact identity above. The existing packager is separately identified as `2d56d8185148d09eaad1d92d1e06e56b44090755`; its dirty flag records only the durable shared build ledger. No uncommitted runtime or packaging-code changes are included. Later commits update ledger/report metadata only, so they do not require rebuilding this output.

## Scope

Three distinct groups share the top banner: learning modes with Reset and Apply Effort; lever class presets; camera views. The lower information panel is shorter. Fit/Side View frame the complete beam and base through the controlled lift in the space between the banner and lesson, from a slightly lower viewing angle. Manual orbit, zoom and Room View remain free until Fit/Side is selected again.

At the narrowest portrait and short landscape sizes, redundant preset subtitles remain accessible to assistive technology while the selected class rule remains visible below. Short landscape learning uses the existing scrollable activity panel. No classroom, apparatus dimensions, learning/quiz rules, examples, storage or workflow changes. Class presets remain concealed in Learn/Quiz, preserving assessment. Comic Sans and its licensed fallback remain in use. Motion remains a controlled 12-degree demonstration, not measured force or acceleration; [curriculum coverage](CURRICULUM-COVERAGE.md) is unchanged.

## Verified Against This Package

- All 13 logic tests pass.
- All 96 complete-apparatus bounds checks pass: three classes, level/lifted, Fit/Side, resets and learning modes across 320 x 568, 844 x 390, 1366 x 768, 1024 x 768, 768 x 1024 and 390 x 844. The complete beam/base clear the banner and lesson; controls and labels stay in bounds. Repeated mode/class/view/reset interactions and nested vocabulary references pass.
- Gameplay: real 3D raycast/label dragging, keyboard crossing, cancellation, mirror, lift directions, persistence, reduced motion and WebGL/storage fallback pass.
- Learning: all guided/quiz activities, actual construction, correct/incorrect responses, immutable first attempts, stale-feedback prevention, locked motion question and keyboard focus progression pass.
- Phone touch emulation: drag/cancel, narrow subtitle bounds, swipe to class/middle-role controls, select both, submit and return to the question top pass. Panel swipes do not move the lever.
- Classroom/Room View and example regressions pass; frozen shared assets remain unchanged.
- Package launcher, clean source, console/UI/manifest/report identity and mode navigation pass. No unhandled page errors or external runtime requests.

Evidence and machine-readable bounds are in the ZIP's `evidence/` folder. Edge/Chromium 154.0.4258.37 ran headlessly with software WebGL. Tests used task-owned ports 43210, 43213, 43161, 43162 and 43166; only spawned browsers/servers were closed. Windows launcher contents were inspected; the actual Node launcher was exercised without opening a user browser. Physical devices, Safari/Firefox and screen-reader software were not tested.

## Production And Recovery

At 2026-09-30T13:28:59.5341535Z, main remained `770a7502ee6bd7c6d66cc605a577f5d826e66dce`, Pages run `36713581831` remained unchanged, and live HTML SHA256 remained `b163e5748eb290ca316636ffb5ba11c40f4fe9d337c5c48b66bf071d4ad9298e`. Draft Actions job: skipped. No merge, auto-merge, workflow dispatch, deployment, billing/settings change or new hosting.

Branch: `polish/banner-camera`; primary checkout and older packages are preserved. Build 005 reservation is durable at `6045be6cf7ae0e3c43486bd07e324767164088ee`. Earlier candidates remain in the ledger/evidence archive: 001 exposed inherited vocabulary sizing; 002 led to the short-phone fix; 004 led to the landscape fix. Reuse build 005 for review; do not relabel or rebuild merely to change a report.

The earlier PR #9 report is retained in [Overnight Review](reviews/PR9-OVERNIGHT-REVIEW.md). Shared asset source remains `d3d647fd204cebd9ac94d652fbada434a08d7a90`; no reusable graphics or shared index update is required.

ZIP SHA256: `5b6364fb05b48fda30fbcd10a9e39fdf7459bdaaa0ed0e5712ee7e133340cc17` (9,742,253 bytes). Library confirmed the ZIP and three selected screenshots as new items. The ZIP contains 44 screenshots and byte-identical copies of all 11 tested site files.
