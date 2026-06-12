// app/dashboard/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
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
import { TrendingUp, Smartphone, Monitor, Globe } from "lucide-react";

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];

type AnalyticsData = {
  charts: {
    dailyTrend: Array<{ date: string; scans: number }>;
    deviceBreakdown: Array<{ name: string; value: number }>;
    browserBreakdown: Array<{ name: string; value: number }>;
    countryBreakdown: Array<{ name: string; value: number }>;
    topRestaurants: Array<{ name: string; scans: number }>;
  };
  stats: {
    totalScans: number;
    weeklyScans: number;
    monthlyScans: number;
    dailyScans: number;
  };
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const trendData = data.charts.dailyTrend.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    scans: d.scans,
  }));

  const totalScans = data.stats.totalScans;
  const avgDaily = totalScans > 0 ? Math.round(totalScans / 30) : 0;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Daily Scans", value: avgDaily, sub: "30-day average", icon: TrendingUp, color: "bg-orange-500" },
          { label: "Mobile Visits", value: data.charts.deviceBreakdown.find(d => d.name === "mobile")?.value || 0, sub: "Via mobile device", icon: Smartphone, color: "bg-blue-500" },
          { label: "Desktop Visits", value: data.charts.deviceBreakdown.find(d => d.name === "desktop")?.value || 0, sub: "Via desktop", icon: Monitor, color: "bg-emerald-500" },
          { label: "Countries", value: data.charts.countryBreakdown.length, sub: "Unique countries", icon: Globe, color: "bg-purple-500" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-1">
                  {value.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">{sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 30-day area chart */}
      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Scan Volume Trend</h3>
        <p className="text-xs text-slate-400 mb-5">Daily scans over the last 30 days</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="scans"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#scanGrad)"
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Row 2: Device + Browser pie charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Device Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Last 30 days</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.charts.deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {data.charts.deviceBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "none", borderRadius: "12px", fontSize: "12px", color: "#f1f5f9" }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs capitalize text-slate-600 dark:text-slate-300">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Browser Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Last 30 days</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.charts.browserBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "none", borderRadius: "12px", fontSize: "12px", color: "#f1f5f9" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.charts.browserBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Country + Top restaurants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Country Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Scan origin by country</p>
          <div className="space-y-3">
            {data.charts.countryBreakdown.map((c, i) => {
              const max = data.charts.countryBreakdown[0]?.value || 1;
              const pct = Math.round((c.value / max) * 100);
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {c.name || "Unknown"}
                    </span>
                    <span className="text-slate-500 text-xs">{c.value} scans</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Top Restaurants</h3>
          <p className="text-xs text-slate-400 mb-4">By total scan count</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.charts.topRestaurants} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "none", borderRadius: "12px", fontSize: "12px", color: "#f1f5f9" }}
              />
              <Bar dataKey="scans" radius={[0, 6, 6, 0]} fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
