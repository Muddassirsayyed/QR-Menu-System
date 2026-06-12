// app/menu/[slug]/not-found.tsx
import Link from "next/link";
import { UtensilsCrossed, QrCode } from "lucide-react";

export default function MenuNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <UtensilsCrossed className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
          Menu Not Found
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          This restaurant menu doesn&apos;t exist or may have been removed.
          Please check the QR code and try again.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            Go to MenuQR
          </Link>
        </div>
      </div>
    </div>
  );
}
