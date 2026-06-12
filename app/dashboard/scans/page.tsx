// app/dashboard/scans/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ScanLine,
  Monitor,
  Smartphone,
  Tablet,
  Search,
  Filter,
  RefreshCw,
  Globe,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

type ScanLog = {
  id: string;
  scannedAt: string;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  ipAddress: string | null;
  visitorId: string;
  referrer: string | null;
  restaurant: { name: string; slug: string };
};

function DeviceIcon({ type }: { type: string | null }) {
  if (type === "mobile") return <Smartphone className="w-3.5 h-3.5 text-blue-500" />;
  if (type === "tablet") return <Tablet className="w-3.5 h-3.5 text-purple-500" />;
  return <Monitor className="w-3.5 h-3.5 text-slate-400" />;
}

export default function ScansPage() {
  const [scans, setScans] = useState<ScanLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 25;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        search,
        device: deviceFilter !== "all" ? deviceFilter : "",
      });
      const res = await fetch(`/api/scan/logs?${params}`);
      const data = await res.json();
      setScans(data.scans || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, deviceFilter]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Scans", value: total, icon: ScanLine, color: "bg-orange-500" },
          { label: "Mobile", value: scans.filter(s => s.deviceType === "mobile").length, icon: Smartphone, color: "bg-blue-500" },
          { label: "Desktop", value: scans.filter(s => s.deviceType === "desktop").length, icon: Monitor, color: "bg-emerald-500" },
          { label: "Countries", value: [...new Set(scans.map(s => s.country))].filter(Boolean).length, icon: Globe, color: "bg-purple-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              <p className="text-xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by restaurant, country, browser..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input pl-9 text-sm py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={deviceFilter}
            onChange={(e) => { setDeviceFilter(e.target.value); setPage(1); }}
            className="input text-sm py-2 w-auto"
          >
            <option value="all">All Devices</option>
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>
        <button
          onClick={load}
          className="btn-secondary flex items-center gap-1.5 text-sm py-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Scan Logs</h3>
            <p className="text-xs text-slate-400">{total.toLocaleString()} total events</p>
          </div>
          {loading && (
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                {["Restaurant", "Time", "Device", "Browser / OS", "Location", "IP", "Visitor ID"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scans.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    <ScanLine className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No scan logs found</p>
                  </td>
                </tr>
              ) : (
                scans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-orange-50/30 dark:hover:bg-orange-500/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <a
                        href={`/menu/${scan.restaurant.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-900 dark:text-white text-xs hover:text-orange-500 transition-colors"
                      >
                        {scan.restaurant.name}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(scan.scannedAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <DeviceIcon type={scan.deviceType} />
                        <span className="capitalize text-slate-600 dark:text-slate-300">
                          {scan.deviceType || "desktop"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {scan.browser || "—"}
                        </span>
                        {scan.os && (
                          <span className="text-slate-400 ml-1">/ {scan.os}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Globe className="w-3 h-3" />
                        {[scan.city, scan.country].filter(Boolean).join(", ") || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                      {scan.ipAddress || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-400 font-mono truncate max-w-24 block">
                        {scan.visitorId.slice(0, 12)}…
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages} · {total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i;
                if (p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      p === page
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
