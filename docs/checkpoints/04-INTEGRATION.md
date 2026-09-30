# Integration Checkpoint

Issue #5; branch `overnight/integrated-review`, stacked on PR #8 at `80fcf28ec099a788cf29d335084594212c45cb34`.

Saved implementation starts at `10cfd138d29dc81b2b7a668568db652b2a88cef1`: durable build ordinals, immutable metadata, local snapshot packager/launcher, and the three review fixes. Response changes invalidate Quiz and Learn feedback without changing the first-attempt record. The fixed third-class motion question locks arrangement edits while Apply Effort remains usable. Activity navigation focuses an announced heading; lesson-picker changes restore picker focus.

The follow-up keeps a short phone screen's apparatus and labels above the scrollable activity and uses separate QA ports 43160–43162, with launcher 43163. Browser processes are task-owned and closed by their own handles only.

Validation at this checkpoint: 13 logic tests passed. Expanded learning browser tests passed on local integration build 003, including all 17 quiz items, actual constructions, first-attempt/retry separation, response invalidation, fixed motion, keyboard navigation, emulated touch/cancel, mode switching and four viewport sizes. The final package will be rerun through all suites after its immutable identity is reserved.

Next: open the authorized final draft against `overnight/classroom`, preserve clean detached snapshots for all four PRs, build each once, and run final browser checks using REVIEW_ROOT. Package source and packager source are reported separately. Commit the ledger after each packaging checkpoint. Never rebuild solely to refresh report text.

No merge, main push, deployment dispatch, auto-merge, Pages setting or shared graphics repository change. Final report must compare main revision, Pages run and live HTML against the saved baseline.
