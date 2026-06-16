import { PrismaClient } from "@prisma/client";
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";
import { generateQRCode } from "../lib/qrcode";

const prisma = new PrismaClient();
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://qr-menu-system-production-f33f.up.railway.app";

const RESTAURANT_DATA = {
  name: "Firdaus Hotel",
  slug: "firdaus-hotel",
  description: "Delicious Dum Biryani, Momos, Pizza, Noodles & Indian Cuisine.",
  address: "hotel_firdaus0 (Instagram)",
  phone: "9225522665",
  email: "hello@firdaushotel.com",
  logoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80",
  coverUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
};

const menuData = [
  {
    categoryName: "Biryani",
    categorySlug: "biryani",
    categoryIcon: "🍲",
    sortOrder: 1,
    items: [
      { name: "Chk Dum Biryani (Full)", price: 220, isVeg: false, url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80" },
      { name: "Chk Dum Biryani (Half)", price: 110, isVeg: false, url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80" },
      { name: "Chk Tikka Biryani", price: 250, isVeg: false, url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80" },
      { name: "Firdaus special Chk Bir", price: 360, isVeg: false, url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80" },
      { name: "Veg Biryani (Full)", price: 200, isVeg: true, url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80" },
      { name: "Veg Biryani (Half)", price: 100, isVeg: true, url: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&q=80" },
      { name: "Veg Firdaus special Bir", price: 320, isVeg: true, url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80" }
    ]
  },
  {
    categoryName: "Pizza, Burger & Momos",
    categorySlug: "pizza-burger-momos",
    categoryIcon: "🍕",
    sortOrder: 2,
    items: [
      { name: "Veg Pizza (M)", price: 180, isVeg: true, url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80" },
      { name: "Veg Pizza (S)", price: 110, isVeg: true, url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80" },
      { name: "Chk Pizza (L)", price: 360, isVeg: false, url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80" },
      { name: "Chk Pizza (M)", price: 200, isVeg: false, url: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80" },
      { name: "Chk Burger", price: 130, isVeg: false, url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80" },
      { name: "Chk Fry Momos", price: 120, isVeg: false, url: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&q=80" },
      { name: "Chk Tandoori Momos", price: 150, isVeg: false, url: "https://images.unsplash.com/photo-1625220194771-7ebedd0b70b9?w=800&q=80" },
      { name: "Chk steam momos", price: 110, isVeg: false, url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80" },
      { name: "French Fries", price: 120, isVeg: true, url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80" }
    ]
  },
  {
    categoryName: "Rice & Noodles",
    categorySlug: "rice-noodles",
    categoryIcon: "🥢",
    sortOrder: 3,
    items: [
      { name: "Veg Fried Rice (Full)", price: 180, isVeg: true, url: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=800&q=80" },
      { name: "Veg Fried Rice (Half)", price: 100, isVeg: true, url: "https://images.unsplash.com/photo-1603133872878-df0568f70950?w=800&q=80" },
      { name: "Veg Hakka Noodles (Full)", price: 180, isVeg: true, url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80" },
      { name: "Veg Hakka Noodles (Half)", price: 100, isVeg: true, url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80" }
    ]
  },
  {
    categoryName: "Falooda",
    categorySlug: "falooda",
    categoryIcon: "🍧",
    sortOrder: 4,
    items: [
      { name: "Falooda", price: 60, isVeg: true, url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80" }
    ]
  },
  {
    categoryName: "Starter's (Veg)",
    categorySlug: "starters-veg",
    categoryIcon: "🥦",
    sortOrder: 5,
    items: [
      { name: "Veg Hot n Sour Soup", price: 120, isVeg: true, url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80" },
      { name: "Veg Manchow Soup", price: 120, isVeg: true, url: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80" },
      { name: "Soyabean chilli", price: 190, isVeg: true, url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80" },
      { name: "Veg Manchurian", price: 190, isVeg: true, url: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80" },
      { name: "Paneer Chilli", price: 270, isVeg: true, url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80" }
    ]
  },
  {
    categoryName: "Indian Cuisine",
    categorySlug: "indian-cuisine",
    categoryIcon: "🍛",
    sortOrder: 6,
    items: [
      { name: "Mix Veg", price: 210, isVeg: true, url: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&q=80" },
      { name: "Sev Bhaji", price: 150, isVeg: true, url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80" },
      { name: "Dal Fry", price: 160, isVeg: true, url: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&q=80" },
      { name: "Dal Tadka", price: 180, isVeg: true, url: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&q=80" },
      { name: "Dal khichdi", price: 180, isVeg: true, url: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&q=80" },
      { name: "Paneer Shahi Masala", price: 250, isVeg: true, url: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&q=80" },
      { name: "Paneer Butter Masala", price: 270, isVeg: true, url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80" },
      { name: "Veg Kolhapuri", price: 210, isVeg: true, url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80" }
    ]
  },
  {
    categoryName: "Rice",
    categorySlug: "rice",
    categoryIcon: "🍚",
    sortOrder: 7,
    items: [
      { name: "Jeera Rice (Full)", price: 110, isVeg: true, url: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80" },
      { name: "Jeera Rice (Half)", price: 90, isVeg: true, url: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80" },
      { name: "Plain Rice (Full)", price: 100, isVeg: true, url: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80" },
      { name: "Plain Rice (Half)", price: 80, isVeg: true, url: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80" }
    ]
  }
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("🚀 Seeding Firdaus Hotel...");

  const menuUrl = `${APP_URL}/menu/${RESTAURANT_DATA.slug}`;
  const qrDataUrl = await generateQRCode(menuUrl);

  // Clean old restaurant data if it exists
  const existing = await prisma.restaurant.findUnique({
    where: { slug: RESTAURANT_DATA.slug }
  });
  if (existing) {
    await prisma.restaurant.delete({ where: { slug: RESTAURANT_DATA.slug } });
    console.log(`🧹 Deleted existing ${RESTAURANT_DATA.name} entries`);
  }

  // Create Restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: RESTAURANT_DATA.name,
      slug: RESTAURANT_DATA.slug,
      description: RESTAURANT_DATA.description,
      address: RESTAURANT_DATA.address,
      phone: RESTAURANT_DATA.phone,
      email: RESTAURANT_DATA.email,
      logoUrl: RESTAURANT_DATA.logoUrl,
      coverUrl: RESTAURANT_DATA.coverUrl,
      isActive: true,
      qrCodes: {
        create: {
          qrDataUrl,
          menuUrl,
          totalScans: 0
        }
      }
    }
  });
  console.log(`🏢 Created Restaurant: ${restaurant.name} (ID: ${restaurant.id})`);

  const publicDir = path.join(process.cwd(), "public");
  const menuDir = path.join(publicDir, "images", "menu");
  const thumbDir = path.join(menuDir, "thumbnails");

  if (!fs.existsSync(menuDir)) fs.mkdirSync(menuDir, { recursive: true });
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

  for (const catData of menuData) {
    // Create Category
    const category = await prisma.category.create({
      data: {
        name: catData.categoryName,
        slug: catData.categorySlug,
        icon: catData.categoryIcon,
        sortOrder: catData.sortOrder,
        restaurantId: restaurant.id
      }
    });
    console.log(`📁 Created Category: ${category.name}`);

    for (const item of catData.items) {
      const itemSlug = "firdaus-" + slugify(item.name);
      const fileName = `${itemSlug}.jpg`;
      const localUrl = `/images/menu/${fileName}`;
      const localPath = path.join(menuDir, fileName);
      const localThumbPath = path.join(thumbDir, fileName);

      let assignedUrl = localUrl;

      console.log(`📥 Downloading image for: ${item.name}`);
      try {
        const res = await fetch(item.url);
        if (!res.ok) throw new Error("Fetch failed");
        const buffer = Buffer.from(await res.arrayBuffer());
        const jimpImg = await Jimp.read(buffer);

        // Compress and optimize
        jimpImg.resize({ w: 800 });
        await jimpImg.write(localPath as any);

        // Thumbnail
        jimpImg.resize({ w: 200 });
        await jimpImg.write(localThumbPath as any);
      } catch (error) {
        console.error(`❌ Failed to process image for ${item.name}, using fallback:`, error);
        assignedUrl = "/images/placeholder-food.jpg";
      }

      // Create MenuItem
      await prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          isVeg: item.isVeg,
          imageUrl: assignedUrl,
          isAvailable: true,
          categoryId: category.id
        }
      });
    }
  }

  console.log("🎉 Seeding of Firdaus Hotel completed successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
