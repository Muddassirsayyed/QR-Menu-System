import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.qRCode.updateMany({
    data: { menuUrl: "http://10.129.164.233:5000/menu/spice-garden", qrDataUrl: "" },
  });
  console.log(`✅ Updated ${result.count} QR code(s)`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
