// Generates the app icon / favicon set from the brand source art in brand/.
// Sources are the high-res exports; run `npm run icons` after replacing them.
import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const glyph = path.join(root, "brand/glyph.png");
const wordmark = path.join(root, "brand/wordmark.png");
const out = (f) => path.join(root, "public/icons", f);

// Brand near-black (#0F1115), used to pad the maskable icon's safe zone.
const INK = { r: 15, g: 17, b: 21, alpha: 1 };

async function square(src, size, dest) {
  await sharp(src).resize(size, size, { fit: "cover" }).png().toFile(out(dest));
}

// Maskable icons get cropped to a circle/squircle on install, so the mark must
// sit inside a padded safe zone rather than bleeding to the edges.
async function maskable(src, size, inner, dest) {
  const pad = Math.round((size - inner) / 2);
  const resized = await sharp(src).resize(inner, inner, { fit: "cover" }).png().toBuffer();
  await sharp(resized)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: INK })
    .png()
    .toFile(out(dest));
}

await Promise.all([
  square(glyph, 512, "icon-512.png"),
  square(glyph, 192, "icon-192.png"),
  square(glyph, 180, "apple-touch-icon.png"),
  square(glyph, 64, "icon-64.png"),
  square(glyph, 32, "favicon-32.png"),
  square(glyph, 16, "favicon-16.png"),
  maskable(glyph, 512, 410, "icon-512-maskable.png"),
  sharp(wordmark).resize({ width: 1200 }).png().toFile(out("ephemeris-logo.png")),
]);

console.log("Icons generated in public/icons/");
