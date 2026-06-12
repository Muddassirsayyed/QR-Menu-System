// prisma/seed-chinese.ts
// Run: npx tsx prisma/seed-chinese.ts
// Creates a new Chinese restaurant with all menu items from the JSON

import { PrismaClient } from "@prisma/client";
import { generateQRCode } from "../lib/qrcode";

const prisma = new PrismaClient();

const SLUG = "dragon-wok";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const CATEGORIES = [
  { name: "Noodles & Chowmein", slug: "noodles-chowmein", icon: "🍜", sortOrder: 1 },
  { name: "Fried Rice",         slug: "fried-rice",       icon: "🍚", sortOrder: 2 },
  { name: "Starters & Dry",     slug: "starters-dry",     icon: "🥡", sortOrder: 3 },
  { name: "Gravy & Combos",     slug: "gravy-combos",     icon: "🥘", sortOrder: 4 },
];

const ITEMS: Record<string, { name: string; isVeg: boolean }[]> = {
  "noodles-chowmein": [
    { name: "Veg Hakka Noodles",          isVeg: true  },
    { name: "Veg Schezwan Noodles",       isVeg: true  },
    { name: "Veg Garlic Noodles",         isVeg: true  },
    { name: "Veg Chili Garlic Noodles",   isVeg: true  },
    { name: "Veg Singapore Noodles",      isVeg: true  },
    { name: "Veg Hong Kong Noodles",      isVeg: true  },
    { name: "Veg American Chopsuey",      isVeg: true  },
    { name: "Veg Chinese Chopsuey",       isVeg: true  },
    { name: "Egg Hakka Noodles",          isVeg: false },
    { name: "Egg Schezwan Noodles",       isVeg: false },
    { name: "Chicken Hakka Noodles",      isVeg: false },
    { name: "Chicken Schezwan Noodles",   isVeg: false },
    { name: "Chicken Garlic Noodles",     isVeg: false },
    { name: "Chicken Chili Garlic Noodles", isVeg: false },
    { name: "Chicken Singapore Noodles", isVeg: false },
    { name: "Chicken Hong Kong Noodles", isVeg: false },
    { name: "Chicken American Chopsuey", isVeg: false },
    { name: "Chicken Chinese Chopsuey",  isVeg: false },
    { name: "Mix Hakka Noodles",          isVeg: false },
    { name: "Mix Schezwan Noodles",       isVeg: false },
    { name: "Veg Pan Fried Noodles",      isVeg: true  },
  ],
  "fried-rice": [
    { name: "Veg Fried Rice",             isVeg: true  },
    { name: "Veg Schezwan Fried Rice",    isVeg: true  },
    { name: "Veg Burnt Garlic Fried Rice",isVeg: true  },
    { name: "Veg Ginger Fried Rice",      isVeg: true  },
    { name: "Veg Singapore Fried Rice",   isVeg: true  },
    { name: "Veg Hong Kong Fried Rice",   isVeg: true  },
    { name: "Veg Mushroom Fried Rice",    isVeg: true  },
    { name: "Veg Paneer Fried Rice",      isVeg: true  },
    { name: "Egg Fried Rice",             isVeg: false },
    { name: "Egg Schezwan Fried Rice",    isVeg: false },
    { name: "Egg Garlic Fried Rice",      isVeg: false },
    { name: "Chicken Fried Rice",         isVeg: false },
    { name: "Chicken Schezwan Fried Rice",isVeg: false },
    { name: "Chicken Garlic Fried Rice",  isVeg: false },
    { name: "Chicken Ginger Fried Rice",  isVeg: false },
    { name: "Chicken Singapore Fried Rice",isVeg: false },
    { name: "Chicken Hong Kong Fried Rice",isVeg: false },
    { name: "Chicken Tikka Fried Rice",   isVeg: false },
    { name: "Mix Fried Rice",             isVeg: false },
    { name: "Mix Schezwan Fried Rice",    isVeg: false },
    { name: "Veg Pot Rice",               isVeg: true  },
  ],
  "starters-dry": [
    { name: "Veg Manchurian Dry",         isVeg: true  },
    { name: "Veg Spring Roll",            isVeg: true  },
    { name: "Crispy Veg",                 isVeg: true  },
    { name: "Paneer 65",                  isVeg: true  },
    { name: "Paneer Chili Dry",           isVeg: true  },
    { name: "Paneer Manchurian Dry",      isVeg: true  },
    { name: "Mushroom Chili Dry",         isVeg: true  },
    { name: "Mushroom Manchurian Dry",    isVeg: true  },
    { name: "Veg Crispy Lollipop",        isVeg: true  },
    { name: "Potato Chili Dry",           isVeg: true  },
    { name: "Honey Chili Potato",         isVeg: true  },
    { name: "Chicken Crispy",             isVeg: false },
    { name: "Chicken Lollipop",           isVeg: false },
    { name: "Chicken Chili Dry",          isVeg: false },
    { name: "Chicken Manchurian Dry",     isVeg: false },
    { name: "Chicken 65",                 isVeg: false },
    { name: "Chicken Garlic Dry",         isVeg: false },
    { name: "Chicken Ginger Dry",         isVeg: false },
    { name: "Chicken Black Pepper Dry",   isVeg: false },
    { name: "Chicken Spring Roll",        isVeg: false },
    { name: "Chicken Schezwan Lollipop",  isVeg: false },
  ],
  "gravy-combos": [
    { name: "Veg Manchurian Gravy",           isVeg: true  },
    { name: "Paneer Chili Gravy",             isVeg: true  },
    { name: "Veg Garlic Gravy",               isVeg: true  },
    { name: "Veg Schezwan Gravy",             isVeg: true  },
    { name: "Mushroom Chili Gravy",           isVeg: true  },
    { name: "Veg Triple Schezwan Rice",       isVeg: true  },
    { name: "Veg Triple Schezwan Noodles",    isVeg: true  },
    { name: "Chicken Chili Gravy",            isVeg: false },
    { name: "Chicken Manchurian Gravy",       isVeg: false },
    { name: "Chicken Garlic Gravy",           isVeg: false },
    { name: "Chicken Ginger Gravy",           isVeg: false },
    { name: "Chicken Schezwan Gravy",         isVeg: false },
    { name: "Chicken Hot Garlic Gravy",       isVeg: false },
    { name: "Chicken Triple Schezwan Rice",   isVeg: false },
    { name: "Chicken Triple Schezwan Noodles",isVeg: false },
    { name: "Egg Chili Gravy",                isVeg: false },
    { name: "Mix Triple Schezwan Rice",       isVeg: false },
    { name: "Veg Sherpa Rice",                isVeg: true  },
    { name: "Chicken Sherpa Rice",            isVeg: false },
  ],
};

