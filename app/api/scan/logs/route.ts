// app/api/scan/logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "25"));
  const search = searchParams.get("search") || "";
  const device = searchParams.get("device") || "";

  const where: Record<string, unknown> = {};

  if (device) where.deviceType = device;

  if (search) {
    where.OR = [
      { restaurant: { name: { contains: search } } },
      { country: { contains: search } },
      { city: { contains: search } },
      { browser: { contains: search } },
      { os: { contains: search } },
    ];
  }

  const [scans, total] = await Promise.all([
    prisma.scanLog.findMany({
      where,
      include: { restaurant: { select: { name: true, slug: true } } },
      orderBy: { scannedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.scanLog.count({ where }),
  ]);

  return NextResponse.json({ scans, total, page, limit });
}
