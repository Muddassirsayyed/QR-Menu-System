// lib/qrcode.ts
import QRCode from "qrcode";

export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    });
    return qrDataUrl;
  } catch (error) {
    console.error("QR generation error:", error);
    throw new Error("Failed to generate QR code");
  }
}
