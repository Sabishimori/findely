import sharp from "sharp";
import fs from "fs";
import path from "path";

async function makeExactFindelyOgImage() {
  const publicDir = path.join(process.cwd(), "public");
  // The authentic Findely hero screenshot
  const heroScreenshot = "C:/Users/ASUS/.gemini/antigravity/brain/c68b73c7-efab-454a-9861-b07fffd1e8ba/.user_uploaded/media_1787110114286.png";

  if (!fs.existsSync(heroScreenshot)) {
    console.error("Hero screenshot not found at:", heroScreenshot);
    return;
  }

  console.log("📸 Generating official Findely OpenGraph preview from authentic hero screenshot...");

  const image = sharp(heroScreenshot);
  const metadata = await image.metadata();
  console.log(`Original dimensions: ${metadata.width}x${metadata.height}`);

  // Create clean, crisp 1200x630 banner with Findely background color
  const ogBuffer = await sharp(heroScreenshot)
    .resize(1200, 630, {
      fit: "contain",
      background: { r: 247, g: 249, b: 242, alpha: 1 }, // Findely canvas color #F7F9F2
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

  console.log("✨ SUCCESS: Generated authentic Findely OpenGraph preview assets (1200x630)!");
}

makeExactFindelyOgImage().catch(console.error);
