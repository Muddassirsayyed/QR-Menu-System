// components/dashboard/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import { Bell, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const pageTitles: Record<string, { title: string; desc: string }> = {
  "/dashboard": { title: "Overview", desc: "Welcome back! Here's what's happening." },
  "/dashboard/restaurants": { title: "Restaurants", desc: "Manage your restaurant listings." },
  "/dashboard/analytics": { title: "Analytics", desc: "Deep dive into your scan data." },
  "/dashboard/scans": { title: "Scan Logs", desc: "View all QR code scan events." },
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
    if (saved) document.documentElement.classList.add("dark");
  }, []);

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", String(next));
    document.documentElement.classList.toggle("dark", next);
  }

  // Find matching page title (sorted by path length descending to ensure most specific match wins)
  const pageInfo =
    Object.entries(pageTitles)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([path]) => pathname === path || pathname.startsWith(path + "/"))?.[1] ||
    { title: "Dashboard", desc: "" };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="ml-10 lg:ml-0">
        <h1 className="text-lg font-display font-bold text-slate-900 dark:text-white leading-tight">
          {pageInfo.title}
        </h1>
        {pageInfo.desc && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
            {pageInfo.desc}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDark}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-4.5 h-4.5" size={18} /> : <Moon className="w-4.5 h-4.5" size={18} />}
        </button>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          A
        </div>
      </div>
    </header>
  );
}
