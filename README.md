# D.A.D. — Digital Archive Department

An internal-looking digital archive interface, built as the front for a Minecraft ARG. The site presents itself as a real institutional records system first; the story is inferred by the visitor from records, gaps, and inconsistencies rather than stated outright.

## Structure

- `index.html` — landing / boot terminal. Also the public site's clearance-code gate (see below).
- `archive.html` — searchable record index.
- `record.html?id=XXXX` — record detail view (metadata, body, linked media, access log). Records with `ACCESS DENIED` status or `ADMIN ONLY` classification render a denial screen instead of contents. Records marked hidden are omitted from the index but remain reachable by direct link.
- `admin/` — separate, unlinked archive management panel (passphrase-gated) for creating/editing records, toggling visibility, and uploading or replacing linked video per record. Reachable directly at `/admin/index.html`, or via a hidden trigger phrase typed into the archive search box (searches normally otherwise; see `ADMIN_TRIGGER` in `assets/js/archive.js`).
- `assets/css/` — public site styling; `admin/admin.css` — management panel styling.
- `assets/js/store.js` — seed record data plus a `localStorage`/`IndexedDB`-backed data layer (no backend server).
- `assets/js/gate.js` — public-site clearance-code gate shared by `index.html`, `archive.html`, and `record.html`.

## Public site access gate

`archive.html` and `record.html` redirect to `index.html` unless a clearance code has been entered this session. The code is: **********

This is a client-side, thematic gate only (the code lives in `assets/js/gate.js`, visible to anyone who reads the page source) — it fits the ARG's "internal terminal" framing but is not real access control. To change the code, edit the `CODE` constant in `assets/js/gate.js`. The separate `admin/` panel has its own, unrelated passphrase, set in `admin/admin.js`.

## Running locally

No build step. Serve the folder with any static file server, e.g.:

```
python3 -m http.server 8080
```

then open `http://localhost:8080/index.html`.

Opening the files directly via `file://` may prevent `IndexedDB` (used for uploaded video) from working consistently across pages — use a local server instead.

## Deploying on Cloudflare Pages (with a custom domain)

This is a static site (no build step), so Cloudflare Pages needs almost no configuration:

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**, and select this repository.
2. Framework preset: **None**. Build command: leave empty. Build output directory: `/` (repo root).
3. Deploy. Cloudflare gives you a free `*.pages.dev` URL immediately.
4. To use your own domain: open the new Pages project → **Custom domains → Set up a custom domain**, and enter your domain.
   - If the domain's nameservers already point to Cloudflare (i.e. the domain is already active in the same Cloudflare account), it attaches in a few seconds.
   - If not, Cloudflare will walk you through pointing the domain's nameservers to Cloudflare first, then attaching it.

No environment variables or server-side functions are used, so there is nothing else to configure.

## Notes

- All admin edits (new/edited/hidden/deleted records, uploaded video) are stored client-side in the visitor's own browser via `localStorage` and `IndexedDB`. There is no shared backend, so changes make in one browser are not visible from another.
- The admin passphrase is a thematic gate only, not real authentication — do not rely on it to protect anything sensitive.
