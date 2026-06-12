// app/api/scan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseUserAgent } from "@/lib/scan-tracker";
import { z } from "zod";

const scanSchema = z.object({
  restaurantSlug: z.string(),
  visitorId: z.string(),
  referrer: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantSlug, visitorId, referrer } = scanSchema.parse(body);

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: restaurantSlug },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const userAgent = request.headers.get("user-agent") || "";
    const { deviceType, browser, os } = parseUserAgent(userAgent);

    // Get IP from headers (works behind proxy/Vercel)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Create scan log
    await prisma.scanLog.create({
      data: {
        restaurantId: restaurant.id,
        visitorId,
        ipAddress: ip,
        country: "India", // In production, use IP geolocation service
        city: "Mumbai",
        deviceType,
        browser,
        os,
        referrer: referrer || "direct",
        userAgent,
      },
    });

    // Increment QR scan count
    await prisma.qRCode.updateMany({
      where: { restaurantId: restaurant.id },
      data: { totalScans: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Scan tracking error:", error);
    return NextResponse.json({ error: "Failed to track scan" }, { status: 500 });
  }
}
