import { PrismaClient } from "@prisma/client";
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const itemsToUpdate = [
  {
    name: "Tikka Fry",
    url: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&q=80",
    fileName: "tikka-fry.jpg"
  },
  {
    name: "Triple Noodles",
    url: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80",
    fileName: "triple-noodles.jpg"
  },
  {
    name: "Chicken Kaiyi Special Noodles",
    url: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80",
    fileName: "chicken-kaiyi-special-noodles.jpg"
  }
];

async function main() {
  console.log("🚀 Starting image update process for missing menu items...");

  const publicDir = path.join(process.cwd(), "public");
  const menuDir = path.join(publicDir, "images", "menu");
  const thumbDir = path.join(menuDir, "thumbnails");

  if (!fs.existsSync(menuDir)) fs.mkdirSync(menuDir, { recursive: true });
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

  for (const item of itemsToUpdate) {
    const localPath = path.join(menuDir, item.fileName);
    const localThumbPath = path.join(thumbDir, item.fileName);
    const assignedUrl = `/images/menu/${item.fileName}`;

    console.log(`📥 Downloading image for: ${item.name} from ${item.url}`);
    try {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      const jimpImg = await Jimp.read(buffer);

      // Save main optimized image
      jimpImg.resize({ w: 800 });
      await jimpImg.write(localPath as any); // cast for typescript if needed
      console.log(`✅ Main image saved to: ${localPath}`);

      // Save thumbnail
      jimpImg.resize({ w: 200 });
      await jimpImg.write(localThumbPath as any);
      console.log(`✅ Thumbnail saved to: ${localThumbPath}`);

      // Update in database
      const updateResult = await prisma.menuItem.updateMany({
        where: {
          name: item.name,
          category: {
            restaurant: {
              slug: "kai-kabila-mqai1nqp"
            }
          }
        },
        data: {
          imageUrl: assignedUrl
        }
      });
      console.log(`⚙️ Updated ${updateResult.count} database entries for: ${item.name}`);

    } catch (error) {
      console.error(`❌ Failed to update image for ${item.name}:`, error);
    }
  }

  console.log("🏁 Image update process complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
