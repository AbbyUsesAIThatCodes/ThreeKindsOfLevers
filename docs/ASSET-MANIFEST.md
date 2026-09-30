# Asset Manifest

| Asset | Source / Revision | Use and Attribution | Shared Follow-Up |
| --- | --- | --- | --- |
| Existing lever apparatus and workshop support | MechanicalAdvantage `f316c49745a394e0dd100ff4e8d01c0ae4431286`, inherited ThreeKindsOfLevers baseline `b017384dbcd4` | Existing procedural geometry, three.js; retain third-party notices | No concurrent change to graphics-store index |
| Six lever operating diagrams | Original `src/examples.js`, this task | Code-native SVG, role/location text plus color; no copied photos or publisher figure pixels | Reusable export candidate for EdugamesGraphicsStorage; parent coordinates its dedicated update |
| Classroom source | ClassroomVirtualization `1f25638e64861424a52f8bf381cea2a247cfe74e` | `src/classroom/`; separate units conversion from mechanics; see CLASSROOM-REFERENCE.md | `Desk_Pair_*`, `ExitPushBar`, `FireExtinguisher` and toon materials are reuse candidates |

## Frozen Source for Shared Reuse

Use ThreeKindsOfLevers commit `d3d647fd204cebd9ac94d652fbada434a08d7a90` for the six original diagrams in `src/examples.js` and the classroom groups in `src/classroom/classroom.js`, with layout from `src/classroom/layout.js` and procedural textures from `src/classroom/textures.js`. The final integrated screenshots demonstrate this source. Later ledger/handoff commits do not change these files. Keep the existing role/location text with the SVG diagrams, and preserve ClassroomVirtualization attribution when exporting room components. The parent coordinates the dedicated EdugamesGraphicsStorage update; this task has not written its indexes.

## Private Reference Rules

The phone/copy follow-up's runtime source is `c567ddf0612dd25501144809031e0c4daf929753` (PR #9 build 003). Only CSS and the requested visible headings changed; `src/examples.js` and `src/classroom/` remain byte-identical to the frozen asset source above. No additional reusable asset export or shared index update is required for this follow-up.

Original classroom photos are design references only. Never commit them, use them as textures, or include identifiable photo crops in public evidence. Screenshots in the review package show only the reconstructed game. Real-object diagrams are explanatory configurations, not manufacturer CAD or physical-validation evidence.

## Banner And Camera Polish

PR #13 changes layout/framing only. The classroom and six example diagrams remain byte-identical to frozen asset source `d3d647fd204cebd9ac94d652fbada434a08d7a90`. No new reusable asset or shared-index write is needed.
