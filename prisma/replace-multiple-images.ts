import { PrismaClient } from "@prisma/client";
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const SOURCE_DIR = "C:\\Users\\sayye\\.gemini\\antigravity\\brain\\bf301cdf-b633-40e3-bd6e-02be6ad842cd";

const targets = [
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
  }
];

async function main() {
  console.log("🚀 Replacing 5 menu item images in database and filesystem...");

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
      console.log(`✅ Main image saved: ${localPath}`);

      // Save optimized thumbnail
      jimpImg.resize({ w: 200 });
      await jimpImg.write(localThumbPath as any);
      console.log(`✅ Thumbnail saved: ${localThumbPath}`);

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
      console.log(`⚙️ Updated ${result.count} database entries for: ${target.name}`);
    } catch (e) {
      console.error(`❌ Failed to process ${target.name}:`, e);
    }
  }

  console.log("🏁 Completed all 5 menu image replacements!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
