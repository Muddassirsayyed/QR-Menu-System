"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Leaf, Phone, MapPin, ChevronUp, UtensilsCrossed, Flame, Maximize2, Sparkles, QrCode } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isVeg: boolean;
  isFeatured: boolean;
  spiceLevel: number | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  menuItems: MenuItem[];
};

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  categories: Category[];
};

function getThumbnailUrl(imageUrl: string | null): string {
  if (!imageUrl) return "";
  if (imageUrl === "/images/placeholder-food.jpg") {
    return "/images/placeholder-food-thumb.jpg";
  }
  if (imageUrl.startsWith("/images/menu/")) {
    return imageUrl.replace("/images/menu/", "/images/menu/thumbnails/");
  }
  return imageUrl;
}

function VegDot({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 rounded-sm border-2 flex-shrink-0 ${
        isVeg ? "border-green-600 bg-green-50/50" : "border-red-600 bg-red-50/50"
      }`}
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
    </span>
  );
}

function MenuRow({ item, onImageClick }: { item: MenuItem; onImageClick: (item: MenuItem) => void }) {
  const thumbUrl = getThumbnailUrl(item.imageUrl);

  return (
    <div className="flex items-start justify-between gap-5 py-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/40 px-2 rounded-xl transition-all duration-200 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <VegDot isVeg={item.isVeg} />
          {item.isFeatured && (
            <span className="inline-flex items-center gap-0.5 text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-2 py-0.5 rounded-full shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              Chef's Pick
            </span>
          )}
        </div>
        
        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-orange-600 transition-colors">
          {item.name}
        </h3>
        
        <div className="mt-1 flex items-center gap-3">
          <span className="font-extrabold text-slate-800 text-base">{formatPrice(item.price)}</span>
          {item.spiceLevel && item.spiceLevel > 0 && (
            <div className="flex gap-0.5 items-center bg-orange-50 px-2 py-0.5 rounded-full">
              {Array.from({ length: 3 }, (_, i) => (
                <Flame
                  key={i}
                  className={`w-3.5 h-3.5 ${i < item.spiceLevel! ? "text-orange-500 fill-orange-500" : "text-slate-200"}`}
                />
              ))}
            </div>
          )}
        </div>

        {item.description && (
          <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2 pr-4">
            {item.description}
          </p>
        )}
      </div>

      {item.imageUrl && (
        <div className="flex-shrink-0 relative self-center">
          <button
            onClick={() => onImageClick(item)}
            className="relative block w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-slate-100 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02] active:scale-95 cursor-pointer bg-slate-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbUrl}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

function RestaurantLogo({ src, name }: { src: string | null; name: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white">
        <span className="text-white text-3xl font-black">{name[0]?.toUpperCase()}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      onError={() => setError(true)}
      className="w-16 h-16 rounded-2xl object-cover border-2 border-white flex-shrink-0 shadow-lg"
    />
  );
}

export default function MenuClient({ restaurant }: { restaurant: Restaurant }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Share QR Code Modal States
  const [showQrModal, setShowQrModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const catRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const visitorId =
      localStorage.getItem("menuqr-visitor") ||
      (() => {
        const id = `v-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("menuqr-visitor", id);
        return id;
      })();
    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantSlug: restaurant.slug, visitorId, referrer: document.referrer || "direct" }),
    }).catch(() => {});
  }, [restaurant.slug]);

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const allItems = restaurant.categories.flatMap((c) => c.menuItems);

  const filteredCategories = restaurant.categories
    .map((cat) => ({
      ...cat,
      menuItems: cat.menuItems.filter((item) => {
        const matchSearch =
          !search ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
        return matchSearch && (!vegOnly || item.isVeg);
      }),
    }))
    .filter((cat) => cat.menuItems.length > 0);

  const displayCategories =
    activeCategory === "all"
      ? filteredCategories
      : filteredCategories.filter((cat) => cat.slug === activeCategory);

  const scrollToCategory = (slug: string) => {
    setActiveCategory(slug);
    setTimeout(() => {
      const el = catRefs.current[slug];
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 130;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 50);
  };

  const vegCount = allItems.filter((i) => i.isVeg).length;
  const nonVegCount = allItems.filter((i) => !i.isVeg).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      {/* Cover Banner with Spline 3D Particles */}
      <div className="h-48 w-full bg-slate-950 relative overflow-hidden flex-shrink-0">
        <iframe
          src="https://my.spline.design/interactiveparticles-b43ecf482d0016cd08efc5520a7b45db/"
          className="absolute inset-0 w-full h-full border-none pointer-events-none scale-105 opacity-70"
          style={{ pointerEvents: "none" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
      </div>

      {/* Restaurant Info Layered Card */}
      <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
          <div className="flex items-start gap-4">
            <RestaurantLogo src={restaurant.logoUrl} name={restaurant.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
                    {restaurant.name}
                  </h1>
                  {restaurant.description && (
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{restaurant.description}</p>
                  )}
                </div>
                {/* Show QR Action */}
                <button
                  onClick={() => setShowQrModal(true)}
                  className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-extrabold px-3 py-2 rounded-2xl text-xs transition-all shadow-xs border border-orange-100/50 cursor-pointer flex-shrink-0"
                  title="Show Menu QR Code"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show QR</span>
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-400">
                {restaurant.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="line-clamp-1">{restaurant.address}</span>
                  </span>
                )}
                {restaurant.phone && (
                  <a href={`tel:${restaurant.phone}`} className="flex items-center gap-1.5 text-orange-600 font-bold hover:underline">
                    <Phone className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    {restaurant.phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          <hr className="my-4 border-slate-100" />

          {/* Stats Bar */}
          <div className="flex items-center justify-around text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl">
              <UtensilsCrossed className="w-4 h-4 text-orange-500" />
              <span>{allItems.length} Dishes</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl">
              <VegDot isVeg={true} />
              <span>{vegCount} Veg</span>
            </div>
            <div className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-xl">
              <VegDot isVeg={false} />
              <span>{nonVegCount} Non-Veg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search & Navigation Bar */}
      <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md pt-4 pb-2 border-b border-slate-200/50 mt-4 shadow-xs">
        <div className="max-w-2xl mx-auto px-4 space-y-3">
          {/* Modern Search */}
          <div className="relative shadow-sm rounded-2xl overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search delicious dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none border border-slate-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all font-medium"
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Scrolling Categories List */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none scroll-smooth">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all duration-300 shadow-sm border ${
                activeCategory === "all"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent scale-95"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Menu
            </button>
            
            {restaurant.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.slug)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all duration-300 shadow-sm border ${
                  activeCategory === cat.slug
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent scale-95"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat.icon && <span className="text-sm">{cat.icon}</span>}
                {cat.name}
              </button>
            ))}
            
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all duration-300 shadow-sm border ${
                vegOnly 
                  ? "bg-green-600 text-white border-transparent" 
                  : "bg-white text-green-700 border-green-200 hover:bg-green-50"
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              Veg Only
            </button>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {displayCategories.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
            <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
            <h3 className="text-slate-800 font-extrabold text-lg">No dishes found</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
              We couldn't find any dishes matching your preference. Try adjusting your filters.
            </p>
            {(search || vegOnly || activeCategory !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setVegOnly(false);
                  setActiveCategory("all");
                }}
                className="mt-4 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-all"
              >
                Reset all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {displayCategories.map((cat) => (
              <div
                key={cat.id}
                ref={(el) => { catRefs.current[cat.slug] = el; }}
                className="scroll-mt-36"
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                  {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                  <h2 className="font-black text-slate-900 text-lg tracking-tight">{cat.name}</h2>
                  <span className="ml-2 bg-slate-200/60 text-slate-600 font-bold px-2 py-0.5 rounded-md text-[10px]">
                    {cat.menuItems.length}
                  </span>
                </div>

                {/* Items Card List */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100/80 divide-y divide-slate-100">
                  {cat.menuItems.map((item) => (
                    <MenuRow key={item.id} item={item} onImageClick={setSelectedItem} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* High-Res Image Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-zoom-in max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.imageUrl || ""}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 flex gap-1.5">
                <VegDot isVeg={selectedItem.isVeg} />
                {selectedItem.isFeatured && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-2.5 py-0.5 rounded-full shadow-md">
                    <Sparkles className="w-2.5 h-2.5" />
                    Chef's Pick
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-black text-slate-900 leading-snug">
                  {selectedItem.name}
                </h2>
                <span className="text-xl font-extrabold text-slate-800 whitespace-nowrap">
                  {formatPrice(selectedItem.price)}
                </span>
              </div>

              {selectedItem.spiceLevel && selectedItem.spiceLevel > 0 && (
                <div className="mt-2 flex items-center gap-1 bg-orange-50/80 px-2.5 py-1 rounded-lg w-max">
                  <span className="text-xs font-bold text-orange-700 mr-1">Spice Level:</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 3 }, (_, i) => (
                      <Flame
                        key={i}
                        className={`w-3.5 h-3.5 ${i < selectedItem.spiceLevel! ? "text-orange-500 fill-orange-500" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.description && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About this dish</h4>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-zoom-in">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full p-2 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mt-2">
              <h3 className="text-lg font-black text-slate-900">Share QR Menu</h3>
              <p className="text-xs text-slate-400 mt-1">Scan to view the live digital menu</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 my-5 flex items-center justify-center min-h-[220px]">
              {currentUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}`}
                  alt="Restaurant Menu QR Code"
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-semibold truncate flex-1">{currentUrl}</span>
              <button
                onClick={handleCopyLink}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex-shrink-0 cursor-pointer"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-4 z-40 bg-gradient-to-r from-orange-500 to-amber-500 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-white/20"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
