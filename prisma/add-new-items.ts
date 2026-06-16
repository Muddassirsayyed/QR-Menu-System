import { PrismaClient } from "@prisma/client";
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const SOURCE_DIR = "C:\\Users\\sayye\\.gemini\\antigravity\\brain\\bf301cdf-b633-40e3-bd6e-02be6ad842cd";

const itemsToAdd = [
  // 1. Chk Masala Lollipop
  {
    name: "Chk Masala Lollipop",
    price: 290,
    isVeg: false,
    categorySlug: "pizza-burger-momos",
    source: path.join(SOURCE_DIR, "media__1781622090301.jpg"),
    fileName: "firdaus-chk-masala-lollipop.jpg"
  },
  // 2. Chk Oil Fry Lollipop
  {
    name: "Chk Oil Fry Lollipop",
    price: 260,
    isVeg: false,
    categorySlug: "pizza-burger-momos",
    source: path.join(SOURCE_DIR, "media__1781622183566.jpg"),
    fileName: "firdaus-chk-oil-fry-lollipop.jpg"
  },
  // 3. Chk Singapuri Rice
  {
    name: "Chk Singapuri Rice",
    price: 200,
    isVeg: false,
    categorySlug: "rice-noodles",
    source: path.join(SOURCE_DIR, "media__1781622258777.png"),
    fileName: "firdaus-chk-singapuri-rice.jpg"
  },
  // 4. Chk Schezwan Rice (Full)
  {
    name: "Chk Schezwan Rice (Full)",
    price: 200,
    isVeg: false,
    categorySlug: "rice-noodles",
    source: path.join(SOURCE_DIR, "media__1781622324836.jpg"),
    fileName: "firdaus-chk-schezwan-rice-full.jpg"
  },
  // 5. Chk Schezwan Rice (Half)
  {
    name: "Chk Schezwan Rice (Half)",
    price: 110,
    isVeg: false,
    categorySlug: "rice-noodles",
    source: path.join(SOURCE_DIR, "media__1781622324836.jpg"),
    fileName: "firdaus-chk-schezwan-rice-half.jpg"
  },
  // 6. Chk Triple Rice
  {
    name: "Chk Triple Rice",
    price: 250,
    isVeg: false,
    categorySlug: "rice-noodles",
    source: path.join(SOURCE_DIR, "media__1781622386747.jpg"),
    fileName: "firdaus-chk-triple-rice.jpg"
  },
  // 7. Chk Masala (Quarter)
  {
    name: "Chk Masala (Quarter)",
    price: 220,
    isVeg: false,
    categorySlug: "indian-cuisine",
    source: path.join(SOURCE_DIR, "media__1781622542253.png"),
    fileName: "firdaus-chk-masala-quarter.jpg"
  },
  // 8. Chk Masala (Half)
  {
    name: "Chk Masala (Half)",
    price: 420,
    isVeg: false,
    categorySlug: "indian-cuisine",
    source: path.join(SOURCE_DIR, "media__1781622542253.png"),
    fileName: "firdaus-chk-masala-half.jpg"
  },
  // 9. Chk Masala (Full)
  {
    name: "Chk Masala (Full)",
    price: 800,
    isVeg: false,
    categorySlug: "indian-cuisine",
    source: path.join(SOURCE_DIR, "media__1781622542253.png"),
    fileName: "firdaus-chk-masala-full.jpg"
  }
];

async function main() {
  console.log("🚀 Starting to add new menu items to Firdaus Hotel...");

  const publicDir = path.join(process.cwd(), "public");
  const menuDir = path.join(publicDir, "images", "menu");
  const thumbDir = path.join(menuDir, "thumbnails");

  const restaurantSlug = "firdaus-hotel";

  for (const item of itemsToAdd) {
    console.log(`\n⚙️ Processing: ${item.name}`);

    // Verify source image
    if (!fs.existsSync(item.source)) {
      console.error(`❌ Source image not found at: ${item.source}`);
      continue;
    }

    const localPath = path.join(menuDir, item.fileName);
    const localThumbPath = path.join(thumbDir, item.fileName);
    const imageUrl = `/images/menu/${item.fileName}`;

    try {
      // Find category
      const category = await prisma.category.findUnique({
        where: {
          restaurantId_slug: {
            restaurantId: (await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } }))?.id || "",
            slug: item.categorySlug
          }
        }
      });

      if (!category) {
        console.error(`❌ Category with slug ${item.categorySlug} not found in restaurant ${restaurantSlug}`);
        continue;
      }

      // Read, resize, and optimize main image
      const jimpImg = await Jimp.read(item.source);
      jimpImg.resize({ w: 800 });
      await jimpImg.write(localPath as any);
      console.log(`  ✅ Main image saved: ${localPath}`);

      // Resize and save thumbnail
      jimpImg.resize({ w: 200 });
      await jimpImg.write(localThumbPath as any);
      console.log(`  ✅ Thumbnail saved: ${localThumbPath}`);

      // Check if item already exists under this category to avoid duplicates
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: category.id
        }
      });

      if (existingItem) {
        // Update existing item
        await prisma.menuItem.update({
          where: { id: existingItem.id },
          data: {
            price: item.price,
            isVeg: item.isVeg,
            imageUrl
          }
        });
        console.log(`  🔄 Updated existing item: ${item.name} in DB`);
      } else {
        // Create new item
        await prisma.menuItem.create({
          data: {
            name: item.name,
            price: item.price,
            isVeg: item.isVeg,
            imageUrl,
            isAvailable: true,
            categoryId: category.id
          }
        });
        console.log(`  🆕 Created new item: ${item.name} in DB`);
      }

    } catch (e) {
      console.error(`  ❌ Failed to process ${item.name}:`, e);
    }
  }

  console.log("\n🏁 Finished adding new menu items!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
