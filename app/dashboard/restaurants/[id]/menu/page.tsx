// app/dashboard/restaurants/[id]/menu/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  Check,
  X,
  AlertCircle,
  Leaf,
  Drumstick,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  icon: string | null;
  menuItems: MenuItem[];
};

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
};

type Restaurant = {
  id: string;
  name: string;
  categories: Category[];
};

const emptyItem = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  isVeg: true,
  isAvailable: true,
  isFeatured: false,
  categoryId: "",
};

function ItemForm({
  categoryId,
  categories,
  initial,
  onSave,
  onClose,
}: {
  categoryId: string;
  categories: Category[];
  initial?: MenuItem & { categoryId: string };
  onSave: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    ...emptyItem,
    categoryId,
    ...(initial
      ? {
          ...initial,
          price: String(initial.price),
          categoryId: initial.categoryId || categoryId,
        }
      : {}),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      const url = initial?.id ? `/api/menu/${initial.id}` : "/api/menu";
      const method = initial?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Save failed");
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
            {initial ? "Edit Item" : "Add Menu Item"}
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
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Category *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="input"
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Item Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Butter Chicken"
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tender chicken in rich, creamy tomato-based sauce..."
              rows={2}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Price (₹) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="280"
              min="0"
              step="0.01"
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="input"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "isVeg", label: "Veg", activeColor: "bg-green-500" },
              { key: "isAvailable", label: "Available", activeColor: "bg-blue-500" },
              { key: "isFeatured", label: "Featured", activeColor: "bg-orange-500" },
            ].map(({ key, label, activeColor }) => (
              <button
                key={key}
                type="button"
                onClick={() => setForm({ ...form, [key]: !form[key as keyof typeof form] })}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border ${
                  form[key as keyof typeof form]
                    ? `${activeColor} text-white border-transparent`
                    : "bg-slate-50 dark:bg-slate-700 text-slate-500 border-slate-200 dark:border-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

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
              {initial ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MenuManagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<(MenuItem & { categoryId: string }) | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/restaurants/${id}`);
    const data = await res.json();
    setRestaurant(data.restaurant);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(itemId: string) {
    if (!confirm("Delete this menu item?")) return;
    setDeleting(itemId);
    await fetch(`/api/menu/${itemId}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!restaurant) return <div>Restaurant not found</div>;

  const allCategories = restaurant.categories;
  const displayCategories =
    activeCategory === "all"
      ? allCategories
      : allCategories.filter((c) => c.id === activeCategory);

  const totalItems = allCategories.reduce((s, c) => s + c.menuItems.length, 0);
  const defaultCategoryId = allCategories[0]?.id || "";

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Back + Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/restaurants")}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h2 className="font-display font-bold text-slate-900 dark:text-white">
              {restaurant.name}
            </h2>
            <p className="text-xs text-slate-500">{totalItems} menu items across {allCategories.length} categories</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeCategory === "all"
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          }`}
        >
          All ({totalItems})
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {cat.icon && <span>{cat.icon}</span>}
            {cat.name}
            <span className="opacity-70 text-xs">({cat.menuItems.length})</span>
          </button>
        ))}
      </div>

      {/* Items by category */}
      {displayCategories.map((cat) => (
        <div key={cat.id} className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50">
            {cat.icon && <span className="text-lg">{cat.icon}</span>}
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{cat.name}</h3>
            <span className="text-xs text-slate-400 ml-1">{cat.menuItems.length} items</span>
          </div>

          {cat.menuItems.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No items in this category
            </div>
          ) : (
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {cat.menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {item.imageUrl && (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${item.isVeg ? "border-green-600 bg-green-50" : "border-red-600 bg-red-50"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white text-sm">
                        {item.name}
                      </span>
                      {item.isFeatured && (
                        <span className="text-xs bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-md font-medium">
                          Featured
                        </span>
                      )}
                      {!item.isAvailable && (
                        <span className="text-xs bg-red-100 dark:bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded-md">
                          Unavailable
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 pl-6">{item.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={() =>
                        setEditItem({ ...item, categoryId: cat.id })
                      }
                      className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 transition-all disabled:opacity-50"
                    >
                      {deleting === item.id ? (
                        <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modals */}
      {(showForm || editItem) && (
        <ItemForm
          categoryId={editItem?.categoryId || defaultCategoryId}
          categories={allCategories}
          initial={editItem || undefined}
          onSave={load}
          onClose={() => { setShowForm(false); setEditItem(null); }}
        />
      )}
    </div>
  );
}
