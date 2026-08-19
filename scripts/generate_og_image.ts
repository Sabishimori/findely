import sharp from "sharp";
import fs from "fs";
import path from "path";

async function processNewScreenshot() {
  const publicDir = path.join(process.cwd(), "public");
  const rawScreenshotPath = path.join(publicDir, "og-raw.png");

  if (!fs.existsSync(rawScreenshotPath)) {
    console.error("Raw screenshot not found at:", rawScreenshotPath);
    return;
  }

  console.log("📸 Processing fresh live screenshot into high-res OpenGraph assets...");

  const image = sharp(rawScreenshotPath);
  const metadata = await image.metadata();
  console.log(`Live capture dimensions: ${metadata.width}x${metadata.height}`);

  // Resize and optimize to exact 1200x630
  const ogBuffer = await sharp(rawScreenshotPath)
    .resize(1200, 630, {
      fit: "cover",
      position: "top",
    })
    .png({ quality: 95 })
    .toBuffer();

  const ogPngPath = path.join(publicDir, "og-image.png");
  const twitterPngPath = path.join(publicDir, "twitter-image.png");
  const openGraphPath = path.join(publicDir, "opengraph-image.png");
  const ogJpgPath = path.join(publicDir, "og-image.jpg");

  fs.writeFileSync(ogPngPath, ogBuffer);
  fs.writeFileSync(twitterPngPath, ogBuffer);
  fs.writeFileSync(openGraphPath, ogBuffer);

  await sharp(ogBuffer)
    .jpeg({ quality: 92 })
    .toFile(ogJpgPath);

  // Clean up raw temp file
  try {
    fs.unlinkSync(rawScreenshotPath);
  } catch (e) {}

  console.log("✨ Updated all OpenGraph preview assets from fresh live screenshot!");
}

processNewScreenshot().catch(console.error);
