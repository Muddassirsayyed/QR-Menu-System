import os from "os";
import { NextRequest } from "next/server";

export function getLocalAppUrl(request: NextRequest): string {
  const hostHeader = request.headers.get("host") || "localhost:5000";
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const cleanProto = proto.endsWith(":") ? proto : `${proto}:`;

  let [hostname, port] = hostHeader.split(":");
  
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
    const interfaces = os.networkInterfaces();
    let localIp = "";
    for (const name in interfaces) {
      const addrs = interfaces[name];
      if (addrs) {
        for (const addr of addrs) {
          if (addr.family === "IPv4" && !addr.internal) {
            const lowerName = name.toLowerCase();
            if (lowerName.includes("wi-fi") || lowerName.includes("ethernet") || lowerName.includes("wlan")) {
              localIp = addr.address;
              break;
            }
            if (!localIp) {
              localIp = addr.address;
            }
          }
        }
      }
      if (localIp && (name.toLowerCase().includes("wi-fi") || name.toLowerCase().includes("ethernet") || name.toLowerCase().includes("wlan"))) {
        break;
      }
    }
    if (localIp) {
      hostname = localIp;
    }
  }

  const host = port ? `${hostname}:${port}` : hostname;
  return `${cleanProto}//${host}`;
}
