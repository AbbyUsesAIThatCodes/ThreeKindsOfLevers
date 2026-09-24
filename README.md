# Three Kinds of Levers

A classroom exploration of first-, second-, and third-class levers, using the shared 3D Lever Workshop environment.

## Explore

- Choose a first-, second-, or third-class lever.
- Read the **Effort**, **Fulcrum**, and **Load** labels, attached by guide lines.
- Apply effort to lift the load. The effort moves downward for first class and
  upward for second/third class. The gold arrow always shows the load's downward
  gravitational force, not its direction of travel.
- Drag any part or its label along the beam, including past the other parts.
  The middle role determines the class automatically.
- Use **Move parts** for keyboard-accessible position controls and **Reverse
  arrangement** to see that a mirrored lever keeps the same class.
- Orbit, zoom, use Side view, or return to Fit view in the familiar classroom.

This version is independent of both [Lever Workshop](https://github.com/AbbyUsesAIThatCodes/LeverWorkshop)
and [Mechanical Advantage](https://github.com/AbbyUsesAIThatCodes/MechanicalAdvantage).
It preserves the latest classroom environment and full-window canvas. Opening
panels and changing text never resize the 3D viewport.

## Run locally

Node.js 22 or later:

```sh
npm ci
npm run build
npm run dev
```

Open <http://localhost:4173/ThreeKindsOfLevers/> or <http://localhost:4173/>.
Serve `dist/` over HTTP; do not open the HTML through `file://`.

```sh
npm test
npx playwright install chromium
npm run test:browser
```

`BROWSER_SOFTWARE_GL=1` enables software WebGL for headless Linux.
`CHROMIUM_EXECUTABLE` can point to an existing Chromium. `PORT` changes the
local server port (default 4173).

## Model and classroom scope

This is an ideal **motion demonstration**, not a quantitative force simulator.
It treats the beam and attachments as massless and the axle as frictionless.
Apply effort animates a controlled 12-degree lift. The force directions and
movement relationships are correct; force magnitudes and acceleration are not
calculated. Read [the teacher notes](docs/TEACHER-NOTES.md) for assumptions,
examples, and verification.

The classroom and renderer were adapted from MechanicalAdvantage commit
`f316c49745a394e0dd100ff4e8d01c0ae4431286`. The three-class apparatus uses
procedural geometry, without the unused VEX CAD downloads. See
[third-party notices](THIRD_PARTY_NOTICES.md).

JavaScript, fonts, and all visuals are served locally. No accounts, tracking,
external runtime requests, or student data. The arrangement is stored in this
browser under its own key. If WebGL or storage is unavailable, the labeled
diagram and controls still work.

## Review and publishing

The implementation is delivered in a pull request before merging or publishing.
After review, merging to `main` runs the included **Deploy Pages** workflow.
Configure the repository's **Settings → Pages → Source** to **GitHub Actions**
before the first deployment. No deployment is claimed by this README.
