"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, LinearGradient, defs, stop } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-sm shadow-xl" style={{ background: "#0F0F16", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="font-bold text-white">{payload[0].value} kg</p>
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
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-3xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#8B5CF6,#EC4899)", boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}>
            <Scale className="w-5 h-5 text-white" />
          </div>
          Weight Tracker
        </h1>
        <p className="text-gray-500 text-sm mt-1">Monitor your body weight progress over time</p>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Current Weight", value: current ? `${current} kg` : "—", from: "#8B5CF6", to: "#EC4899" },
          { label: "Starting Weight", value: initial ? `${initial} kg` : "—", from: "#3B82F6", to: "#06B6D4" },
          { label: "Total Change", value: diff ? `${diff > 0 ? "+" : ""}${diff} kg` : "—", from: isGain ? "#10B981" : isLoss ? "#FF2D20" : "#6B7280", to: isGain ? "#34D399" : isLoss ? "#FF6B35" : "#9CA3AF", badge: isGain ? "↑ Gain" : isLoss ? "↓ Loss" : "" },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-6 text-center"
            style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">{m.label}</p>
            <p className="text-4xl font-black" style={{ background: `linear-gradient(135deg,${m.from},${m.to})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {m.value}
            </p>
            {m.badge && <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full" style={{ background: `${m.from}22`, color: m.from }}>{m.badge}</span>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-6" style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <h2 className="text-lg font-bold text-white mb-5">Log Today's Weight</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Weight (kg)</label>
              <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 75.5" required
                className="w-full bg-transparent rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none"
                style={{ border: "1px solid rgba(139,92,246,0.3)", background: "rgba(255,255,255,0.03)" }} />
            </div>
            <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#8B5CF6,#EC4899)", boxShadow: "0 0 20px rgba(139,92,246,0.3)", opacity: submitting ? 0.6 : 1 }}>
              {submitting ? "Saving..." : "Save Log"}
            </motion.button>
          </form>
          {/* Recent logs */}
          {logs.length > 0 && (
            <div className="mt-6 space-y-2">
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-3">Recent</p>
              {[...logs].reverse().slice(0, 5).map((l, i) => (
                <div key={l.id} className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <span className="text-xs text-gray-500">{l.dateFormatted}</span>
                  <span className="text-sm font-semibold text-white">{l.weight} kg</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
          className="lg:col-span-2 rounded-2xl p-6" style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <h2 className="text-lg font-bold text-white mb-6">Weight Progress</h2>
          {loading ? <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
            : logs.length < 2 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-600">
                <Scale className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">Log at least 2 entries to see your chart</p>
              </div>
            ) : (
              <div style={{ width: "100%", minHeight: "280px", height: "280px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="dateFormatted" stroke="#374151" tick={{ fill: "#4B5563", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis stroke="#374151" tick={{ fill: "#4B5563", fontSize: 11 }} tickLine={false} axisLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="weight" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#weightGrad)" dot={{ fill: "#8B5CF6", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#EC4899" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
        </motion.div>
      </div>
    </div>
  );
}
