# Modes Checkpoint

Issue #2, branch `overnight/curriculum-modes`, starting at baseline `b017384dbcd433ab34e8c432e2a5d4a94846e6e2`; plan checkpoint `fbec23c`.

Implemented Play preservation/reset; five guided lessons; eight quiz checks with class plus middle role, hidden live answers, separate first-attempt/retry counts and explicit model limits. Original R01 DOCX was read locally: SHA256 `589d656cf5bd99b1bedc307da2d77df5181fe978b54650b7b5761c584089cc1a`.

Validation: all nine model/learning tests pass. Existing full browser regression passes on local headless Edge with software WebGL: all classes, lift directions, actual 3D and label dragging, keyboard movement, mirror, orbit, stable canvas, 1024/1366 desktop and 390 portrait/844 landscape, storage, reduced motion, WebGL fallback and no external assets. Separate learning browser script exercises new mode/quiz behavior.

Remaining sequence: construction/example checks (#3), classroom (#4), final identity/package/QA (#5). Current `dist` is a temporary development test output, not the final identified deliverable. No Pages workflow change, main push, deployment or merge. New instructions permit tonight's draft PRs; user merges manually after testing.
