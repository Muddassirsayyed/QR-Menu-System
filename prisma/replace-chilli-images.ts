import { PrismaClient } from "@prisma/client";
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const SOURCE_PANEER = "C:\\Users\\sayye\\.gemini\\antigravity\\brain\\bf301cdf-b633-40e3-bd6e-02be6ad842cd\\media__1781616904039.jpg";
const SOURCE_SOYABEAN = "C:\\Users\\sayye\\.gemini\\antigravity\\brain\\bf301cdf-b633-40e3-bd6e-02be6ad842cd\\media__1781616966775.jpg";

async function main() {
  console.log("🌶️ Replacing Paneer Chilli and Soyabean Chilli images in database and filesystem...");

  const publicDir = path.join(process.cwd(), "public");
  const menuDir = path.join(publicDir, "images", "menu");
  const thumbDir = path.join(menuDir, "thumbnails");

  const targets = [
    {
      name: "Paneer Chilli",
      source: SOURCE_PANEER,
      fileName: "firdaus-paneer-chilli.jpg"
    },
    {
      name: "Soyabean chilli",
      source: SOURCE_SOYABEAN,
      fileName: "firdaus-soyabean-chilli.jpg"
    }
  ];

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

  console.log("🏁 Completed Chilli images replacement!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
