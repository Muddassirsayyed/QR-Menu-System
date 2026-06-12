// app/api/menu/public/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  return NextResponse.json({ restaurant });
}
