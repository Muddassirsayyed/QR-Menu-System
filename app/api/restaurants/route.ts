// app/api/restaurants/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { generateQRCode } from "@/lib/qrcode";
import { getLocalAppUrl } from "@/lib/server-utils";

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  logoUrl: z.string().optional(),
  restaurantType: z.enum(["family", "chinese"]).default("family"),
});

const FAMILY_CATEGORIES = [
  { name: "Starters", slug: "starters", icon: "🥗", sortOrder: 1 },
  { name: "Main Course", slug: "mains", icon: "🍛", sortOrder: 2 },
  { name: "Biryani", slug: "biryani", icon: "🍚", sortOrder: 3 },
  { name: "Desserts", slug: "desserts", icon: "🍮", sortOrder: 4 },
  { name: "Beverages", slug: "beverages", icon: "🥤", sortOrder: 5 },
];

const CHINESE_CATEGORIES = [
  { name: "Noodles & Chowmein", slug: "noodles-chowmein", icon: "🍜", sortOrder: 1 },
  { name: "Fried Rice", slug: "fried-rice", icon: "🍚", sortOrder: 2 },
  { name: "Starters & Dry", slug: "starters-dry", icon: "🥡", sortOrder: 3 },
  { name: "Gravy & Combos", slug: "gravy-combos", icon: "🥘", sortOrder: 4 },
];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const restaurants = await prisma.restaurant.findMany({
    include: {
      _count: { select: { scanLogs: true, categories: true } },
      qrCodes: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ restaurants });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    const slug = slugify(data.name) + "-" + Date.now().toString(36);
    const appUrl = getLocalAppUrl(request);
    const menuUrl = `${appUrl}/menu/${slug}`;
    const qrDataUrl = await generateQRCode(menuUrl);

    const categories = data.restaurantType === "chinese" ? CHINESE_CATEGORIES : FAMILY_CATEGORIES;
    const { restaurantType, email, ...rest } = data;

    const restaurant = await prisma.restaurant.create({
      data: {
        ...rest,
        slug,
        email: email || null,
        qrCodes: {
          create: { qrDataUrl, menuUrl, totalScans: 0 },
        },
        categories: {
          createMany: { data: categories },
        },
      },
    });

    return NextResponse.json({ restaurant }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
