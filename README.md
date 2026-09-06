# ProCode

Learn Spring Boot and PHP fundamentals — offline-first, no account required.

This repo has two parts that share the same core app:

```
procode/
├── web/       ← the app itself (deployed to Vercel)
└── desktop/   ← Electron wrapper around a copy of web/
```

## web/

Plain HTML/CSS/JS, no build step, no backend. This is what's live on Vercel.

Vercel project settings: **Root Directory = `web`**, framework preset =
**Other** (no build command needed — it's already static).

## desktop/

An Electron shell that packages a **copy** of `web/`'s `css/`, `js/`,
`data/`, and `index.html` into a native Windows/Mac/Linux app. See
`desktop/README.md` for build instructions.

**Important — these are copies, not a shared reference.** If you change
lesson content or fix a bug in `web/`, you need to manually copy the
updated `css/`, `js/`, `data/`, and `index.html` into `desktop/` before
rebuilding the `.exe`/`.dmg`/`.AppImage`. See "Keeping web/ and desktop/
in sync" below.

## Keeping web/ and desktop/ in sync

After editing anything in `web/css`, `web/js`, `web/data`, or
`web/index.html`:

```bash
# from the repo root
cp -r web/css web/js web/data web/index.html desktop/
```

This won't touch `desktop/fonts/`, `desktop/main.js`, `desktop/preload.js`,
or `desktop/package.json` — those are desktop-only and don't exist in
`web/`. `web/fonts/` and `desktop/fonts/` should already match; if you add
or change a font, copy `web/fonts/fonts.css` into `desktop/fonts/` the
same way (the actual `.woff2` files should already be identical in both).

Then rebuild the desktop app per `desktop/README.md`.

## Local development

**Web:**
```bash
cd web
python3 -m http.server 8000   # or any static file server
```

**Desktop:**
```bash
cd desktop
npm install
npm start
```
