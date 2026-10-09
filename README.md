# Three Kinds of Levers

**[Play ThreeKindsOfLevers Online](https://abbyusesaithatcodes.github.io/ThreeKindsOfLevers/)**

Explore, construct and classify levers in a cartoon version of the classroom.

- **Play:** freely move Effort, Fulcrum and Load, try each class, mirror the arrangement and apply effort.
- **Learn:** follow 14 guided activities, construct each class and locate roles in six pictured real-world configurations.
- **Quiz:** classify all six role orderings, build each class, locate roles in the examples and check motion/model limits. First attempts and corrected retries stay separate.

Drag hardware or its label, use label arrow keys, or open **Move Parts**. Orbit, zoom, **Side View**, **Fit View** and **Room View** keep the 3D canvas full-window. Bold vocabulary opens a reference without hover panels intercepting clicks. Comic Sans uses the licensed Comic Neue fallback where needed.

## Play a Review Build

See [Current Review](docs/CURRENT-REVIEW.md) for the exact integrated package and separate PR snapshots. Extract the whole package and double-click **Start Review.cmd** on Jess_PC, or run `node serve-review.mjs` with Node.js 22+. Open `http://127.0.0.1:43163/`. No dependency installation, hosting account or external runtime requests are needed for a packaged build. Stop that server before opening another snapshot, or set a different `PORT`.

## Build Locally

```sh
npm ci
npm run build
npm run dev
```

Open `http://127.0.0.1:4173/`. Serve `dist/` over HTTP; opening HTML directly does not work. Every compile reserves a new identity; reopening an existing package preserves it. Read [Build Identity](docs/BUILD_IDENTITY.md) before creating a PR-scoped artifact.

```sh
npm test
node tests/browser.mjs
node tests/learning-browser.mjs
node tests/classroom-browser.mjs
```

`CHROMIUM_EXECUTABLE` may select an existing Edge/Chromium. `BROWSER_SOFTWARE_GL=1` enables software WebGL for headless checks. Local QA uses task-owned browser processes and ports 43160–43162. `REVIEW_ROOT` selects an already-built package's `site` directory.

## Curriculum and Model Scope

The [coverage matrix](docs/CURRICULUM-COVERAGE.md) preserves the approved EES 2.2.1 R01 sources, local audit IDs and missing evidence. Digital construction rehearses arrangement design; it does not certify physical assembly or full-course mastery.

This is a **controlled 12-degree motion demonstration** with a massless beam/attachments and frictionless axle. Motion is not measured force or acceleration. The gold arrow shows downward gravitational force even while the load rises. See [Teacher Notes](docs/TEACHER-NOTES.md).

The room reuses ClassroomVirtualization source with privately inspected photo references. It contains four separate pale desk tops in two pairs, a visible exit push bar and a recognizable extinguisher. The requested bar is a readable teaching detail, not measured photo-exact hardware. Apparatus scale conversion does not alter lever logic. See [Asset Manifest](docs/ASSET-MANIFEST.md), [Classroom Reference](docs/CLASSROOM-REFERENCE.md) and [Third-Party Notices](THIRD_PARTY_NOTICES.md).

No accounts or tracking. Play arrangement storage retains the existing key; lesson and quiz progress stays in the page session. Labeled diagram controls remain available if WebGL or storage fails.

## Review and Publishing

The overnight stack stays draft and isolated from production. No task branch deploys Pages. The unchanged Pages workflow runs on `main` pushes or manual dispatch; the owner will test and decide what to merge. Do not dispatch a deployment or change Pages settings as part of this review.
