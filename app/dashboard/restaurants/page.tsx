// app/dashboard/restaurants/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Store,
  QrCode,
  Trash2,
  Edit2,
  ScanLine,
  Eye,
  Download,
  X,
  Check,
  AlertCircle,
  UtensilsCrossed,
} from "lucide-react";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  isActive: boolean;
  logoUrl: string | null;
  _count: { scanLogs: number };
  qrCodes: Array<{ qrDataUrl: string; menuUrl: string; totalScans: number }>;
};

type FormData = {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  restaurantType: "family" | "chinese";
};

const defaultForm: FormData = {
  name: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  logoUrl: "",
  restaurantType: "family",
};

function QRModal({
  restaurant,
  onClose,
}: {
  restaurant: Restaurant;
  onClose: () => void;
}) {
  const qr = restaurant.qrCodes[0];
  const [generating, setGenerating] = useState(!qr?.qrDataUrl);
  const [qrData, setQrData] = useState(qr?.qrDataUrl || "");

  useEffect(() => {
    const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
    const isLocalhost = (url: string) => url.includes("localhost") || url.includes("127.0.0.1") || url.includes("0.0.0.0");
    
    const storedIsLocal = qr?.menuUrl ? isLocalhost(qr.menuUrl) : false;
    const currentIsLocal = isLocalhost(currentOrigin);
    
    let needsRegen = !qrData;
    if (qr?.menuUrl) {
      if (storedIsLocal) {
        needsRegen = true;
      } else if (!currentIsLocal && !qr.menuUrl.startsWith(currentOrigin)) {
        needsRegen = true;
      }
    }

    if (needsRegen) {
      setGenerating(true);
      fetch(`/api/restaurants/${restaurant.id}/qrcode`, { method: "POST" })
        .then((r) => r.json())
        .then((d) => {
          setQrData(d.qrCode?.qrDataUrl || "");
          setGenerating(false);
        });
    }
  }, [restaurant.id, qrData, qr?.menuUrl]);

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const isLocalhost = (url: string) => url.includes("localhost") || url.includes("127.0.0.1") || url.includes("0.0.0.0");
  const menuUrl = qr?.menuUrl && (!isLocalhost(qr.menuUrl) || isLocalhost(currentOrigin))
    ? qr.menuUrl
    : `${currentOrigin}/menu/${restaurant.slug}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">QR Code</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 flex items-center justify-center min-h-[200px]">
          {generating ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-500">Generating QR code...</p>
            </div>
          ) : qrData ? (
            <Image src={qrData} alt="QR Code" width={200} height={200} />
          ) : (
            <p className="text-sm text-slate-500">Failed to generate</p>
          )}
        </div>

        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
          <p className="text-xs text-slate-500 mb-1">Menu URL</p>
          <p className="text-xs text-blue-500 break-all">{menuUrl}</p>
        </div>

        <div className="flex gap-2 mt-4">
          <a
            href={`/menu/${restaurant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium py-2.5 rounded-xl transition-all"
          >
            <Eye className="w-4 h-4" />
            Preview
          </a>
          {qrData && (
            <a
              href={qrData}
              download={`qr-${restaurant.slug}.png`}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-xl transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function RestaurantForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<FormData & { id: string }>;
  onSave: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>({ ...defaultForm, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = initial?.id ? `/api/restaurants/${initial.id}` : "/api/restaurants";
      const method = initial?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to save");
        return;
      }
      onSave();
      onClose();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {initial?.id ? "Edit Restaurant" : "Add Restaurant"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Restaurant Type - only show on create */}
          {!initial?.id && (
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Restaurant Type *</label>
              <div className="grid grid-cols-2 gap-3">
                {(["family", "chinese"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, restaurantType: type })}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                      form.restaurantType === type
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {type === "family" ? "🍛 Family Restaurant" : "🥢 Chinese Restaurant"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {[
            { key: "name", label: "Restaurant Name *", placeholder: "Spice Garden" },
            { key: "description", label: "Description", placeholder: "Authentic Indian cuisine..." },
            { key: "address", label: "Address", placeholder: "12, MG Road, Mumbai" },
            { key: "phone", label: "Phone", placeholder: "+91 98765 43210" },
            { key: "email", label: "Email", placeholder: "hello@restaurant.com" },
            { key: "logoUrl", label: "Logo URL", placeholder: "https://..." },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                {label}
              </label>
              <input
                type={key === "email" ? "email" : "text"}
                value={form[key as keyof FormData] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                required={key === "name"}
                className="input"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {initial?.id ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RestaurantLogo({ src, name }: { src: string | null; name: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Store className="w-5 h-5 text-slate-400" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={48}
      height={48}
      className="object-cover w-full h-full"
      onError={() => setError(true)}
    />
  );
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Restaurant | null>(null);
  const [qrTarget, setQrTarget] = useState<Restaurant | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/restaurants");
    const data = await res.json();
    setRestaurants(data.restaurants || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this restaurant? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Restaurant
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : restaurants.length === 0 ? (
        <div className="card p-16 text-center">
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No restaurants yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first one to get started</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 text-sm">
            Create Restaurant
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {restaurants.map((r) => (
            <div
              key={r.id}
              className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                  <RestaurantLogo src={r.logoUrl} name={r.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{r.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        r.isActive
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                      }`}
                    >
                      {r.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {r.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{r.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <ScanLine className="w-3 h-3" />
                      {r._count.scanLogs} scans
                    </span>
                    {r.address && <span className="truncate max-w-48">{r.address}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`/menu/${r.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 transition-all"
                  title="View Menu"
                >
                  <Eye className="w-4 h-4" />
                </a>
                <Link
                  href={`/dashboard/restaurants/${r.id}/menu`}
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 transition-all"
                  title="Manage Menu Items"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setQrTarget(r)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 text-orange-500 transition-all"
                  title="QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditTarget(r)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 transition-all"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deleting === r.id}
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 transition-all disabled:opacity-50"
                  title="Delete"
                >
                  {deleting === r.id ? (
                    <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {(showForm || editTarget) && (
        <RestaurantForm
          initial={editTarget || undefined}
          onSave={load}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}
      {qrTarget && <QRModal restaurant={qrTarget} onClose={() => setQrTarget(null)} />}
    </div>
  );
}
