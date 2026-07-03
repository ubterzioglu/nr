// OG görseli üretir: 1200x630, marka laciverti zemin, logo ortada.
// Kullanım: node scripts/generate-og.mjs
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const BRAND_DARK = { r: 5, g: 11, b: 26, alpha: 1 }; // #050B1A

const logo = await sharp("public/logo-transparent.png")
  .resize(900, 470, { fit: "inside" })
  .toBuffer();

const { width: logoW, height: logoH } = await sharp(logo).metadata();

await sharp({
  create: { width: WIDTH, height: HEIGHT, channels: 4, background: BRAND_DARK },
})
  .composite([
    {
      input: logo,
      left: Math.round((WIDTH - logoW) / 2),
      top: Math.round((HEIGHT - logoH) / 2),
    },
  ])
  .png()
  .toFile("public/og-image.png");

console.log(`public/og-image.png yazıldı (${WIDTH}x${HEIGHT}, logo ${logoW}x${logoH} ortada)`);