async function main() {
  console.log("🌱 Seeding Chinese restaurant...");

  const menuUrl = `${APP_URL}/menu/${SLUG}`;
  const qrDataUrl = await generateQRCode(menuUrl);

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: SLUG },
    update: {},
    create: {
      name: "Dragon Wok Chinese Restaurant",
      slug: SLUG,
      description: "Authentic Chinese & Indo-Chinese cuisine. Noodles, fried rice, and much more.",
      address: "Shop No. 5, Main Market, Mumbai",
      phone: "+91 98765 00001",
      email: "hello@dragonwok.com",
      isActive: true,
      qrCodes: { create: { qrDataUrl, menuUrl, totalScans: 0 } },
    },
  });
  console.log("✅ Restaurant:", restaurant.name);

  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { restaurantId_slug: { restaurantId: restaurant.id, slug: cat.slug } },
      update: {},
      create: { ...cat, restaurantId: restaurant.id },
    });

    const items = ITEMS[cat.slug] || [];
    for (const item of items) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          price: 0, // Admin can update prices from dashboard
          isVeg: item.isVeg,
          isAvailable: true,
          isFeatured: false,
          categoryId: category.id,
        },
      });
    }
    console.log(`✅ ${cat.name}: ${items.length} items`);
  }

  console.log("\n🎉 Done!");
  console.log(`🍜 Menu URL: /menu/${SLUG}`);
  console.log("⚠️  Prices are set to ₹0 - update them from Dashboard → Menu");
}

main().catch(console.error).finally(() => prisma.$disconnect());
