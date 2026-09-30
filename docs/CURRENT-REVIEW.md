# Three Kinds of Levers - Overnight Review

Start with **Start Review.cmd** in the extracted top-level folder. This is the integrated PR #9 build. On another system with Node.js 22+, run `node serve-review.mjs`, then open `http://127.0.0.1:43163/`. Keep the server running; Ctrl+C stops it. Do not open site/index.html directly. No npm install, account, external runtime downloads or hosting subscription is needed.

## Exact Review Stack

| Draft PR | Issue | Clean Game Source | Bundle Launcher |
| --- | --- | --- | --- |
| [#6](https://github.com/AbbyUsesAIThatCodes/ThreeKindsOfLevers/pull/6) | #2 | `b6eb88dd4ecbf26f5d4be18993b5bec1e166e417` | Play PR 6.cmd |
| [#7](https://github.com/AbbyUsesAIThatCodes/ThreeKindsOfLevers/pull/7) | #3 | `5def06afa49cf355f635e82454c0f9e97fdb2c5e` | Play PR 7.cmd |
| [#8](https://github.com/AbbyUsesAIThatCodes/ThreeKindsOfLevers/pull/8) | #4 | `80fcf28ec099a788cf29d335084594212c45cb34` | Play PR 8.cmd |
| [#9](https://github.com/AbbyUsesAIThatCodes/ThreeKindsOfLevers/pull/9) | #5 | `c567ddf0612dd25501144809031e0c4daf929753` | Start Review.cmd |

All four independently compiled snapshots are included. Stop one launcher before opening another, or set PORT to another unused port. Earlier snapshots are historical review steps: #6 has initial modes; #7 adds construction/examples; #8 adds the room. They retain the feedback, fixed-motion and focus findings resolved in #9. Use #9 for the complete assessment.

- PR #6: `0.1.0_Unassigned_pr-6_build-001_20260930T032140Z_gb6eb88dd4ecb_web-review`
- PR #7: `0.1.0_Unassigned_pr-7_build-001_20260930T032141Z_g5def06afa49c_web-review`
- PR #8: `0.1.0_Unassigned_pr-8_build-001_20260930T032143Z_g80fcf28ec099_web-review`
- PR #9: `0.1.0_Unassigned_pr-9_build-003_20260930T035321Z_gc567ddf0612d_web-review`

The source snapshots are clean. A separately identified review packager supplies the identity overlay, report and server to older PRs. Integrated packager revision is `c567ddf0612dd25501144809031e0c4daf929753`; earlier package manifests retain their original packager revisions and ledger-only dirty flags. No uncommitted runtime/packager edits are included. Every manifest records byte fingerprints, fixed UTC time, full source revision and target. Checkout line endings can make byte fingerprints differ between clean worktrees. No accepted codename existed in recovered history: Unassigned is an explicit placeholder, not a new release name. Version 0.1.0 remains development and preserves Play storage compatibility.

The build ledger is committed at `a04a9c9f9f20f52597d7eaab491557b9dc46c622`. Later handoff commits change reports/ledger only; the delivered game source remains the exact revision above. Copying, testing and downloading these outputs does not reserve a new build.

## What Changed

Play preserves free rearrangement, camera and motion controls. Learn has 14 guided activities, including actual construction of each class and six pictured operating configurations. Quiz has 17 checks: all six role orders, three constructions, six real-world role/class checks, motion and a model-limit question. Class answers are hidden during the quiz. First-attempt results and corrected retries remain separate. Changing an answer invalidates visible correctness. The fixed third-class motion question prevents arrangement edits while retaining Apply Effort. Keyboard progression focuses an announced activity heading and preserves lesson-picker focus.

The room reuses ClassroomVirtualization source and privately inspected original photos. Four individual pale desk tops form two pairs. The exit has a projecting bar with two mounts; the red extinguisher has a white sleeve, curved hose and silver neck/lever. The requested exit-bar detail is not claimed as measured photo-exact hardware. Private photos and identifying markings are absent from this bundle.

## Curriculum Coverage

See [the full matrix](CURRICULUM-COVERAGE.md). EES 2.2.1 R01 Gxx IDs are local audit targets, not official standards. Centered coverage: G01 roles, G23 inferred function-based identification, G54 middle-role classification, G60/G61 representations. Digital building rehearses G21/G26/G27; it cannot certify E2 or physical assembly mastery. G58 supports the pictured forearm transfer. G52 distinguishes motion from gravity, and G64/G68 bound the model. Missing teacher-spoken directions and incomplete S/M captures remain documented. Tutorials are source-informed teaching design. The original approved curricular-goals document is unchanged.

## Verified Tests

- 13 logic tests passed, including all six orders, mirrored/invariant classification, legal spacing, actual construction checks, correct/incorrect role answers, retry evidence, motion/model limits, desk pairs and concurrent durable build allocation.
- Existing 3D browser regression passed: actual hardware raycast/label dragging, keyboard crossing, cancellation, mirroring, lift direction, camera, storage, reduced motion, responsive canvas and WebGL/storage fallback.
- Expanded learning browser passed: all 17 quiz items, three student-built classes, wrong/right answers, correct-to-wrong response changes, Learn feedback invalidation, immutable initial scores, locked motion edits with Apply Effort, keyboard Next/Previous and picker focus, resets, mode restoration, touch drag/cancel and vocabulary references.
- Layouts checked at 1366x900, 390x844, 844x390 and 320x568, plus the original desktop cases. Short-screen role labels and apparatus clear the activity panel. The activity scrolls where needed.
- Classroom browser passed and screenshots were visually inspected for four desks/two pairs, front bar, recognizable extinguisher and operating diagrams.
- All four included Node launchers served their exact package. The Windows .cmd wrappers were inspected; they were not launched into the user's desktop. UI, launcher console, manifest, report, source and folder identities agree; mode navigation passed; no unhandled page errors or external runtime requests were observed.

Browser: Microsoft Edge/Chromium 154.0.4258.37, headless software WebGL on Jess_PC. Tests used task-owned processes and ports 43160–43162 and 43166–43169; only those spawned processes were closed. Evidence screenshots/logs are in the downloaded package's evidence folder, and every screenshot contains the exact build footer. No physical touch-device or Safari/Firefox run was performed. No screen-reader software test or physical classroom validation is claimed. Build 003 includes the three requested display-heading corrections and three phone-flow screenshots showing the controls, submitted answer and returned question top. Build 001 and the earlier Library versions remain preserved. Build 002 remains a local candidate, superseded by the requested display-copy correction before Library delivery.

## Morning Test

1. Open the integrated launcher, then Room View: check the desk seams, extinguisher and door bar. Return to Fit View.
2. In Play, try all classes, drag a role across another, reverse the arrangement and apply effort.
3. In Learn, choose each Build lesson and construct the requested class. Change the middle-role answer after checking; feedback must clear.
4. In Quiz, try a wrong answer and correct it. After a correct answer, change a dropdown: green correctness must clear. Use Tab/Enter for progression.
5. Reach the motion question: positions stay fixed; Apply Effort raises the load and effort location. Finish the model-limit item and compare first-attempt versus corrected results.

## Production and Merge Recovery

Verified 2026-09-30T03:56:00.3962732Z: main remains `b017384dbcd433ab34e8c432e2a5d4a94846e6e2`. Latest successful Pages run remains [36020594915](https://github.com/AbbyUsesAIThatCodes/ThreeKindsOfLevers/actions/runs/36020594915), updated 2026-09-24T15:31:20Z. Live index.html SHA256 before and after: `2E86A82D20D68B8121909C418F08518A73770C902EEA1B3C1ADCAC8F63583552`. The Pages workflow file is unchanged. All four PRs are open drafts with no auto-merge. No main push, merge, deployment dispatch, settings change or hosted preview was performed. Drafts skipped the costly Actions test job; builds and evidence are local.

The owner controls merging after review. Exact order: **#6 -> #7 -> #8 -> #9**. For a straightforward stack integration, merge #6 into main, then retarget #7 to main and merge, then #8, then #9. Keep task branches until the stack is complete. Use merge commits to preserve ancestry; if choosing squash/rebase, inspect the next retargeted diff carefully. Do not merge a later PR into an old task branch by accident. Each main merge can trigger the existing Pages workflow; nothing here performs that action.

Restart on Jess_PC from STATUS.md and docs/checkpoints/04-INTEGRATION.md. The isolated source checkout and detached snapshots remain saved. Preserve clean snapshot revisions and consumed ledger entries. Reuse these frozen packages for retesting; a code change needs a newly reserved build ordinal. Reports added after compilation do not alter the frozen site assets.

## Known Boundaries and Asset Handoff

This remains a controlled 12-degree ideal motion demonstration, not measured force, acceleration or physical assembly evidence. Room dimensions and camera framing are estimates. At 320 x 568, narrow subtitles wrap inside their cards. Touch swipes through the overflow Quiz panel were verified: reveal controls, select class and middle role, submit, see correct feedback, and swipe back to the top without moving the page or lever. Tiny screens use a scrollable activity. CI runs without a coordinated PR allocator are explicitly local-scoped; no persistent/distributed counter service was installed. No accepted codename has been invented.

[Asset Manifest](ASSET-MANIFEST.md): reusable candidates are the six code-native diagrams in src/examples.js and the Desk_Pair_*, ExitPushBar and FireExtinguisher groups in src/classroom/. Current runtime revision (CSS phone fix only; shared assets unchanged from d3d647fd204cebd9ac94d652fbada434a08d7a90): `c567ddf0612dd25501144809031e0c4daf929753`. Third-party attribution is retained. EdugamesGraphicsStorage indexes were not changed; the coordinating parent owns that separate update.
