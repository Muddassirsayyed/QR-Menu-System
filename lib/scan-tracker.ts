// lib/scan-tracker.ts
import { UAParser } from "ua-parser-js";

export interface ScanData {
  restaurantId: string;
  visitorId: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const deviceType = result.device.type || "desktop";
  const browser = result.browser.name || "Unknown";
  const os = result.os.name || "Unknown";

  return { deviceType, browser, os };
}

export function getVisitorId(cookies: string): string {
  const match = cookies.match(/visitor-id=([^;]+)/);
  if (match) return match[1];

  // Generate new visitor ID
  const id = `v-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return id;
}
