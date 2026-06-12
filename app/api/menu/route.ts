// app/api/menu/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().optional(),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  spiceLevel: z.number().min(0).max(3).optional(),
  categoryId: z.string(),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const restaurantId = searchParams.get("restaurantId");

  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = categoryId;
  if (restaurantId) where.category = { restaurantId };

  const items = await prisma.menuItem.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    const item = await prisma.menuItem.create({ data });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
