# D.A.D. — Digital Archive Department

An internal-looking digital archive interface, built as the front for a Minecraft ARG. The site presents itself as a real institutional records system first; the story is inferred by the visitor from records, gaps, and inconsistencies rather than stated outright.

## Structure

- `index.html` — landing / boot terminal, links into the archive.
- `archive.html` — searchable record index.
- `record.html?id=XXXX` — record detail view (metadata, body, linked media, access log). Records with `ACCESS DENIED` status or `ADMIN ONLY` classification render a denial screen instead of contents. Records marked hidden are omitted from the index but remain reachable by direct link.
- `admin/` — separate, unlinked archive management panel (passphrase-gated: `OVERSEER-7`) for creating/editing records, toggling visibility, and uploading or replacing linked video per record.
- `assets/css/` — public site styling; `admin/admin.css` — management panel styling.
- `assets/js/store.js` — seed record data plus a `localStorage`/`IndexedDB`-backed data layer (no backend server).

## Running locally

No build step. Serve the folder with any static file server, e.g.:

```
python3 -m http.server 8080
```

then open `http://localhost:8080/index.html`.

Opening the files directly via `file://` may prevent `IndexedDB` (used for uploaded video) from working consistently across pages — use a local server instead.

## Notes

- All admin edits (new/edited/hidden/deleted records, uploaded video) are stored client-side in the visitor's own browser via `localStorage` and `IndexedDB`. There is no shared backend, so changes make in one browser are not visible from another.
- The admin passphrase is a thematic gate only, not real authentication — do not rely on it to protect anything sensitive.
