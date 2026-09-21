# D.A.D. — Lore & Project Notes

Internal reference for continuing this project in a fresh session (Claude Code or otherwise) without re-explaining everything. This file is part of the public repo, so **no passphrases or access codes are written here** — see "Where the secrets live" at the bottom.

## Concept

D.A.D. ("Digital Archive Department") is the front for a Minecraft ARG. The public site presents itself as a real internal records system; the visitor is meant to piece the story together from records, redactions, and inconsistencies rather than being told outright what D.A.D. is or wants. Never state D.A.D.'s motive directly in site copy — only imply it through documents.

## Timeline anchor

Cardb0ard_D4wn plays on **Minecraft 1.17.1** (released June 8, 2021). His arc runs from mid-June to mid-August 2021. All record dates in `assets/js/store.js` are chronologically consistent with this — check this anchor before adding new records or events.

## The core premise

- D.A.D. secretly studies people using modified Minecraft worlds delivered as if they were ordinary files, without the subject's knowledge or consent.
- Selection criteria (Record 1155): candidates must have **zero prior Minecraft experience** — experienced players spot the planted content too fast. Delivered worlds are set to Peaceful (no mob interference) and include a starter kit.
- Dawn is one such candidate — selected via the standard process (Records 1142, 1150) — but is later given an unusual, non-standard assignment: retrieve the *entire* numbered disc set, not just one (Record 1158). The real reason why is sealed in the admin-only Record 1161, never shown to the visitor.

## The disc mystery

- **Disc 11** ("DISC-11" in-universe) behaves normally at first, but during Dawn's first session, playback diverges partway through into an unlisted track logged only as **ELEVEN** — distinct from the disc's normal reference audio. An unattributed log string, `RECORDING SYNCHRONIZED`, appears at the same instant. Dawn destroys the jukebox in fright and remembers none of it afterward.
- A much earlier witness (Record 1152, corrupted/redacted) describes Disc 11 as "not a sound" and stops calling it "eleven," implying he no longer believes that's its real name.
- **Disc 12** was fully withdrawn from circulation (Record 1153); **Disc 13** was quietly replaced with a different track (Record 1154). Neither reason is stated.
- A separate, unrelated individual's encounter with a disc (Record 1151, not Dawn) is what first alerted D.A.D. that disc activity had resumed, prompting them to reopen candidate recruitment (leading to Dawn's selection).

## Planned future addition

The user wants to eventually work **the Farlands** (the old Minecraft far-terrain generation anomaly, found at extreme distances from spawn) into the story. Not yet implemented — when it's added, keep it consistent with the 1.17.1 anchor above (Farlands is reachable in 1.17 via non-standard means, so no version conflict).

## Record index (as of this writing)

| ID | Title | Subject | Notes |
|---|---|---|---|
| 0002 | Department Charter (Excerpt) | N/A | Bureaucratic non-explanation of D.A.D.'s purpose |
| 0871 | Prior Candidate — Closeout | [REDACTED] | Fully redacted; implies Dawn isn't the first subject |
| 1142 | Candidate Pool — Batch 3 | [REDACTED] | Dawn selected here |
| 1150 | Pre-Contact Profile | Cardb0ard_D4wn | Confirms zero prior Minecraft exposure |
| 1151 | Disc Eleven — Renewed Activity (Unmonitored) | [REDACTED] | NOT Dawn — the trigger event for reopening the candidate search |
| 1152 | Disc Eleven — Recovered Statement | [REDACTED] | Corrupted; earlier witness's statement about the disc |
| 1153 | Disc Twelve — Withdrawal Notice | N/A | Bureaucratic; disc pulled from circulation |
| 1154 | Disc Thirteen — Substitution Log | N/A | Bureaucratic; disc swapped for another track |
| 1155 | Selection Criteria — Retrieval Candidates | N/A | Standing protocol; zero-exposure requirement |
| 1156 | First Encounter | Cardb0ard_D4wn | The jukebox/disc scene; video record |
| 1157 | Second Session | Cardb0ard_D4wn | Corrupted; subject starts to suspect something |
| 1158 | Assignment Directive — Full-Set Retrieval | Cardb0ard_D4wn | Escalates Dawn to retrieving all 3 discs |
| 1161 | Deviation Report | Cardb0ard_D4wn | ADMIN ONLY / ACCESS DENIED — the real rationale, never shown |
| 1163 | Operator Notes — Unofficial | Cardb0ard_D4wn | Hidden from the public index; personal note from an operator |

## Site structure

- Public site: `index.html` (clearance-code gate + landing), `archive.html` (record index), `record.html?id=` (record detail).
- Admin panel: `admin/index.html`, `admin/edit.html` — separate passphrase, not linked anywhere on the public site. Also reachable via a hidden trigger phrase typed into the archive search box (see `ADMIN_TRIGGER` in `assets/js/archive.js`) — normal searches still work as expected.
- Data layer: `assets/js/store.js` (seed records + `localStorage`/`IndexedDB` overrides, no backend).
- Deploys as a static site via Cloudflare (see `wrangler.toml` and the README's deploy section).

## Where the secrets live (not restated here)

- Public site clearance code: `CODE` constant in `assets/js/gate.js`.
- Admin panel passphrase: `PASSPHRASE` constant in `admin/admin.js`.
- Hidden admin search trigger phrase: `ADMIN_TRIGGER` constant in `assets/js/archive.js`.
