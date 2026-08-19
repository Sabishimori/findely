import sharp from "sharp";
import fs from "fs";
import path from "path";

async function makeOgImage() {
  const inputPath = "C:/Users/ASUS/.gemini/antigravity/brain/c68b73c7-efab-454a-9861-b07fffd1e8ba/.user_uploaded/media_1787110114286.png";
  const publicDir = path.join(process.cwd(), "public");

  if (!fs.existsSync(inputPath)) {
    console.error("Input image not found:", inputPath);
    return;
  }

  console.log("📸 Processing hero screenshot into 1200x630 standard OpenGraph banner...");

  // Create 1200x630 OG banner with high quality
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  console.log(`Original dimensions: ${metadata.width}x${metadata.height}`);

  // Resize and fit to 1200x630 with high quality
  const ogBuffer = await sharp(inputPath)
    .resize(1200, 630, {
      fit: "contain",
      background: { r: 247, g: 249, b: 242, alpha: 1 }, // Findely soft canvas background
    })
    .png({ quality: 95 })
    .toBuffer();

  const ogPngPath = path.join(publicDir, "og-image.png");
  const ogJpgPath = path.join(publicDir, "og-image.jpg");
  const twitterPngPath = path.join(publicDir, "twitter-image.png");
  const openGraphPath = path.join(publicDir, "opengraph-image.png");

  fs.writeFileSync(ogPngPath, ogBuffer);
  console.log("✓ Saved:", ogPngPath);

  fs.writeFileSync(twitterPngPath, ogBuffer);
  console.log("✓ Saved:", twitterPngPath);

  fs.writeFileSync(openGraphPath, ogBuffer);
  console.log("✓ Saved:", openGraphPath);

  await sharp(ogBuffer)
    .jpeg({ quality: 92 })
    .toFile(ogJpgPath);
  console.log("✓ Saved:", ogJpgPath);

  console.log("✨ All OpenGraph social preview assets generated successfully!");
}

makeOgImage().catch(console.error);
