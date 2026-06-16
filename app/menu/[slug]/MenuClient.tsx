"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Leaf, Phone, MapPin, ChevronUp, UtensilsCrossed, Flame, Maximize2, Sparkles, QrCode } from "lucide-react";
import Image from "next/image";

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

function VegDot({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 rounded-md border flex-shrink-0 transition-all duration-300 ${
        isVeg 
          ? "border-green-500/40 bg-green-50 text-green-600" 
          : "border-red-500/40 bg-red-50 text-red-600"
      }`}
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
    >
      <span className={`w-1.5 h-1.5 rounded-full pulse-badge-dot ${isVeg ? "bg-green-500" : "bg-red-500"}`} />
    </span>
  );
}

function MenuRow({ item, onImageClick }: { item: MenuItem; onImageClick: (item: MenuItem) => void }) {
  const displayPrice = `₹${Math.round(item.price)}`;

  return (
    <div 
      onClick={() => onImageClick(item)}
      className="flex gap-3.5 sm:gap-4 p-3 bg-white rounded-2xl border border-black/[0.03] shadow-[0_4px_18px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden items-center cursor-pointer"
    >
      
      {/* Food Image - Left side (only if imageUrl is present) */}
      {item.imageUrl && (
        <div className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-2xl overflow-hidden relative flex-shrink-0 bg-gray-50 border border-gray-100 shadow-2xs self-center">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 90px, 110px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Food Details - Right side */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div>
          {/* Header line: VegDot + Name + Featured */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <VegDot isVeg={item.isVeg} />
            <h3 className="font-semibold text-gray-900 text-[15px] sm:text-[18px] leading-tight group-hover:text-[#FF7A00] transition-colors truncate">
              {item.name}
            </h3>
            {item.isFeatured && (
              <span className="inline-flex items-center gap-0.5 text-[8px] sm:text-[9px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-1.5 py-0.5 rounded-full shadow-2xs">
                <Sparkles className="w-2 h-2" />
                Chef's Pick
              </span>
            )}
          </div>

          {/* Price - directly below name */}
          <div className="text-[#FF7A00] text-sm sm:text-base font-bold mt-0.5 sm:mt-1">
            {displayPrice}
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Spice Level badge */}
        {item.spiceLevel !== null && item.spiceLevel > 0 && (
          <div className="mt-1.5 flex gap-0.5 items-center">
            {Array.from({ length: 3 }, (_, i) => (
              <Flame
                key={i}
                className={`w-3 h-3 ${i < item.spiceLevel! ? "text-orange-500 fill-orange-500" : "text-gray-300"}`}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function RestaurantLogo({ src, name }: { src: string | null; name: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-[#FF7A00]/10">
        <span className="text-white text-3xl font-black">{name[0]?.toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 shadow-sm bg-gray-50">
      <Image
        src={src}
        alt={name}
        fill
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
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
        const id = `v-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
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
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-[#F5F7FA] text-[#1A1A1A] pb-24 relative overflow-x-hidden selection:bg-[#FF7A00]/10 selection:text-[#FF7A00] font-sans">
      
      {/* Subtle Spline Animation / Ambient Blob Behind Restaurant Card */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] pointer-events-none z-0 overflow-hidden">
        {/* Soft Organic Orange Blob */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF7A00]/10 to-[#FFA000]/5 rounded-full blur-[60px] animate-float-3d" />
        
        {/* Subtle low opacity spline iframe */}
        <iframe
          src="https://my.spline.design/interactiveparticles-b43ecf482d0016cd08efc5520a7b45db/"
          className="w-full h-full border-none opacity-[0.035] pointer-events-none scale-110"
          style={{ pointerEvents: "none" }}
        />
      </div>

      {/* Main Container max-width 1200px */}
      <div className="max-w-[1200px] mx-auto px-4 pt-8 relative z-10">
        
        {/* Compact Restaurant Header Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-black/[0.03] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5">
            <RestaurantLogo src={restaurant.logoUrl} name={restaurant.name} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                {restaurant.name}
              </h1>
              {restaurant.description && (
                <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-xl">
                  {restaurant.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-gray-400 font-medium">
                {restaurant.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{restaurant.address}</span>
                  </span>
                )}
                {restaurant.phone && (
                  <a href={`tel:${restaurant.phone}`} className="flex items-center gap-1.5 text-[#FF7A00] font-bold hover:underline">
                    <Phone className="w-3.5 h-3.5 text-[#FF7A00] flex-shrink-0" />
                    <span>{restaurant.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action Row & Secondary Stats */}
          <div className="flex items-center gap-4 flex-shrink-0 self-end md:self-center">
            <div className="text-[11px] text-gray-400 font-bold hidden sm:flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
              <span>{allItems.length} Dishes</span>
              <span className="text-gray-300">•</span>
              <span className="text-green-600">{vegCount} Veg</span>
              <span className="text-gray-300">•</span>
              <span className="text-red-500">{nonVegCount} Non-Veg</span>
            </div>
            
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs border border-gray-200 cursor-pointer"
              title="Show Menu QR Code"
            >
              <QrCode className="w-4 h-4 text-gray-400" />
              <span>Share QR</span>
            </button>
          </div>
        </div>

        {/* Sticky Search & Navigation Bar */}
        <div className="sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-md pt-4 pb-2 border-b border-black/[0.04] mt-6 shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            
            {/* Search */}
            <div className="relative shadow-xs rounded-2xl overflow-hidden max-w-sm w-full border border-gray-200 bg-white">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search delicious dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 bg-white rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none transition-all font-medium focus:ring-2 focus:ring-[#FF7A00]/10"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sticky/Scrollable Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none scroll-smooth flex-1 justify-start md:justify-end">
              <button
                onClick={() => setActiveCategory("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 border ${
                  activeCategory === "all"
                    ? "bg-[#FF7A00] text-white border-transparent shadow-xs"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                All Menu
              </button>
              
              {restaurant.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.slug)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 border ${
                    activeCategory === cat.slug
                      ? "bg-[#FF7A00] text-white border-transparent shadow-xs"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cat.icon && <span className="text-sm">{cat.icon}</span>}
                  <span>{cat.name}</span>
                </button>
              ))}
              
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 border ${
                  vegOnly 
                    ? "bg-green-600 text-white border-transparent shadow-xs" 
                    : "bg-white text-green-600 border-green-200 hover:bg-green-50"
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>Veg Only</span>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items List - Vertical single column browsing experience */}
        <div className="py-6">
          {displayCategories.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-xs px-6">
              <UtensilsCrossed className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-gray-800 font-bold text-lg">No dishes found</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                We couldn't find any dishes matching your preference. Try adjusting your filters.
              </p>
              {(search || vegOnly || activeCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setVegOnly(false);
                    setActiveCategory("all");
                  }}
                  className="mt-4 text-xs font-bold text-[#FF7A00] bg-orange-50 border border-[#FF7A00]/20 hover:bg-orange-100 px-4 py-2 rounded-xl transition-all"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {displayCategories.map((cat) => (
                <div
                  key={cat.id}
                  ref={(el) => { catRefs.current[cat.slug] = el; }}
                  className="scroll-mt-32"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-gray-200">
                    {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                    <h2 className="font-bold text-gray-900 text-lg tracking-tight">
                      {cat.name} ({cat.menuItems.length})
                    </h2>
                  </div>
 
                  {/* Vertical Single-Column stacked list of cards */}
                  <div className="space-y-2.5">
                    {cat.menuItems.map((item) => (
                      <MenuRow key={item.id} item={item} onImageClick={setSelectedItem} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* High-Res Image Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-zoom-in max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 transition-colors cursor-pointer border border-gray-100 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-50 flex-shrink-0 border-b border-gray-100">
              <Image
                src={selectedItem.imageUrl || "/images/placeholder-food.jpg"}
                alt={selectedItem.name}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 flex gap-1.5">
                <VegDot isVeg={selectedItem.isVeg} />
                {selectedItem.isFeatured && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-2.5 py-0.5 rounded-full shadow-md">
                    <Sparkles className="w-2.5 h-2.5" />
                    Chef's Pick
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900 leading-snug">
                  {selectedItem.name}
                </h2>
                <span className="text-xl font-bold text-[#FF7A00] whitespace-nowrap">
                  ₹{Math.round(selectedItem.price)}
                </span>
              </div>

              {selectedItem.spiceLevel !== null && selectedItem.spiceLevel > 0 && (
                <div className="mt-2 flex items-center gap-1 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg w-max">
                  <span className="text-xs font-bold text-orange-600 mr-1">Spice Level:</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 3 }, (_, i) => (
                      <Flame
                        key={i}
                        className={`w-3.5 h-3.5 ${i < selectedItem.spiceLevel! ? "text-orange-500 fill-orange-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.description && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">About this dish</h4>
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 animate-zoom-in">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full p-2 transition-colors cursor-pointer border border-gray-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mt-2">
              <h3 className="text-lg font-bold text-gray-950">Share QR Menu</h3>
              <p className="text-xs text-gray-400 mt-1">Scan to view the live digital menu</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 my-5 flex items-center justify-center min-h-[220px] border border-gray-100">
              {currentUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}`}
                  alt="Restaurant Menu QR Code"
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-8 h-8 border-3 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500 font-semibold truncate flex-1">{currentUrl}</span>
              <button
                onClick={handleCopyLink}
                className="bg-[#FF7A00] hover:bg-[#E06B00] text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex-shrink-0 cursor-pointer"
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
          className="fixed bottom-6 right-4 z-40 bg-gradient-to-r from-[#FF7A00] to-amber-500 text-white w-12 h-12 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-white/10"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
