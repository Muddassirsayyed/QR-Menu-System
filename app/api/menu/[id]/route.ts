// app/api/menu/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  imageUrl: z.string().optional(),
  isVeg: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  spiceLevel: z.number().min(0).max(3).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const data = updateSchema.parse(body);

  const item = await prisma.menuItem.update({ where: { id }, data });
  return NextResponse.json({ item });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
