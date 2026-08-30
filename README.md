# gregoregan.com

Portfolio site for Gregor Egan — graphic designer, photographer and sound artist
based in Los Angeles. Photography, book design and typography.

Live at **[gregoregan.com](https://gregoregan.com)**.

## Stack

Static HTML. No build step, no framework, no package manager. Each page is a
single `.html` file with its own inline `<style>` and `<script>`.

The only third-party code is [Masonry](https://masonry.desandro.com/) 4.2.2 and
[imagesLoaded](https://imagesloaded.desandro.com/) 5.0.0, vendored under
`vendor/` (both MIT) and loaded with `defer`.

## Pages

| Path | Page | Images |
|---|---|---|
| `index.html` | Homepage — full-bleed hero | `BLUR.jpg` |
| `photos/` | Hub linking to digital + analog | — |
| `digital/` | Digital photography | `photos webp/photo webp/digital/` |
| `analog/` | Film photography | `photos webp/photo webp/analog/` |
| `design/` | Graphic design and covers | `design webp/` |
| `artists/` | Artist portraits | `artists/` |

Every gallery is a masonry grid with a click-through lightbox.

## Adding images

Images are **not** auto-discovered — each one is a hardcoded `<img>` tag in the
relevant `index.html`. A file dropped into a folder stays invisible until an
entry is added.

1. Resize to a max of 2560px on the long edge and encode as webp, quality 85:

   ```
   magick in.jpg -resize 2560x2560\> -quality 85 -define webp:method=6 out.webp
   ```

2. Drop it in the folder for that gallery.
3. Add an `<img>` tag with `width` and `height` set to the file's real pixel
   dimensions. The grid lazy-loads, so without them the layout reflows as
   images arrive.

Two things to watch for: folder names contain spaces, so paths need
percent-encoding in HTML (`photos%20webp/...`) and quoting in the shell; and `&`
in a filename must be written `&amp;` inside a `src` attribute.

The film scans in `photos webp/photo webp/analog/` are 1920px and already under
the cap — leave them as they are rather than re-encoding lossy over grain.

## Theme

Light and dark share one `localStorage` key, `theme`. Each page picks its own
default (`digital`, `analog` and `design` are light-first; `artists` and `photos`
are dark-first) and an explicit choice overrides it everywhere. The homepage has
no toggle.

Each themed page resolves the theme in an inline `<head>` script that runs before
first paint, which is what keeps the wrong theme from flashing on load.

## Local preview

Serve from the repo root so root-absolute paths resolve:

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy

GitHub Pages from `main`; `CNAME` points at `gregoregan.com`. **Pushing to `main`
publishes the live site** — there is no staging. The rebuild takes a minute or two.

## Contact

[gregor.art@pm.me](mailto:gregor.art@pm.me) · [instagram](https://www.instagram.com/gregor.egan)
