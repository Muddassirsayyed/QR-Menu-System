// app/api/restaurants/[id]/qrcode/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateQRCode } from "@/lib/qrcode";
import { getLocalAppUrl } from "@/lib/server-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const appUrl = getLocalAppUrl(request);
  const menuUrl = `${appUrl}/menu/${restaurant.slug}`;
  const qrDataUrl = await generateQRCode(menuUrl);

  // Update existing or create new
  const existing = await prisma.qRCode.findFirst({ where: { restaurantId: id } });

  const qrCode = existing
    ? await prisma.qRCode.update({
        where: { id: existing.id },
        data: { qrDataUrl, menuUrl },
      })
    : await prisma.qRCode.create({
        data: { restaurantId: id, qrDataUrl, menuUrl },
      });

  return NextResponse.json({ qrCode });
}
