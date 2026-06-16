import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.menuItem.findMany({
    where: {
      OR: [
        { name: { contains: "Lollipop" } },
        { name: { contains: "lollipop" } },
        { name: { contains: "lollopop" } }
      ]
    },
    include: {
      category: {
        include: {
          restaurant: true
        }
      }
    }
  });

  console.log("=== Existing Lollipop Items ===");
  for (const item of items) {
    console.log(`Restaurant: ${item.category.restaurant.name} (Slug: ${item.category.restaurant.slug})`);
    console.log(`  Category: ${item.category.name} (Slug: ${item.category.slug})`);
    console.log(`  Item: ${item.name} | Price: ${item.price}`);
  }

  // Also print all categories of Firdaus Hotel and Kai Kabila to see where it would fit best
  const restaurants = await prisma.restaurant.findMany({
    where: {
      slug: { in: ["firdaus-hotel", "kai-kabila-mqai1nqp"] }
    },
    include: {
      categories: true
    }
  });

  console.log("\n=== Restaurant Categories ===");
  for (const r of restaurants) {
    console.log(`Restaurant: ${r.name} (${r.slug})`);
    for (const c of r.categories) {
      console.log(`  Category: ${c.name} (${c.slug})`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
