// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  QrCode,
  LayoutDashboard,
  Store,
  BarChart3,
  ScanLine,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/restaurants", label: "Restaurants", icon: Store },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/scans", label: "Scan Logs", icon: ScanLine },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-slate-900 dark:text-white text-base leading-tight">
              MenuQR
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
              isActive(href, exact)
                ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Icon
              className={cn(
                "w-4.5 h-4.5 flex-shrink-0",
                isActive(href, exact)
                  ? "text-orange-500"
                  : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              )}
              size={18}
            />
            {label}
            {isActive(href, exact) && (
              <ChevronRight className="w-3.5 h-3.5 ml-auto text-orange-400" />
            )}
          </Link>
        ))}
      </nav>

      {/* Quick link to sample menu */}
      <div className="px-3 mb-3">
        <a
          href="/menu/spice-garden"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 bg-orange-500/10 hover:bg-orange-500/15 text-orange-600 dark:text-orange-400 rounded-xl text-xs font-medium transition-all"
        >
          <QrCode className="w-4 h-4" />
          View Demo Menu
          <ChevronRight className="w-3.5 h-3.5 ml-auto" />
        </a>
      </div>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-slate-200 dark:border-slate-700 pt-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all w-full"
        >
          <LogOut size={18} className="flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm"
      >
        <Menu className="w-4.5 h-4.5 text-slate-600 dark:text-slate-300" size={18} />
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 z-50 shadow-2xl">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
