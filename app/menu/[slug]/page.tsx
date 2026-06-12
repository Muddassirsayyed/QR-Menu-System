// app/menu/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MenuClient from "./MenuClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await prisma.restaurant.findUnique({ where: { slug } });
  if (!restaurant) return { title: "Menu Not Found" };
  return {
    title: `${restaurant.name} — Menu`,
    description: restaurant.description || `View the full menu for ${restaurant.name}`,
  };
}

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug, isActive: true },
    include: {
      categories: {
        include: {
          menuItems: {
            where: { isAvailable: true },
            orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!restaurant) notFound();

  return <MenuClient restaurant={restaurant} />;
}
