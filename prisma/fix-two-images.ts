import { PrismaClient } from "@prisma/client";
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const itemsToFix = [
  {
    name: "Chk Tandoori Momos",
    url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
    fileName: "firdaus-chk-tandoori-momos.jpg"
  },
  {
    name: "Veg Fried Rice (Half)",
    url: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=800&q=80",
    fileName: "firdaus-veg-fried-rice-half.jpg"
  }
];

async function main() {
  console.log("⚙️ Retrying failed downloads for Firdaus Hotel using validated URLs...");

  const publicDir = path.join(process.cwd(), "public");
  const menuDir = path.join(publicDir, "images", "menu");
  const thumbDir = path.join(menuDir, "thumbnails");

  for (const item of itemsToFix) {
    const localPath = path.join(menuDir, item.fileName);
    const localThumbPath = path.join(thumbDir, item.fileName);
    const assignedUrl = `/images/menu/${item.fileName}`;

    console.log(`📥 Downloading image for: ${item.name} from ${item.url}`);
    try {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      const jimpImg = await Jimp.read(buffer);

      jimpImg.resize({ w: 800 });
      await jimpImg.write(localPath as any);

      jimpImg.resize({ w: 200 });
      await jimpImg.write(localThumbPath as any);

      await prisma.menuItem.updateMany({
        where: {
          name: item.name,
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
      console.log(`✅ Fixed image for: ${item.name}`);
    } catch (e) {
      console.error(`❌ Failed to fix image for ${item.name}:`, e);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
