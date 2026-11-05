"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, LinearGradient, defs, stop } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-sm shadow-xl"
      style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p className="text-xs mb-1" style={{ color: "#9A9B95" }}>{label}</p>
      <p className="font-black" style={{ color: "#A78BFA" }}>{payload[0].value} kg</p>
    </div>
  );
};

export default function WeightTracker() {
  const [logs, setLogs] = useState([]);
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    const res = await fetch("/api/weight");
    if (res.status === 401) { window.location.href = "/login"; return; }
    const data = await res.json();
    if (Array.isArray(data)) {
      setLogs(data.map(l => ({ ...l, dateFormatted: new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) })));
    }
    setLoading(false);
  };

  const submit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    const res = await fetch("/api/weight", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ weight }) });
    if (res.ok) { setWeight(""); fetchLogs(); }
    setSubmitting(false);
  };

  const current = logs.length > 0 ? logs[logs.length - 1].weight : null;
  const initial = logs.length > 0 ? logs[0].weight : null;
  const diff = current && initial ? (current - initial).toFixed(1) : null;
  const isGain = diff > 0, isLoss = diff < 0;

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[10px] uppercase tracking-[5px] mb-1" style={{ color: "#5C5E58" }}>Progress</p>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ color: "#F2F0EA" }}>
          WEIGHT <span style={{ color: "#A78BFA" }}>TRACKER</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: "#5C5E58" }}>Monitor your body weight progress over time</p>
      </motion.div>

      {/* ── 3 Metric Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Current Weight",
            value: current ? `${current} kg` : "—",
            gradient: "linear-gradient(135deg,#8B5CF6,#EC4899)",
            glow: "rgba(139,92,246,0.3)",
            icon: Scale,
          },
          {
            label: "Starting Weight",
            value: initial ? `${initial} kg` : "—",
            gradient: "linear-gradient(135deg,#3B82F6,#06B6D4)",
            glow: "rgba(59,130,246,0.3)",
            icon: Minus,
          },
          {
            label: "Total Change",
            value: diff ? `${diff > 0 ? "+" : ""}${diff} kg` : "—",
            gradient: isGain
              ? "linear-gradient(135deg,#10B981,#34D399)"
              : isLoss
              ? "linear-gradient(135deg,#EF4444,#F97316)"
              : "linear-gradient(135deg,#6B7280,#9CA3AF)",
            glow: isGain ? "rgba(16,185,129,0.3)" : isLoss ? "rgba(239,68,68,0.3)" : "rgba(107,114,128,0.2)",
            icon: isGain ? TrendingUp : isLoss ? TrendingDown : Minus,
            badge: isGain ? "↑ Gain" : isLoss ? "↓ Loss" : "",
          },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)" }}>
              {/* Gradient glow blob */}
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: m.gradient, filter: "blur(40px)" }} />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Icon className="w-5 h-5" style={{ color: "#9A9B95" }} />
                </div>
                <p className="text-[10px] uppercase tracking-[3px] mb-2" style={{ color: "#5C5E58" }}>{m.label}</p>
                <p className="text-4xl font-black" style={{ background: m.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {m.value}
                </p>
                {m.badge && (
                  <span className="mt-2 inline-block text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: `${m.glow.replace("0.3", "0.15")}`, color: isGain ? "#4ade80" : "#f87171", border: `1px solid ${m.glow}` }}>
                    {m.badge}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Log Form ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-6"
          style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)" }}>

          <h2 className="text-base font-bold mb-5" style={{ color: "#F2F0EA" }}>Log Today's Weight</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[3px] mb-2 block" style={{ color: "#5C5E58" }}>Weight (kg)</label>
              <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 75.5" required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.3)", color: "#F2F0EA" }}
                onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.6)"; e.target.style.boxShadow = "0 0 0 1px rgba(139,92,246,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(139,92,246,0.3)"; e.target.style.boxShadow = "none"; }} />
            </div>
            <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl text-sm font-black tracking-wide"
              style={{
                background: "linear-gradient(135deg,#8B5CF6,#EC4899)",
                color: "#fff",
                boxShadow: "0 0 24px rgba(139,92,246,0.3)",
                opacity: submitting ? 0.6 : 1
              }}>
              {submitting ? "Saving..." : "Save Log"}
            </motion.button>
          </form>

          {/* Recent logs */}
          {logs.length > 0 && (
            <div className="mt-6 space-y-2">
              <p className="text-[10px] uppercase tracking-[3px] mb-3" style={{ color: "#5C5E58" }}>Recent</p>
              {[...logs].reverse().slice(0, 5).map((l, i) => (
                <div key={l.id} className="flex justify-between items-center px-3 py-2.5 rounded-xl transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
                  <span className="text-xs" style={{ color: "#9A9B95" }}>{l.dateFormatted}</span>
                  <span className="text-sm font-black" style={{ color: "#A78BFA" }}>{l.weight} kg</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Chart ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)" }}>

          <h2 className="text-base font-bold mb-1" style={{ color: "#F2F0EA" }}>Weight Progress</h2>
          <p className="text-xs mb-6" style={{ color: "#5C5E58" }}>Your journey over time</p>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "rgba(139,92,246,0.2)", borderTopColor: "#8B5CF6" }} />
            </div>
          ) : logs.length < 2 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3" style={{ color: "#5C5E58" }}>
              <Scale className="w-10 h-10 opacity-30" />
              <p className="text-sm">Log at least 2 entries to see your chart</p>
            </div>
          ) : (
            <div style={{ width: "100%", minHeight: "280px", height: "280px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="dateFormatted" stroke="#374151" tick={{ fill: "#5C5E58", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#374151" tick={{ fill: "#5C5E58", fontSize: 11 }} tickLine={false} axisLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="weight" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#weightGrad)"
                    dot={{ fill: "#8B5CF6", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#EC4899", boxShadow: "0 0 10px rgba(236,72,153,0.5)" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
