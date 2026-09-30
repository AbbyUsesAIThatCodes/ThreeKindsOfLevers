# Three Kinds of Levers - Teacher Notes

## The Instructional Target

Use [Curriculum Coverage](CURRICULUM-COVERAGE.md) for the approved EES 2.2.1 R01 source register, direct/inferred distinctions and gaps. Its Gxx labels are local audit targets, not official standards. Digital arrangement building rehearses design and does not establish physical construction mastery.

**Play** preserves free exploration. **Learn** guides role recognition, three actual constructions and six pictured operating configurations. **Quiz** requires the class and middle role, actual construction, and three located roles in examples. Initial answers are recorded separately from corrected retries. Editing a response clears its visible feedback; it never changes the original first-attempt record. The fixed motion question locks arrangement editing while leaving Apply Effort available.

Students identify **Effort**, **Fulcrum**, and **Load** and classify a lever by
which role lies between the other two. Start with the presets, apply effort,
then reverse or rearrange them. A lever's class does not depend on which way
the camera faces or whether the fulcrum is on the left or right.

| Class | Middle role | Effort motion while load rises | Familiar example |
|---|---|---|---|
| First | Fulcrum | Down | Seesaw |
| Second | Load | Up | Wheelbarrow |
| Third | Effort | Up | One arm of tweezers |

For tweezers, examine one arm: the joined end is its fulcrum, the fingers apply
effort along the arm, and its tip acts on the load. The physical tweezers may
push inward/downward; orientation does not determine class. The on-screen
apparatus always demonstrates raising a downward load.

## Controls

- Drag a collar, load, support, or floating label along the beam.
- **Move parts** gives a selected-role slider and left/right buttons. Label
  arrow keys and buttons follow the current screen direction. The slider
  follows beam coordinates from its original left end to its right end.
- **Reverse arrangement** mirrors all three points.
- Mountings snap every 25 mm on a 600 mm beam, within ±250 mm of the center.
  Points stay at least 75 mm apart so hardware does not overlap. Moving to a
  new arrangement may require moving another part inward first; an endpoint
  cannot be crossed if there is no free space beyond it.
- **Apply effort** lifts the load; **Return to level** reverses that animation.
  Editing a position returns the apparatus to level. Escape cancels a drag.
- Background drag or Orbit rotates the camera. Side view and Fit view restore
  useful perspectives. The canvas keeps its size when overlays open.

## Modeling Boundaries

The beam is ideal and massless; the supports, collars, and effort handle have
no modeled weight. The axle has no friction. A single gold weight supplies the
downward load, while a teal arrow indicates an externally applied effort.
The load's gold force arrow stays downward as the load rises.

Apply effort is a **controlled motion demonstration** of a 12° rotation. It is
not a prediction of acceleration, an adjustable force simulation, or proof that
equal effort is sufficient in every configuration. In a third-class lever the
effort needed is greater than the load force. Second class reduces the needed
effort force; first class depends on the arm lengths. These ratios are tested
internally but deliberately not added as student-facing calculations here.

The fulcrum is fixed in place during each lift. Repositioning it is an editing
operation, not part of the mechanical motion. The hanging weight and effort
handle stay vertical; force arrows remain vertical under rotation. This is
not a calibrated VEX build or physical validation of classroom hardware.

## Accessibility and Resilience

Labels and guide lines preserve role identity during camera orbit. Color is
paired with text. Presets, motion, and position controls work with the keyboard.
The middle role and class are announced after a class change. Reduced motion
switches between static endpoints. A labeled SVG diagram is available if WebGL
is unavailable; blocked localStorage does not prevent use.

All assets are local. No network dependencies are needed after the initial
site load. No students, curriculum packets, or classroom records are included.

## Verification

`npm test` checks presets, mirrors, legal mounting positions, keyboard crossing,
and effort/load torque direction and movement for every legal arrangement.
`npm run test:browser` exercises the rendered game, camera, controls, mobile
layout, persistence, reduced motion, and WebGL/storage fallback. It saves
screenshots to `artifacts/`. The additional learning and classroom suites cover actual construction, example roles, stale-feedback regressions, locked motion, keyboard progression, touch emulation and room details. Draft PRs skip the Actions job; exact local package evidence is recorded in the current review.

Browser verification is separate from physical verification. This prototype
still benefits from the teacher's classroom review before student use.
