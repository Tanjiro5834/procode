# ProCode — Desktop (Electron)

This wraps the ProCode web app (`index.html` + `css/` + `js/` + `data/`) in
Electron so it runs as a standalone desktop app. The web app itself is
untouched — Electron just loads `index.html` from disk instead of a server.

## Run it locally (development)

```bash
npm install
npm start
```

This opens a window running the app. `Ctrl/Cmd+R` reloads, `Ctrl/Cmd+Shift+I`
opens DevTools (both wired up in `main.js`'s View menu).

## Before building installers: add the fonts

The app self-hosts Lora, Inter, and Caveat for offline use — see
`fonts/README.md` for the one-time step to download them. Skipping this
isn't fatal: the app falls back to system fonts and still works, but won't
match the original design until the font files are in place.

## Build installers

```bash
npm run dist:win     # → release/ProCode Setup <version>.exe (NSIS installer)
npm run dist:mac     # → release/ProCode-<version>.dmg (macOS, run on a Mac)
npm run dist:linux   # → release/ProCode-<version>.AppImage
```

Or `npm run dist` to build for whatever platform you're currently on.

**Cross-compiling notes:**
- Windows and Linux builds can both be produced from Windows or Linux.
- A `.dmg` requires building on macOS (Apple's tooling isn't licensed for
  cross-platform builds) — CI services like GitHub Actions with a
  `macos-latest` runner are the common workaround if you don't own a Mac.

## App icons

`electron-builder` is configured to look for:
- `build/icon.ico` (Windows, ≥256×256)
- `build/icon.icns` (macOS)
- `build/icon.png` (Linux, ≥512×512)

None exist yet — without them, electron-builder falls back to its own
default Electron icon. Drop your own artwork in `build/` using those exact
names to replace it before shipping.

## What Electron adds vs. the plain web app

- **Runs offline as a native window** — no browser chrome, no server needed.
- **`localStorage` persistence confirmed working** from `file://` context
  (this was the one real risk in this kind of wrap — verified during setup).
- **Single-instance lock** — launching a second copy just focuses the
  existing window, so you can't accidentally end up with two windows both
  writing to the same save data.
- Minimal native menu (View: reload/zoom/DevTools) — no File/Edit clutter
  for an app that doesn't need it yet.

## What's unchanged

Everything in `css/`, `js/`, and `data/` is exactly the web app — same
files, same behavior, same localStorage schema. If you keep developing the
web version in a browser, you can drop the updated files straight into this
folder (or symlink them) and `npm start` again with no other changes.
