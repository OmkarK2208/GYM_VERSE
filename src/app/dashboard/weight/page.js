"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, TrendingUp, TrendingDown, Minus, Clock, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-sm shadow-xl bg-dark-900 border border-white/10">
      <p className="text-stone-400 text-xs mb-1 font-mono">{label}</p>
      <p className="font-bold text-white">{payload[0].value} kg</p>
    </div>
  );
};

export default function WeightTracker() {
  const [logs, setLogs] = useState([]);
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await fetch("/api/weight");
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      setLogs(
        data.map((l) => ({
          ...l,
          dateFormatted: new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        }))
      );
    }
    setLoading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight }),
    });
    if (res.ok) {
      setWeight("");
      fetchLogs();
    }
    setSubmitting(false);
  };

  const current = logs.length > 0 ? logs[logs.length - 1].weight : null;
  const initial = logs.length > 0 ? logs[0].weight : null;
  const diff = current && initial ? (current - initial).toFixed(1) : null;
  const isGain = diff > 0;
  const isLoss = diff < 0;

  return (
    <div className="space-y-8">
      {/* ───── Page Header ───── */}
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">
            BODY COMPOSITION DYNAMICS
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Weight & Body Metamorphosis
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Log morning weigh-ins and project body transformation trajectory with high-precision curve fitting.
        </p>
      </div>

      {/* ───── Metric Stat Cards ───── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Current Weight",
            value: current ? `${current} kg` : "—",
            color: "#C8F36A",
          },
          {
            label: "Starting Weight",
            value: initial ? `${initial} kg` : "—",
            color: "#38BDF8",
          },
          {
            label: "Net Evolution",
            value: diff ? `${diff > 0 ? "+" : ""}${diff} kg` : "—",
            color: isGain ? "#4ADE80" : isLoss ? "#F43F5E" : "#9CA3AF",
            badge: isGain ? "Mass Gained" : isLoss ? "Body Cut" : "Maintained",
          },
        ].map((m, i) => (
          <div
            key={m.label}
            className="card-3d glass-panel-hover glass-panel rounded-2xl p-6 text-center border border-white/10"
          >
            <p className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
              {m.label}
            </p>
            <p className="text-4xl font-black tracking-tight" style={{ color: m.color }}>
              {m.value}
            </p>
            {m.badge && (
              <span
                className="mt-2.5 inline-block text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${m.color}15`,
                  borderColor: `${m.color}35`,
                  color: m.color,
                }}
              >
                {m.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ───── Form & Chart Grid ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Form & Recent History */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
          <div>
            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Scale className="h-5 w-5 text-lime" /> Log Today's Weigh-In
            </h2>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5 block">
                  Body Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 76.5"
                  required
                  className="w-full rounded-xl px-4 py-3.5 text-white placeholder-stone-600 text-sm outline-none bg-dark-900 border border-white/10 focus:border-lime transition-all"
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl text-sm font-black text-dark-950 bg-lime hover:bg-lime-hover transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(200,243,106,0.3)]"
              >
                {submitting ? "Writing..." : "Save Metric Log"}
              </motion.button>
            </form>
          </div>

          {/* Recent logs */}
          {logs.length > 0 && (
            <div className="pt-4 border-t border-white/5 space-y-2">
              <p className="text-[10px] uppercase tracking-widest font-mono text-stone-500 mb-2">
                Recent Weigh-Ins
              </p>
              {[...logs]
                .reverse()
                .slice(0, 5)
                .map((l) => (
                  <div
                    key={l.id}
                    className="flex justify-between items-center p-2.5 rounded-xl bg-dark-900/60 border border-white/5 text-xs"
                  >
                    <span className="text-stone-400 font-mono">{l.dateFormatted}</span>
                    <span className="font-bold text-white">{l.weight} kg</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Dynamic Progression Chart (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-white mb-1">Historical Weight Trajectory</h2>
            <p className="text-xs text-stone-400 mb-6">Chronological trend curve over all weigh-in sessions</p>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-lime border-t-transparent rounded-full animate-spin" />
              </div>
            ) : logs.length < 2 ? (
              <div className="h-64 flex flex-col items-center justify-center text-stone-500">
                <Scale className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">Log at least 2 entries to generate your transformation trajectory.</p>
              </div>
            ) : (
              <div style={{ width: "100%", height: "280px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weightNeonGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C8F36A" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#C8F36A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="dateFormatted"
                      stroke="#4B5563"
                      tick={{ fill: "#6B7280", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#4B5563"
                      tick={{ fill: "#6B7280", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      domain={["dataMin - 1.5", "dataMax + 1.5"]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#C8F36A"
                      strokeWidth={2.5}
                      fill="url(#weightNeonGrad)"
                      dot={{ fill: "#C8F36A", r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#FFFFFF" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
