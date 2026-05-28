"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart as LucideLineChart } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ChartTooltip = ({ active, payload, label, unit = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-sm shadow-xl" style={{ background: "#0F0F16", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="font-bold text-white">{payload[0].value.toLocaleString()}{unit}</p>
    </div>
  );
};

export default function Analytics() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workouts")
      .then(r => { if (r.status === 401) { window.location.href = "/login"; return null; } return r.json(); })
      .then(data => { if (data) { setWorkouts(Array.isArray(data) ? data : []); setLoading(false); } })
      .catch(() => { window.location.href = "/login"; });
  }, []);

  const volumeData = [...workouts].reverse().slice(-14).map(w => ({
    date: new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    volume: w.exercises.reduce((a, ex) => a + ex.weight * ex.reps * ex.sets, 0),
    category: w.category,
  }));

  const catCount = workouts.reduce((a, w) => { a[w.category] = (a[w.category] || 0) + 1; return a; }, {});
  const catData = Object.entries(catCount).map(([name, count]) => ({ name, count }));

  const totalVolume = workouts.reduce((a, w) => a + w.exercises.reduce((b, ex) => b + ex.weight * ex.reps * ex.sets, 0), 0);
  const totalPRs = workouts.flatMap(w => w.exercises).filter(e => e.isPr).length;
  const avgDuration = workouts.filter(w => w.duration).length
    ? Math.round(workouts.filter(w => w.duration).reduce((a, w) => a + w.duration, 0) / workouts.filter(w => w.duration).length)
    : 0;

  const glassCard = { background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-3xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#F59E0B,#FBBF24)", boxShadow: "0 0 20px rgba(245,158,11,0.4)" }}>
            <LucideLineChart className="w-5 h-5 text-white" />
          </div>
          Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-1">Your performance breakdown</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Workouts", value: workouts.length, from: "#FF2D20", to: "#FF6B35" },
          { label: "Total Volume", value: `${(totalVolume / 1000).toFixed(1)}t`, from: "#3B82F6", to: "#06B6D4", isText: true },
          { label: "Total PRs", value: totalPRs, from: "#F59E0B", to: "#FBBF24" },
          { label: "Avg Duration", value: `${avgDuration}m`, from: "#10B981", to: "#34D399", isText: true },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-5 text-center" style={glassCard}>
            <div className="text-3xl font-black mb-1" style={{ background: `linear-gradient(135deg,${s.from},${s.to})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {s.isText ? s.value : s.value}
            </div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-6" style={glassCard}>
          <h2 className="text-lg font-bold text-white mb-1">Workout Volume</h2>
          <p className="text-xs text-gray-600 mb-6">Last 14 sessions (kg)</p>
          {volumeData.length < 1 ? (
            <div className="h-64 flex items-center justify-center text-gray-600 text-sm">Log workouts to see trends</div>
          ) : (
            <div style={{ width: "100%", minHeight: "256px", height: "256px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF2D20" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF2D20" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" stroke="#374151" tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#374151" tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip unit=" kg" />} />
                  <Area type="monotone" dataKey="volume" stroke="#FF2D20" strokeWidth={2.5} fill="url(#volGrad)"
                    dot={{ fill: "#FF2D20", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#FF6B35" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Distribution Chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl p-6" style={glassCard}>
          <h2 className="text-lg font-bold text-white mb-1">Workout Split</h2>
          <p className="text-xs text-gray-600 mb-6">Sessions per muscle group</p>
          {catData.length < 1 ? (
            <div className="h-64 flex items-center justify-center text-gray-600 text-sm">No data yet</div>
          ) : (
            <div style={{ width: "100%", minHeight: "256px", height: "256px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B35" />
                      <stop offset="100%" stopColor="#FF2D20" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="#374151" tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#374151" tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip unit=" sessions" />} />
                  <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]}
                    style={{ filter: "drop-shadow(0 0 6px rgba(255,45,32,0.4))" }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
