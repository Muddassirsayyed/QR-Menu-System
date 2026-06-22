// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Store,
  ScanLine,
  CalendarDays,
  TrendingUp,
  Monitor,
  Smartphone,
  Globe,
  ArrowUpRight,
  RefreshCw,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { formatDateShort, formatTimeOnly } from "@/lib/utils";

const CHART_COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];

type Stats = {
  totalRestaurants: number;
  totalScans: number;
  dailyScans: number;
  weeklyScans: number;
  monthlyScans: number;
};

type DashboardData = {
  stats: Stats;
  recentScans: Array<{
    id: string;
    scannedAt: string;
    deviceType: string | null;
    browser: string | null;
    country: string | null;
    city: string | null;
    restaurant: { name: string };
  }>;
  charts: {
    dailyTrend: Array<{ date: string; scans: number }>;
    deviceBreakdown: Array<{ name: string; value: number }>;
    browserBreakdown: Array<{ name: string; value: number }>;
    countryBreakdown: Array<{ name: string; value: number }>;
    topRestaurants: Array<{ name: string; scans: number }>;
  };
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/stats");
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, recentScans, charts } = data;
  const trendData = charts.dailyTrend.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    scans: d.scans,
  }));

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Activity className="w-3.5 h-3.5 text-green-500" />
          <span>Live — refreshes every 30s</span>
          <span>· Last updated {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-500 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Store}
          label="Restaurants"
          value={stats.totalRestaurants}
          sub="Total active"
          color="bg-violet-500"
        />
        <StatCard
          icon={ScanLine}
          label="Total Scans"
          value={stats.totalScans}
          sub="All time"
          color="bg-orange-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Today"
          value={stats.dailyScans}
          sub="Scans today"
          color="bg-blue-500"
        />
        <StatCard
          icon={CalendarDays}
          label="This Week"
          value={stats.weeklyScans}
          sub="Last 7 days"
          color="bg-emerald-500"
        />
        <StatCard
          icon={Globe}
          label="This Month"
          value={stats.monthlyScans}
          sub="Current month"
          color="bg-pink-500"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Scan Trend</h3>
              <p className="text-xs text-slate-400">Last 30 days</p>
            </div>
            <div className="text-xs text-orange-500 font-medium bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-lg">
              {stats.monthlyScans} this month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                interval={4}
              />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f1f5f9",
                }}
              />
              <Line
                type="monotone"
                dataKey="scans"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#f97316" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device breakdown */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Devices</h3>
          <p className="text-xs text-slate-400 mb-4">Last 30 days</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={charts.deviceBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                paddingAngle={3}
              >
                {charts.deviceBreakdown.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f1f5f9",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {charts.deviceBreakdown.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="capitalize text-slate-600 dark:text-slate-300">{d.name}</span>
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Browser breakdown */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Browsers</h3>
          <p className="text-xs text-slate-400 mb-3">Last 30 days</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={charts.browserBreakdown} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={60} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "none", borderRadius: "12px", fontSize: "12px", color: "#f1f5f9" }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {charts.browserBreakdown.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Country breakdown */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Countries</h3>
          <p className="text-xs text-slate-400 mb-3">Last 30 days</p>
          <div className="space-y-2.5">
            {charts.countryBreakdown.slice(0, 6).map((c, i) => {
              const max = charts.countryBreakdown[0]?.value || 1;
              const pct = Math.round((c.value / max) * 100);
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300">{c.name || "Unknown"}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{c.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top restaurants */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Top Restaurants</h3>
          <p className="text-xs text-slate-400 mb-3">By total scans</p>
          <div className="space-y-3">
            {charts.topRestaurants.map((r, i) => (
              <div key={r.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                    {r.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{r.scans} scans</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent scans table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Recent Scans</h3>
            <p className="text-xs text-slate-400">Latest QR scan events</p>
          </div>
          <a
            href="/dashboard/scans"
            className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">Restaurant</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">Timing</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">Device</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">Browser</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">Location</th>
              </tr>
            </thead>
            <tbody>
              {recentScans.map((scan) => (
                <tr
                  key={scan.id}
                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-3">
                    <span className="font-medium text-slate-900 dark:text-white text-xs">
                      {scan.restaurant.name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">
                    {formatDateShort(scan.scannedAt)}
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">
                    {formatTimeOnly(scan.scannedAt)}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 text-xs">
                      {scan.deviceType === "mobile" ? (
                        <Smartphone className="w-3 h-3 text-blue-500" />
                      ) : (
                        <Monitor className="w-3 h-3 text-slate-400" />
                      )}
                      <span className="capitalize text-slate-600 dark:text-slate-300">
                        {scan.deviceType || "desktop"}
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">{scan.browser || "—"}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">
                    {[scan.city, scan.country].filter(Boolean).join(", ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
