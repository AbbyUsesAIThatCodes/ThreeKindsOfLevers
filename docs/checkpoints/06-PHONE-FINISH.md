# Phone Finish Checkpoint

Authorized follow-up to issue #5 / draft PR #9: allow the narrow Load subtitle to wrap inside its card while preserving the role label, and explicitly exercise the overflow Quiz panel with touch swipes at 320 x 568. No UI redesign or apparatus/classroom asset change.

The browser regression checks the complete subtitle's line bounds, swipes to reveal class and middle-role controls, selects both responses, swipes to Check Answer, submits by touch, verifies correct feedback, then swipes back to the question top. It also checks that neither the page nor lever arrangement moves during panel swipes.

Complete: the combined final package is `0.1.0_Unassigned_pr-9_build-003_20260930T035321Z_gc567ddf0612d_web-review`, clean runtime source `c567ddf0612dd25501144809031e0c4daf929753`. Its reservation is durable at `a04a9c9f9f20f52597d7eaab491557b9dc46c622`. All 13 logic tests, all three browser suites and the exact package launcher/identity check passed against build 003. The three requested display strings have exact browser assertions. The new touch-flow screenshots show controls, correct submission and return to the question top.

The existing Library ZIP and all three screenshot items were replaced with optimistic version guards from version 0 to version 1. IDs are unchanged; prior versions remain available. Download links stay in the private conversation handoff. Earlier PR #6/#7/#8 packages remain unchanged inside the new ZIP.

ZIP size: 11,251,958 bytes. SHA256: `5112a1a3386e2b36d8c927292f6fb95f1cced6d08cebf96a72d62cf9fdb72524`. It contains 35 exact-build evidence screenshots, plus the package smoke-test images. All four site trees are byte-identical to their tested package outputs. Current reports identify build 003; the original source-snapshot report is separately retained.

Production rechecked at 2026-09-30T03:56:00Z: main remains `b017384dbcd433ab34e8c432e2a5d4a94846e6e2`, Pages run `36020594915` remains unchanged, and live HTML SHA256 remains `2E86A82D20D68B8121909C418F08518A73770C902EEA1B3C1ADCAC8F63583552`. No production or shared graphics change. All PRs remain draft. Restart from CURRENT-REVIEW.md and this checkpoint; reuse build 003 for testing instead of rebuilding it.

Build 002 at `5346e84b150cb2205d4556e9b31ba9a789e71e14` passed the new touch flow and all previous suites. Before delivery, the owner additionally requested the three authored display strings Three Kinds Of Levers, How To Play and Look For The Middle. Those bounded copy changes require the next immutable build ordinal. Build 002 remains a preserved local candidate; it was not written to Library. Shared classroom/diagram source remains byte-identical to `d3d647fd204cebd9ac94d652fbada434a08d7a90`.
