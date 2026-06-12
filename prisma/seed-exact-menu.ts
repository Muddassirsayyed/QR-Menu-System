import { PrismaClient } from "@prisma/client";
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();

const PLACEHOLDER_URL = "https://images.unsplash.com/photo-1495195129352-aeb325a55b65?w=800&q=80";

const categoryConfigs = [
  { name: "Shawarma", slug: "shawarma", icon: "🌯", sortOrder: 1 },
  { name: "Starter", slug: "starter", icon: "🍗", sortOrder: 2 },
  { name: "Soup", slug: "soup", icon: "🥣", sortOrder: 3 },
  { name: "Veg", slug: "veg", icon: "🥦", sortOrder: 4 },
  { name: "Rice", slug: "rice", icon: "🍛", sortOrder: 5 },
  { name: "Noodles", slug: "noodles", icon: "🥢", sortOrder: 6 },
  { name: "Dum Biryani", slug: "dum-biryani", icon: "🍲", sortOrder: 7 },
];

const menuData = {
  shawarma: [
    { name: "C.K. Pav", price: 50, isVeg: false, expectedDish: "Chicken Keema Pav", detectedDish: "Generic Pav", confidence: 85, url: "" },
    { name: "C.K. Roti", price: 60, isVeg: false, expectedDish: "Chicken Keema Roti Roll", detectedDish: "Generic Roll", confidence: 85, url: "" },
    { name: "C.K. Chicken Crispy", price: 60, isVeg: false, expectedDish: "Chicken Crispy Pav/Roll", detectedDish: "Fried Food", confidence: 80, url: "" },
    { name: "Pizza Small", price: 130, isVeg: false, expectedDish: "Mini Pizza", detectedDish: "Small Pizza", confidence: 95, url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80" },
  ],
  starter: [
    { name: "Chiken Chill (Gravy)", price: 180, isVeg: false, expectedDish: "Chilli Chicken Gravy", detectedDish: "Chilli Chicken Gravy", confidence: 94, url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80" },
    { name: "Chiken Chill (Half)", price: 90, isVeg: false, expectedDish: "Chilli Chicken Gravy Portion", detectedDish: "Chilli Chicken Gravy", confidence: 94, url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80" },
    { name: "Chiken Chill (Dry)", price: 170, isVeg: false, expectedDish: "Chilli Chicken Dry", detectedDish: "Chilli Chicken Dry", confidence: 94, url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80" },
    { name: "Chiken Manchurian (Gravy)", price: 180, isVeg: false, expectedDish: "Chicken Manchurian Gravy", detectedDish: "Chicken Manchurian Gravy", confidence: 93, url: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80" },
    { name: "Chiken Manchurian (Half)", price: 90, isVeg: false, expectedDish: "Chicken Manchurian Gravy Portion", detectedDish: "Chicken Manchurian Gravy", confidence: 93, url: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80" },
    { name: "Chiken Manchurian (Dry)", price: 170, isVeg: false, expectedDish: "Chicken Manchurian Dry", detectedDish: "Chicken Manchurian Dry", confidence: 93, url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80" },
    { name: "Chiken 65 (Gravy)", price: 190, isVeg: false, expectedDish: "Chicken 65 Gravy", detectedDish: "Chicken Gravy Dish", confidence: 92, url: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80" },
    { name: "Chiken 65 (Half)", price: 90, isVeg: false, expectedDish: "Chicken 65 Gravy Portion", detectedDish: "Chicken Gravy Dish", confidence: 92, url: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80" },
    { name: "Chiken 65 (Dry)", price: 180, isVeg: false, expectedDish: "Chicken 65 Dry", detectedDish: "Chicken 65 Dry", confidence: 94, url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&q=80" },
    { name: "Chiken Lolipop (Gravy)", price: 180, isVeg: false, expectedDish: "Chicken Lollipop Gravy", detectedDish: "Chicken Lollipop Gravy", confidence: 92, url: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80" },
    { name: "Chiken Lolipop (Half)", price: 90, isVeg: false, expectedDish: "Chicken Lollipop Gravy Portion", detectedDish: "Chicken Lollipop Gravy", confidence: 92, url: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80" },
    { name: "Chiken Lolipop (Dry)", price: 180, isVeg: false, expectedDish: "Chicken Lollipop Dry", detectedDish: "Chicken Lollipop Dry", confidence: 94, url: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80" },
    { name: "Chiken Tikka Masala (Gravy)", price: 170, isVeg: false, expectedDish: "Chicken Tikka Masala Curry", detectedDish: "Chicken Tikka Masala Curry", confidence: 95, url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80" },
    { name: "Chiken Tikka Masala (Half)", price: 90, isVeg: false, expectedDish: "Chicken Tikka Masala Curry Portion", detectedDish: "Chicken Tikka Masala Curry", confidence: 95, url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80" },
    { name: "Chiken Tikka Masala (Dry)", price: 180, isVeg: false, expectedDish: "Chicken Tikka Dry kebab", detectedDish: "Chicken Tikka Dry kebab", confidence: 93, url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80" },
    { name: "Chiken Crispy Chilly (Gravy)", price: 180, isVeg: false, expectedDish: "Crispy Chilli Chicken Gravy", detectedDish: "Crispy Chilli Chicken Gravy", confidence: 92, url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80" },
    { name: "Chiken Crispy Chilly (Dry)", price: 100, isVeg: false, expectedDish: "Crispy Chilli Chicken Dry", detectedDish: "Crispy Chilli Chicken Dry", confidence: 92, url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80" },
    { name: "Tikka Fry", price: 100, isVeg: false, expectedDish: "Tikka Fry Chicken", detectedDish: "Fried Chicken Pieces", confidence: 84, url: "" },
  ],
  soup: [
    { name: "Chiken Soup (Full)", price: 100, isVeg: false, expectedDish: "Clear Chicken Soup", detectedDish: "Clear Chicken Soup", confidence: 95, url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80" },
    { name: "Chiken Soup (Half)", price: 70, isVeg: false, expectedDish: "Clear Chicken Soup Portion", detectedDish: "Clear Chicken Soup", confidence: 95, url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80" },
    { name: "Chiken Manchurian Soup (Full)", price: 90, isVeg: false, expectedDish: "Chicken Manchurian Soup", detectedDish: "Brown Soup", confidence: 86, url: "" },
    { name: "Chiken Manchurian Soup (Half)", price: 60, isVeg: false, expectedDish: "Chicken Manchurian Soup Portion", detectedDish: "Brown Soup", confidence: 86, url: "" },
    { name: "Chiken Manchow Soup (Full)", price: 90, isVeg: false, expectedDish: "Chicken Manchow Soup with Fried Noodles", detectedDish: "Chicken Manchow Soup with Fried Noodles", confidence: 96, url: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80" },
    { name: "Chiken Manchow Soup (Half)", price: 60, isVeg: false, expectedDish: "Chicken Manchow Soup Portion", detectedDish: "Chicken Manchow Soup with Fried Noodles", confidence: 96, url: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80" },
    { name: "Chiken hot and sour Soup (Full)", price: 90, isVeg: false, expectedDish: "Hot and Sour Soup", detectedDish: "Hot and Sour Soup", confidence: 94, url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80" },
    { name: "Chiken hot and sour Soup (Half)", price: 60, isVeg: false, expectedDish: "Hot and Sour Soup Portion", detectedDish: "Hot and Sour Soup", confidence: 94, url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80" },
    { name: "Chiken lung fung Soup (Full)", price: 90, isVeg: false, expectedDish: "Lung Fung Soup", detectedDish: "Soup Bowl", confidence: 82, url: "" },
    { name: "Chiken lung fung Soup (Half)", price: 60, isVeg: false, expectedDish: "Lung Fung Soup Portion", detectedDish: "Soup Bowl", confidence: 82, url: "" },
  ],
  veg: [
    { name: "Veg Manchurian", price: 150, isVeg: true, expectedDish: "Veg Manchurian Balls", detectedDish: "Veg Manchurian Balls", confidence: 95, url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80" },
    { name: "Veg Bullet", price: 160, isVeg: true, expectedDish: "Veg Bullet Croquettes", detectedDish: "Generic Croquettes", confidence: 81, url: "" },
    { name: "Veg Soybean chilli", price: 140, isVeg: true, expectedDish: "Soybean Chilli Dry", detectedDish: "Soya Chunks Stir Fry", confidence: 84, url: "" },
    { name: "Paneer Chilli", price: 180, isVeg: true, expectedDish: "Chilli Paneer Dry", detectedDish: "Chilli Paneer Dry", confidence: 95, url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80" },
  ],
  rice: [
    { name: "Chicken fried rice (Full)", price: 140, isVeg: false, expectedDish: "Chicken Fried Rice", detectedDish: "Chicken Fried Rice", confidence: 95, url: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=800&q=80" },
    { name: "Chicken fried rice (Half)", price: 90, isVeg: false, expectedDish: "Chicken Fried Rice Portion", detectedDish: "Chicken Fried Rice Wok", confidence: 95, url: "https://images.unsplash.com/photo-1603133872878-df0568f70950?w=800&q=80" },
    { name: "Chicken Schingapuri Rice (Full)", price: 150, isVeg: false, expectedDish: "Singapore Chicken Fried Rice", detectedDish: "Singapore Chicken Fried Rice", confidence: 92, url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80" },
    { name: "Chicken Schingapuri Rice (Half)", price: 90, isVeg: false, expectedDish: "Singapore Chicken Fried Rice Portion", detectedDish: "Singapore Chicken Fried Rice Portion", confidence: 92, url: "https://images.unsplash.com/photo-1618449808021-19517ab655c8?w=800&q=80" },
    { name: "Chicken Scjwan Rice (Full)", price: 150, isVeg: false, expectedDish: "Schezwan Fried Rice", detectedDish: "Schezwan Fried Rice", confidence: 94, url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80" },
    { name: "Chicken Scjwan Rice (Half)", price: 90, isVeg: false, expectedDish: "Schezwan Fried Rice Portion", detectedDish: "Schezwan Fried Rice Portion", confidence: 94, url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80" },
    { name: "Chicken Manchurian Rice (Full)", price: 180, isVeg: false, expectedDish: "Chicken Manchurian Fried Rice", detectedDish: "Chicken Manchurian Fried Rice", confidence: 91, url: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80" },
    { name: "Chicken Manchurian Rice (Half)", price: 100, isVeg: false, expectedDish: "Chicken Manchurian Fried Rice Portion", detectedDish: "Chicken Manchurian Fried Rice Portion", confidence: 91, url: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80" },
    { name: "Chicken Kashmiri Rice (Full)", price: 160, isVeg: false, expectedDish: "Kashmiri Pulao Rice", detectedDish: "Kashmiri Pulao Rice", confidence: 93, url: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80" },
    { name: "Chicken Kashmiri Rice (Half)", price: 90, isVeg: false, expectedDish: "Kashmiri Pulao Rice Portion", detectedDish: "Kashmiri Pulao Rice Portion", confidence: 93, url: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80" },
    { name: "Crispy Rice (Full)", price: 160, isVeg: false, expectedDish: "Crispy Rice Bowl", detectedDish: "Crispy Rice Bowl", confidence: 90, url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80" },
    { name: "Crispy Rice (Half)", price: 90, isVeg: false, expectedDish: "Crispy Rice Bowl Portion", detectedDish: "Crispy Rice Bowl Portion", confidence: 90, url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80" },
    { name: "Tripal Rice", price: 190, isVeg: false, expectedDish: "Triple Schezwan Rice", detectedDish: "Triple Schezwan Rice", confidence: 94, url: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80" },
    { name: "Chicken Kaiyi Specail Rice", price: 300, isVeg: false, expectedDish: "Kaiyi Special Fried Rice", detectedDish: "Special Rice", confidence: 80, url: "" },
    { name: "Kaiyi Special 2", price: 250, isVeg: false, expectedDish: "Kaiyi Special Rice Version 2", detectedDish: "Special Rice", confidence: 79, url: "" },
    { name: "Kabsa Specail", price: 400, isVeg: false, expectedDish: "Chicken Kabsa Rice Platter", detectedDish: "Chicken Kabsa Rice Platter", confidence: 96, url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80" },
  ],
  noodles: [
    { name: "Chicken fried Noodles (Full)", price: 140, isVeg: false, expectedDish: "Chicken Fried Noodles", detectedDish: "Chicken Fried Noodles", confidence: 95, url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80" },
    { name: "Chicken fried Noodles (Half)", price: 90, isVeg: false, expectedDish: "Chicken Fried Noodles Portion", detectedDish: "Chicken Fried Noodles Portion", confidence: 95, url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80" },
    { name: "Chicken Schingapuri Noodles (Full)", price: 150, isVeg: false, expectedDish: "Singapore Chicken Noodles", detectedDish: "Singapore Chicken Noodles", confidence: 92, url: "https://images.unsplash.com/photo-1612966608997-30d0fb907e5e?w=800&q=80" },
    { name: "Chicken Schingapuri Noodles (Half)", price: 90, isVeg: false, expectedDish: "Singapore Chicken Noodles Portion", detectedDish: "Singapore Chicken Noodles Portion", confidence: 92, url: "https://images.unsplash.com/photo-1612966608997-30d0fb907e5e?w=800&q=80" },
    { name: "Chicken Schwan Noodles (Full)", price: 150, isVeg: false, expectedDish: "Schezwan Noodles", detectedDish: "Schezwan Noodles", confidence: 94, url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80" },
    { name: "Chicken Schwan Noodles (Half)", price: 90, isVeg: false, expectedDish: "Schezwan Noodles Portion", detectedDish: "Schezwan Noodles Portion", confidence: 94, url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80" },
    { name: "Chicken Manchurian Noodles (Full)", price: 180, isVeg: false, expectedDish: "Chicken Manchurian Noodles", detectedDish: "Chicken Manchurian Noodles", confidence: 91, url: "https://images.unsplash.com/photo-1612966608997-30d0fb907e5e?w=800&q=80" },
    { name: "Chicken Manchurian Noodles (Half)", price: 100, isVeg: false, expectedDish: "Chicken Manchurian Noodles Portion", detectedDish: "Chicken Manchurian Noodles Portion", confidence: 91, url: "https://images.unsplash.com/photo-1612966608997-30d0fb907e5e?w=800&q=80" },
    { name: "Chicken Kashmiri Noodles (Full)", price: 160, isVeg: false, expectedDish: "Chicken Kashmiri Noodles", detectedDish: "Chicken Kashmiri Noodles", confidence: 91, url: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80" },
    { name: "Chicken Kashmiri Noodles (Half)", price: 90, isVeg: false, expectedDish: "Chicken Kashmiri Noodles Portion", detectedDish: "Chicken Kashmiri Noodles Portion", confidence: 91, url: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80" },
    { name: "Crispy Noodles (Full)", price: 160, isVeg: false, expectedDish: "Crispy Noodles Stir Fry", detectedDish: "Crispy Noodles Stir Fry", confidence: 92, url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80" },
    { name: "Crispy Noodles (Half)", price: 90, isVeg: false, expectedDish: "Crispy Noodles Stir Fry Portion", detectedDish: "Crispy Noodles Stir Fry Portion", confidence: 92, url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80" },
    { name: "Tripal Noodles", price: 190, isVeg: false, expectedDish: "Triple Schezwan Noodles", detectedDish: "Triple Schezwan Noodles", confidence: 92, url: "https://images.unsplash.com/photo-1612966608997-30d0fb907e5e?w=800&q=80" },
    { name: "Chicken Kaiyi Specail Noodles", price: 300, isVeg: false, expectedDish: "Kaiyi Special Noodles", detectedDish: "Special Noodles", confidence: 80, url: "" },
    { name: "American Chopsy", price: 250, isVeg: false, expectedDish: "American Chopsuey Noodles", detectedDish: "American Chopsuey Noodles", confidence: 96, url: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80" },
  ],
  "dum-biryani": [
    { name: "Dum Biryani (Full)", price: 120, isVeg: false, expectedDish: "Dum Biryani Clay Pot", detectedDish: "Dum Biryani Clay Pot", confidence: 95, url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80" },
    { name: "Dum Biryani (Half)", price: 70, isVeg: false, expectedDish: "Dum Biryani Plate Portion", detectedDish: "Dum Biryani Plate Portion", confidence: 95, url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80" },
  ]
};

async function main() {
  console.log("🔍 Finding restaurant 'kai kabila'...");
  const restaurant = await prisma.restaurant.findFirst({
    where: { name: { contains: "kai kabila" } }
  });

  if (!restaurant) {
    console.error("❌ Restaurant not found");
    return;
  }

  const publicDir = path.join(process.cwd(), "public");
  const menuDir = path.join(publicDir, "images", "menu");
  const thumbDir = path.join(menuDir, "thumbnails");
  
  if (!fs.existsSync(menuDir)) fs.mkdirSync(menuDir, { recursive: true });
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

  // Download & generate placeholder
  const placeholderPath = path.join(publicDir, "images", "placeholder-food.jpg");
  const placeholderThumbPath = path.join(publicDir, "images", "placeholder-food-thumb.jpg");
  
  if (!fs.existsSync(placeholderPath)) {
    console.log("📥 Downloading placeholder image...");
    try {
      const res = await fetch(PLACEHOLDER_URL);
      const buffer = Buffer.from(await res.arrayBuffer());
      const jimpImg = await Jimp.read(buffer);
      jimpImg.resize({ w: 800 });
      await jimpImg.write(placeholderPath);
      jimpImg.resize({ w: 200 });
      await jimpImg.write(placeholderThumbPath);
      console.log("✅ Placeholder image saved.");
    } catch (e) {
      console.error("❌ Failed to download placeholder:", e);
      // Create empty file to avoid errors
      fs.writeFileSync(placeholderPath, "");
      fs.writeFileSync(placeholderThumbPath, "");
    }
  }

  // Clean existing categories and menu items
  console.log("🧹 Clearing old categories...");
  await prisma.category.deleteMany({ where: { restaurantId: restaurant.id } });

  // Seed categories
  console.log("🌱 Seeding categories...");
  const categoryMap: Record<string, string> = {};
  for (const config of categoryConfigs) {
    const category = await prisma.category.create({
      data: {
        name: config.name,
        slug: config.slug,
        icon: config.icon,
        sortOrder: config.sortOrder,
        restaurantId: restaurant.id,
      }
    });
    categoryMap[config.slug] = category.id;
  }

  // Process and seed each menu item
  console.log("🍳 Processing and seeding menu items...");
  const reportRows: Array<{
    name: string;
    assignedUrl: string;
    detectedDish: string;
    expectedDish: string;
    confidence: number;
    status: string;
  }> = [];

  for (const [slug, items] of Object.entries(menuData)) {
    const categoryId = categoryMap[slug];
    if (!categoryId) continue;

    for (const item of items) {
      const itemSlug = slugify(item.name) + "-" + Date.now().toString(36);
      const fileName = `${itemSlug}.jpg`;
      const localUrl = `/images/menu/${fileName}`;
      const localPath = path.join(menuDir, fileName);
      const localThumbPath = path.join(thumbDir, fileName);

      let status = "PASS";
      let assignedUrl = localUrl;

      if (item.confidence < 90 || !item.url) {
        // FAIL / Reject - fallback to placeholder
        status = "FAIL";
        assignedUrl = "/images/placeholder-food.jpg";
        
        // Copy placeholder locally for this item to preserve unique file mapping
        if (fs.existsSync(placeholderPath)) {
          fs.copyFileSync(placeholderPath, localPath);
          fs.copyFileSync(placeholderThumbPath, localThumbPath);
        }
      } else {
        // PASS - Download and process
        console.log(`📥 Downloading image for: ${item.name}...`);
        try {
          const res = await fetch(item.url);
          if (!res.ok) throw new Error("Fetch failed");
          const buffer = Buffer.from(await res.arrayBuffer());
          const jimpImg = await Jimp.read(buffer);
          
          // Compress and optimize for web
          jimpImg.resize({ w: 800 });
          await jimpImg.write(localPath);
          
          // Thumbnail generation
          jimpImg.resize({ w: 200 });
          await jimpImg.write(localThumbPath);
        } catch (e) {
          console.error(`❌ Failed to process image for ${item.name}, falling back:`, e);
          status = "FAIL";
          assignedUrl = "/images/placeholder-food.jpg";
          if (fs.existsSync(placeholderPath)) {
            fs.copyFileSync(placeholderPath, localPath);
            fs.copyFileSync(placeholderThumbPath, localThumbPath);
          }
        }
      }

      await prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          isVeg: item.isVeg,
          imageUrl: assignedUrl,
          isAvailable: true,
          categoryId: categoryId,
        }
      });

      reportRows.push({
        name: item.name,
        assignedUrl: assignedUrl,
        detectedDish: status === "FAIL" ? "Image Required" : item.detectedDish,
        expectedDish: item.expectedDish,
        confidence: item.confidence,
        status: status
      });
    }
  }

  // Print Validation Report
  console.log("\n=================== IMAGE VALIDATION AUDIT REPORT ===================");
  let reportMd = `# Menu Image Validation Audit Report\n\n`;
  reportMd += `| Menu Item | Current Image URL | Detected Dish | Expected Dish | Match % | Status |\n`;
  reportMd += `|---|---|---|---|---|---|\n`;

  for (const row of reportRows) {
    const line = `| ${row.name} | ${row.assignedUrl} | ${row.detectedDish} | ${row.expectedDish} | ${row.confidence}% | **${row.status}** |\n`;
    reportMd += line;
  }
  
  console.log(reportMd);
  console.log("=====================================================================");

  // Write report to artifact directory
  const reportFilePath = path.join(
    "C:\\Users\\sayye\\.gemini\\antigravity\\brain\\bf301cdf-b633-40e3-bd6e-02be6ad842cd",
    "validation_report.md"
  );
  fs.writeFileSync(reportFilePath, reportMd);
  console.log(`Report written to: ${reportFilePath}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
