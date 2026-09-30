# Build Identity Inventory

## Authoritative Records

- `release.json`: preserves `0.1.0` as development and the existing storage compatibility. No accepted codename was present in baseline history. `Unassigned` is an explicit placeholder, not a newly accepted release name.
- `scripts/build-identity.mjs`: reserves an ordinal, captures UTC once, fingerprints source inputs, and creates one manifest. Full revision and dirty state are retained.
- `build/ledger.json`: tracked durable attempt ledger. `.build-state/ledger.json` and an exclusive atomic lock serialize builds from all worktrees through the primary checkout. Failed attempts retain their ordinals.
- This session is the sole allocator for these PR scopes. Commit/push reservations after each packaging checkpoint. Before another machine/clone builds the same PR, fetch the latest ledger and coordinate allocator ownership. An unavailable shared ledger requires an explicit local scope; never guess a PR ordinal.

## Surfaces

| Surface | Implementation | Verification |
| --- | --- | --- |
| Local build entrypoint | `npm run build` → `scripts/build.mjs` | Full ID at start and success/failure; embedded manifest and report |
| PR snapshot packaging | `scripts/package-snapshot.mjs SOURCE_DIRECTORY pr-N` | Clean detached source snapshot; separate packager revision/fingerprint; frozen output folder named with full ID |
| UI | `assets/build-identity.js` injected at build time | Persistent selectable Comic Sans footer; wrapping and reserved layout space |
| Artifact | `review-packages/<full ID>/` and matching ZIP | Manifest, filename, launcher console, UI, report must match |
| Report | `site/BUILD-REPORT.txt`, `site/build-manifest.json` | Generated from the same immutable manifest |
| Current review | `docs/CURRENT-REVIEW.md` | Points to preserved artifacts; does not trigger a rebuild just to change report metadata |
| Source provenance | Source SHA/dirty flag/input SHA256; packager SHA/fingerprint | Source fingerprints cover src/public/scripts/package files/release record |
| PR descriptions | Exact snapshot commit, build ID and download link | Updated after local verification/upload |
| Production | Separate main/Pages evidence in final report | No production action in this task |
| CI | Existing entrypoint emits metadata; draft job skips | Uncoordinated CI is explicitly `local-ci-<run>-<attempt>`, not a fabricated PR ordinal. Distributed PR counter service is not installed. |
| IDE/native targets | No separate IDE/native export entrypoint exists here | Not applicable |

## Commands

Use Node.js 22+. Install the locked dependencies once with `npm ci`.

```powershell
$env:BUILD_SCOPE = 'local-review'
npm run build
npm run dev
```

For a known approved PR, supply its actual `pr-N` scope only after synchronizing the ledger. The package script adds a metadata overlay/launcher to an exact game source snapshot; it never pretends that packaging code was already part of an older PR.

Reopening, copying, downloading, testing and serving an existing package preserve its ID. Building again reserves a new ordinal. An interrupted reservation stays consumed. Do not delete a live allocator lock; establish that its process has stopped before recovering a stale lock. Do not reset the ledger after checkout or rebase.

Allocator tests cover concurrent reservations, failure retention, separate PR counters and recovery from tracked state. Browser checks compare the actual delivered UI/manifest/report. No generated artifact or private photo is committed to git.
