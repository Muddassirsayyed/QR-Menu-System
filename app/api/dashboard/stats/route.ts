// app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalRestaurants,
    totalScans,
    dailyScans,
    weeklyScans,
    monthlyScans,
    recentScans,
    deviceBreakdown,
    browserBreakdown,
    countryBreakdown,
    topRestaurants,
    dailyTrend,
  ] = await Promise.all([
    prisma.restaurant.count(),
    prisma.scanLog.count(),
    prisma.scanLog.count({ where: { scannedAt: { gte: todayStart } } }),
    prisma.scanLog.count({ where: { scannedAt: { gte: weekStart } } }),
    prisma.scanLog.count({ where: { scannedAt: { gte: monthStart } } }),
    prisma.scanLog.findMany({
      take: 20,
      orderBy: { scannedAt: "desc" },
      include: { restaurant: { select: { name: true, slug: true } } },
    }),
    prisma.scanLog.groupBy({
      by: ["deviceType"],
      _count: true,
      where: { scannedAt: { gte: last30Days } },
    }),
    prisma.scanLog.groupBy({
      by: ["browser"],
      _count: true,
      where: { scannedAt: { gte: last30Days } },
    }),
    prisma.scanLog.groupBy({
      by: ["country"],
      _count: true,
      where: { scannedAt: { gte: last30Days } },
    }),
    prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { scanLogs: true } },
        qrCodes: { select: { totalScans: true } },
      },
      orderBy: { scanLogs: { _count: "desc" } },
      take: 5,
    }),
    // Generate 30-day trend
    Promise.all(
      Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        return prisma.scanLog
          .count({ where: { scannedAt: { gte: dayStart, lt: dayEnd } } })
          .then((count) => ({
            date: dayStart.toISOString().split("T")[0],
            scans: count,
          }));
      })
    ),
  ]);

  return NextResponse.json({
    stats: {
      totalRestaurants,
      totalScans,
      dailyScans,
      weeklyScans,
      monthlyScans,
    },
    recentScans,
    charts: {
      deviceBreakdown: deviceBreakdown.map((d) => ({
        name: d.deviceType || "unknown",
        value: d._count,
      })),
      browserBreakdown: browserBreakdown.map((b) => ({
        name: b.browser || "unknown",
        value: b._count,
      })),
      countryBreakdown: countryBreakdown.map((c) => ({
        name: c.country || "unknown",
        value: c._count,
      })),
      topRestaurants: topRestaurants.map((r) => ({
        name: r.name,
        slug: r.slug,
        scans: r._count.scanLogs,
      })),
      dailyTrend,
    },
  });
}
