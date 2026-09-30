# Classroom Reference and Reuse

The classroom builder, layout and procedural textures are adapted from [ClassroomVirtualization](https://github.com/AbbyUsesAIThatCodes/ClassroomVirtualization/tree/1f25638e64861424a52f8bf381cea2a247cfe74e), commit `1f25638e64861424a52f8bf381cea2a247cfe74e`. The generic four-mesh EdugamesGraphicsStorage backdrop was inspected through the coordinating source review and is not the photo-reconstructed room. Existing apparatus geometry is preserved rather than replaced by historical screenshots.

## Original Photos Inspected

Consumer-local Library materialization verified readable bytes on Jess_PC, followed by direct pixel inspection:

- `1000008853.jpg`: long cream block room, dark front door, window, wooden cabinet benches, red/yellow stools, right teaching wall.
- `1000008855.jpg`: four pale gray/off-white tops in two pairs; independent dark aprons, legs and lower shelves; visible center seams.
- `1000008854.jpg` and `1000008856.jpg`: upright red extinguisher left of the prep doorway, white sleeve label, silver neck/lever, curved black hose and dark mounting band.

These photos remain private references outside this checkout. No photo pixels, identifying labels, student work, or private room markings are distributed. Background text is generic.

## Bounded Changes

- Reuse the source room and its cream block walls, baseboards, tile, benches, slotted stools, ViewBoard, whiteboard, and quiet color palette.
- Replace three oversized lab-table objects with exactly four independent white-topped desks in two pairs. Each has its own legs, apron and shelf; each pair has a visible seam.
- Keep the window-wall exit solid dark gray and add a projecting push bar with two distinct mounts. This detail is explicitly requested by the owner: lower hardware is partly obscured in source photos, so its dimensions are not asserted as photo-exact. The rear door retains its different latch/window-cover treatment.
- Replace the minimal extinguisher marker with a named rounded body, white wrap, silver neck/squeeze lever, gauge, dark band/bracket and curved hose.
- Use toon shading and simplified procedural texture noise. Keep the lever's controls and colors prominent.
- Keep only the prep doorway and shallow recess; no new interior reconstruction.

## Units and Camera

Room source units are metres. The existing apparatus geometry uses 25 mm per scene unit, so the room is scaled by 40 and translated to place the apparatus on the near desk pair. `model.js` positions and lever equations are unchanged. The ceiling is a cutaway for an orbiting teaching camera; walls behind an outside camera can hide to keep the apparatus visible. Room View provides a wider classroom view; Fit View returns to the apparatus.

The room's dimensions remain estimates, not a survey or photogrammetric reconstruction. Mobile camera framing and source dimensions are visual approximations.
