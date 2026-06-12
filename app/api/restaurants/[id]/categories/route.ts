// app/api/restaurants/[id]/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  sortOrder: z.number().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const categories = await prisma.category.findMany({
    where: { restaurantId: id },
    include: { _count: { select: { menuItems: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ categories });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const data = createCategorySchema.parse(body);

  const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: `${slug}-${Date.now()}`,
      icon: data.icon,
      sortOrder: data.sortOrder ?? 0,
      restaurantId: id,
    },
  });

  return NextResponse.json({ category }, { status: 201 });
}
