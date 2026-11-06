"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart as LucideLineChart, Trophy, Zap, Clock, Activity, Dumbbell, Sparkles } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ChartTooltip = ({ active, payload, label, unit = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-sm shadow-xl bg-dark-900 border border-white/10">
      <p className="text-stone-400 text-xs mb-1 font-mono">{label}</p>
      <p className="font-bold text-white">
        {payload[0].value.toLocaleString()}
        {unit}
      </p>
    </div>
  );
};

export default function Analytics() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workouts")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/login";
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setWorkouts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  const volumeData = [...workouts]
    .reverse()
    .slice(-14)
    .map((w) => ({
      date: new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      volume: w.exercises.reduce((a, ex) => a + ex.weight * ex.reps * ex.sets, 0),
      category: w.category,
    }));

  const catCount = workouts.reduce((a, w) => {
    a[w.category] = (a[w.category] || 0) + 1;
    return a;
  }, {});
  const catData = Object.entries(catCount).map(([name, count]) => ({ name, count }));

  const totalVolume = workouts.reduce(
    (a, w) => a + w.exercises.reduce((b, ex) => b + ex.weight * ex.reps * ex.sets, 0),
    0
  );
  const totalPRs = workouts.flatMap((w) => w.exercises).filter((e) => e.isPr).length;
  const avgDuration = workouts.filter((w) => w.duration).length
    ? Math.round(
        workouts.filter((w) => w.duration).reduce((a, w) => a + w.duration, 0) /
          workouts.filter((w) => w.duration).length
      )
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-2 border-lime border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-[3px] text-stone-500">
          Synthesizing Performance Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ───── Page Header ───── */}
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">
            SYSTEM TELEMETRY
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Performance Analytics & Insights
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          High-dimensional breakdown of total workload, muscle split distribution, and historical PR milestones.
        </p>
      </div>

      {/* ───── Summary Stats ───── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Completed Sessions", value: workouts.length, color: "#C8F36A", icon: Dumbbell },
          { label: "Cumulative Workload", value: `${(totalVolume / 1000).toFixed(1)}t`, color: "#38BDF8", icon: Zap },
          { label: "PR Milestones", value: totalPRs, color: "#FBBF24", icon: Trophy },
          { label: "Mean Duration", value: `${avgDuration}m`, color: "#A78BFA", icon: Clock },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="card-3d glass-panel-hover glass-panel rounded-2xl p-5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-400">{s.label}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}35` }}
                >
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-3xl font-black" style={{ color: s.color }}>
                {s.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* ───── Charts Grid ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Volume Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-black text-white">Workload Curve</h2>
            <span className="text-[10px] font-mono text-stone-500 uppercase">LAST 14 SESSIONS</span>
          </div>
          <p className="text-xs text-stone-400 mb-6">Aggregate session tonnage (weight × reps × sets)</p>

          {volumeData.length < 1 ? (
            <div className="h-64 flex items-center justify-center text-stone-500 text-sm">
              Log workouts to visualize your workload progression curve.
            </div>
          ) : (
            <div style={{ width: "100%", height: "260px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="neonVolGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8F36A" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#C8F36A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#4B5563"
                    tick={{ fill: "#6B7280", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#4B5563"
                    tick={{ fill: "#6B7280", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<ChartTooltip unit=" kg" />} />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="#C8F36A"
                    strokeWidth={2.5}
                    fill="url(#neonVolGrad)"
                    dot={{ fill: "#C8F36A", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#FFFFFF" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Workout Split Distribution Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-black text-white">Anatomical Split Distribution</h2>
            <span className="text-[10px] font-mono text-stone-500 uppercase">CATEGORY SESSIONS</span>
          </div>
          <p className="text-xs text-stone-400 mb-6">Relative balance across muscular focus areas</p>

          {catData.length < 1 ? (
            <div className="h-64 flex items-center justify-center text-stone-500 text-sm">
              No session data available yet.
            </div>
          ) : (
            <div style={{ width: "100%", height: "260px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="neonBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#4B5563"
                    tick={{ fill: "#6B7280", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#4B5563"
                    tick={{ fill: "#6B7280", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip unit=" sessions" />} />
                  <Bar
                    dataKey="count"
                    fill="url(#neonBarGrad)"
                    radius={[6, 6, 0, 0]}
                    style={{ filter: "drop-shadow(0 0 6px rgba(56,189,248,0.3))" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
