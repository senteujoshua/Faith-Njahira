"use client";

import { useState, useEffect } from "react";
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
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface MonthData {
  month: string;
  usd: number;
  gbp: number;
  kes: number;
  count: number;
}

interface ProductData {
  name: string;
  total: number;
  currency: string;
  count: number;
}

interface AnalyticsData {
  totalUSD: number;
  totalGBP: number;
  totalKES: number;
  totalOrders: number;
  thisMonth: { usd: number; gbp: number; kes: number; count: number };
  revenueByMonth: MonthData[];
  revenueByProduct: ProductData[];
  revenueByType: Record<string, number>;
}

const COLORS = ["#1B8080", "#B58863", "#3D4D55", "#6B8FAB", "#9C6B3C", "#4A7C6F"];

const TYPE_LABELS: Record<string, string> = {
  BOOK: "Books",
  EVENT: "Events",
  COACHING: "Coaching",
  BUNDLE: "Bundles",
};

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-xs font-body uppercase tracking-wider text-warm-gray mb-1">{label}</p>
      <p className="font-heading text-2xl font-bold text-teal">{value}</p>
      {sub && <p className="text-xs font-body text-warm-gray mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d: AnalyticsData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load analytics.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-warm-gray font-body text-sm">Loading analytics...</div>;
  }

  if (error || !data) {
    return <div className="text-red-600 font-body text-sm">{error || "No data."}</div>;
  }

  const pieData = Object.entries(data.revenueByType).map(([type, total]) => ({
    name: TYPE_LABELS[type] ?? type,
    value: parseFloat(total.toFixed(2)),
  }));

  // Format month labels e.g. "2025-03" → "Mar 25"
  const monthlyData = data.revenueByMonth.map((m) => {
    const [year, month] = m.month.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return {
      ...m,
      label: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    };
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-teal mb-8">Analytics</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Orders"
          value={String(data.totalOrders)}
          sub="Paid orders"
        />
        <StatCard
          label="Revenue (USD)"
          value={`$${data.totalUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <StatCard
          label="Revenue (GBP)"
          value={`£${data.totalGBP.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <StatCard
          label="Revenue (KES)"
          value={`KES ${data.totalKES.toLocaleString()}`}
        />
      </div>

      {/* This Month */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="This Month Orders"
          value={String(data.thisMonth.count)}
          sub="Current month"
        />
        <StatCard
          label="This Month (USD)"
          value={`$${data.thisMonth.usd.toFixed(2)}`}
          sub="Current month"
        />
        <StatCard
          label="This Month (GBP)"
          value={`£${data.thisMonth.gbp.toFixed(2)}`}
          sub="Current month"
        />
        <StatCard
          label="This Month (KES)"
          value={`KES ${data.thisMonth.kes.toLocaleString()}`}
          sub="Current month"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue by Month */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-semibold text-slate mb-4">Monthly Revenue (USD)</h2>
          {monthlyData.length === 0 ? (
            <p className="text-warm-gray font-body text-sm">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="usdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B8080" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1B8080" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fontFamily: "inherit" }} />
                <YAxis tick={{ fontSize: 11, fontFamily: "inherit" }} />
                <Tooltip
                  formatter={(v: number | undefined) => v != null ? [`$${v.toFixed(2)}`, "USD"] : ["-", "USD"]}
                  contentStyle={{ fontFamily: "inherit", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="usd"
                  stroke="#1B8080"
                  fill="url(#usdGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Revenue by Type */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-semibold text-slate mb-4">Revenue by Type (USD)</h2>
          {pieData.length === 0 ? (
            <p className="text-warm-gray font-body text-sm">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number | undefined) => v != null ? [`$${v.toFixed(2)}`] : ["-"]}
                  contentStyle={{ fontFamily: "inherit", fontSize: 12 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, fontFamily: "inherit" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Orders per Month */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="font-heading text-base font-semibold text-slate mb-4">Orders per Month</h2>
        {monthlyData.length === 0 ? (
          <p className="text-warm-gray font-body text-sm">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fontFamily: "inherit" }} />
              <YAxis tick={{ fontSize: 11, fontFamily: "inherit" }} allowDecimals={false} />
              <Tooltip
                formatter={(v: number | undefined) => v != null ? [v, "Orders"] : ["-", "Orders"]}
                contentStyle={{ fontFamily: "inherit", fontSize: 12 }}
              />
              <Bar dataKey="count" fill="#B58863" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-heading text-base font-semibold text-slate mb-4">Top Products</h2>
        {data.revenueByProduct.length === 0 ? (
          <p className="text-warm-gray font-body text-sm">No data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-2 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Product</th>
                  <th className="py-2 text-right text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Orders</th>
                  <th className="py-2 text-right text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.revenueByProduct.map((p) => (
                  <tr key={p.name}>
                    <td className="py-3 font-body text-sm text-slate">{p.name}</td>
                    <td className="py-3 text-right font-body text-sm text-slate">{p.count}</td>
                    <td className="py-3 text-right font-body text-sm font-medium text-teal">
                      {p.currency} {p.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
