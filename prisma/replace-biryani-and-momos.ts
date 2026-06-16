import { PrismaClient } from "@prisma/client";
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const SOURCE_DIR = "C:\\Users\\sayye\\.gemini\\antigravity\\brain\\bf301cdf-b633-40e3-bd6e-02be6ad842cd";

const targets = [
  {
    name: "Veg Biryani (Half)",
    source: path.join(SOURCE_DIR, "media__1781618774035.jpg"),
    fileName: "firdaus-veg-biryani-half.jpg"
  },
  {
    name: "Chk Tandoori Momos",
    source: path.join(SOURCE_DIR, "media__1781618818131.jpg"),
    fileName: "firdaus-chk-tandoori-momos.jpg"
  }
];

async function main() {
  console.log("🚀 Replacing Veg Biryani (Half) and Chk Tandoori Momos images in database...");

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

  console.log("🏁 Completed image updates!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
