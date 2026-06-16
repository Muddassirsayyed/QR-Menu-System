import { PrismaClient } from "@prisma/client";
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const SOURCE_DIR = "C:\\Users\\sayye\\.gemini\\antigravity\\brain\\bf301cdf-b633-40e3-bd6e-02be6ad842cd";

const targets = [
  {
    name: "Veg Fried Rice (Full)",
    source: path.join(SOURCE_DIR, "media__1781616706055.jpg"),
    fileName: "firdaus-veg-fried-rice-full.jpg"
  },
  {
    name: "Veg Fried Rice (Half)",
    source: path.join(SOURCE_DIR, "media__1781616706055.jpg"),
    fileName: "firdaus-veg-fried-rice-half.jpg"
  },
  {
    name: "Veg Hakka Noodles (Full)",
    source: path.join(SOURCE_DIR, "media__1781616815181.jpg"),
    fileName: "firdaus-veg-hakka-noodles-full.jpg"
  },
  {
    name: "Veg Hakka Noodles (Half)",
    source: path.join(SOURCE_DIR, "media__1781616815181.jpg"),
    fileName: "firdaus-veg-hakka-noodles-half.jpg"
  },
  {
    name: "Paneer Chilli",
    source: path.join(SOURCE_DIR, "media__1781616904039.jpg"),
    fileName: "firdaus-paneer-chilli.jpg"
  },
  {
    name: "Soyabean chilli",
    source: path.join(SOURCE_DIR, "media__1781616966775.jpg"),
    fileName: "firdaus-soyabean-chilli.jpg"
  },
  {
    name: "Veg Hot n Sour Soup",
    source: path.join(SOURCE_DIR, "media__1781617017489.jpg"),
    fileName: "firdaus-veg-hot-n-sour-soup.jpg"
  },
  {
    name: "Veg Manchow Soup",
    source: path.join(SOURCE_DIR, "media__1781617076815.jpg"),
    fileName: "firdaus-veg-manchow-soup.jpg"
  },
  {
    name: "Veg Manchurian",
    source: path.join(SOURCE_DIR, "media__1781617118347.jpg"),
    fileName: "firdaus-veg-manchurian.jpg"
  },
  {
    name: "Dal Fry",
    source: path.join(SOURCE_DIR, "media__1781617245096.jpg"),
    fileName: "firdaus-dal-fry.jpg"
  },
  {
    name: "Dal Tadka",
    source: path.join(SOURCE_DIR, "media__1781617330253.jpg"),
    fileName: "firdaus-dal-tadka.jpg"
  },
  {
    name: "Dal khichdi",
    source: path.join(SOURCE_DIR, "media__1781617378782.png"),
    fileName: "firdaus-dal-khichdi.jpg"
  },
  {
    name: "Mix Veg",
    source: path.join(SOURCE_DIR, "media__1781617398125.jpg"),
    fileName: "firdaus-mix-veg.jpg"
  },
  {
    name: "Sev Bhaji",
    source: path.join(SOURCE_DIR, "media__1781617428550.png"),
    fileName: "firdaus-sev-bhaji.jpg"
  },
  {
    name: "Jeera Rice (Full)",
    source: path.join(SOURCE_DIR, "media__1781617590440.jpg"),
    fileName: "firdaus-jeera-rice-full.jpg"
  },
  {
    name: "Jeera Rice (Half)",
    source: path.join(SOURCE_DIR, "media__1781617590440.jpg"),
    fileName: "firdaus-jeera-rice-half.jpg"
  },
  {
    name: "Plain Rice (Full)",
    source: path.join(SOURCE_DIR, "media__1781617614642.png"),
    fileName: "firdaus-plain-rice-full.jpg"
  },
  {
    name: "Plain Rice (Half)",
    source: path.join(SOURCE_DIR, "media__1781617614642.png"),
    fileName: "firdaus-plain-rice-half.jpg"
  }
];

async function main() {
  console.log("🚀 Replacing all user-provided menu images in database and filesystem...");

  const publicDir = path.join(process.cwd(), "public");
  const menuDir = path.join(publicDir, "images", "menu");
  const thumbDir = path.join(menuDir, "thumbnails");

  for (const target of targets) {
    if (!fs.existsSync(target.source)) {
      console.error(`❌ Source image not found for ${target.name} at: ${target.source}`);
      continue;
    }

    const localPath = path.join(menuDir, target.fileName);
    const localThumbPath = path.join(thumbDir, target.fileName);
    const assignedUrl = `/images/menu/${target.fileName}`;

    console.log(`⚙️ Processing: ${target.name} -> ${target.fileName}`);
    try {
      const jimpImg = await Jimp.read(target.source);

      // Save optimized main image
      jimpImg.resize({ w: 800 });
      await jimpImg.write(localPath as any);
      console.log(`  ✅ Main image saved: ${localPath}`);

      // Save optimized thumbnail
      jimpImg.resize({ w: 200 });
      await jimpImg.write(localThumbPath as any);
      console.log(`  ✅ Thumbnail saved: ${localThumbPath}`);

      // Update in DB
      const result = await prisma.menuItem.updateMany({
        where: {
          name: target.name,
          category: {
            restaurant: {
              slug: "firdaus-hotel"
            }
          }
        },
        data: {
          imageUrl: assignedUrl
        }
      });
      console.log(`  ⚙️ Updated ${result.count} database entries for: ${target.name}`);
    } catch (e) {
      console.error(`  ❌ Failed to process ${target.name}:`, e);
    }
  }

  console.log("🏁 Completed all image replacements!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
