# Self-hosted fonts

This sandbox can't reach fonts.gstatic.com, so the .woff2 files aren't
bundled here. Do this once on your own machine before packaging:

1. Go to https://gwfh.mranftl.com/fonts (Google Webfonts Helper — gives
   direct .woff2 downloads without a build step).
2. For each font below, select it, tick only the weights listed, download,
   and drop the .woff2 files into this `fonts/` folder using these exact
   names (fonts.css already points at these):

   - Lora        → weights 500, 600, 700
     → Lora-Regular.woff2, Lora-SemiBold.woff2, Lora-Bold.woff2
   - Inter       → weights 400, 500, 600, 700
     → Inter-Regular.woff2, Inter-Medium.woff2, Inter-SemiBold.woff2, Inter-Bold.woff2
   - Caveat      → weight 600
     → Caveat-SemiBold.woff2

3. That's it — `fonts.css` is already wired into `index.html` and
   `tokens.css` already references these family names. No code changes
   needed once the files are in place.

Until you add these files, the app still works — it just falls back to
system serif/sans/cursive fonts (Georgia, system-ui, etc.) per the
fallback stacks in `css/tokens.css`. Nothing crashes either way.
