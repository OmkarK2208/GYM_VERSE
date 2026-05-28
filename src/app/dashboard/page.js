"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Zap, Target, Trophy, Droplets, Utensils, Dumbbell, Scale } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const CARDS = [
  { key: "streak",        label: "Streak",          unit: "days",   icon: Flame,    from: "#FF6B35", to: "#FF2D20" },
  { key: "todayVolume",   label: "Today's Volume",  unit: "kg",     icon: Zap,      from: "#3B82F6", to: "#06B6D4" },
  { key: "bmi",           label: "BMI",             unit: "",       icon: Target,   from: "#8B5CF6", to: "#EC4899" },
  { key: "pr",            label: "PR Today",        unit: "",       icon: Trophy,   from: "#F59E0B", to: "#FBBF24", isPr: true },
  { key: "waterGlasses",  label: "Water",           unit: "/ 8 gl", icon: Droplets, from: "#06B6D4", to: "#0EA5E9" },
  { key: "targetCals",    label: "Target Calories", unit: "kcal",   icon: Utensils, from: "#10B981", to: "#34D399" },
  { key: "workoutsCount", label: "Workouts Today",  unit: "",       icon: Dumbbell, from: "#FF2D20", to: "#FF6B35" },
  { key: "weight",        label: "Current Weight",  unit: "kg",     icon: Scale,    from: "#A855F7", to: "#7C3AED" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" } }),
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => { if (r.status === 401) { window.location.href = "/login"; return null; } return r.json(); })
      .then(d => { if (d && !d.error) { setData(d); setLoading(false); } else if (d?.error) { window.location.href = "/login"; } })
      .catch(() => { window.location.href = "/login"; });
  }, []);

  const addWater = async () => {
    await fetch("/api/water", { method: "POST" });
    setData(prev => ({ ...prev, waterGlasses: (prev.waterGlasses || 0) + 1 }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm tracking-widest uppercase">Loading...</p>
      </div>
    </div>
  );

  const getName = () => data?.user?.name?.split(" ")[0] ?? "Athlete";
  const getHour = () => { const h = new Date().getHours(); if (h < 12) return "Morning"; if (h < 17) return "Afternoon"; return "Evening"; };
  const waterPct = Math.min(((data?.waterGlasses || 0) / 8) * 100, 100);
  const targetCals = data?.user?.goal === "Bulk" ? 2800 : data?.user?.goal === "Cut" ? 1800 : 2200;

  const getValue = (key) => {
    if (key === "pr") return data?.prOfTheDay?.name ?? "None yet";
    if (key === "targetCals") return targetCals;
    if (key === "weight") return data?.user?.weight ?? 0;
    if (key === "bmi") return data?.bmi ?? 0;
    return data?.[key] ?? 0;
  };

  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.",
  ];
  const quote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden p-5 sm:p-8"
        style={{ background: "linear-gradient(135deg,rgba(255,45,32,0.12) 0%,rgba(10,10,15,0) 60%)", border: "1px solid rgba(255,45,32,0.15)" }}
      >
        {/* Background glow blob */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle,#FF2D20,transparent)", filter: "blur(60px)", transform: "translate(-30%,-30%)" }} />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[4px] text-gray-500 mb-1">Good {getHour()}</p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3">
            Welcome back, <span style={{ background: "linear-gradient(90deg,#FF2D20,#FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{getName()}</span> 💪
          </h1>
          <p className="text-gray-400 max-w-xl italic text-xs sm:text-sm">"{quote}"</p>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30 text-red-400"
              style={{ background: "rgba(255,45,32,0.1)" }}>
              Goal: {data?.user?.goal ?? "Maintain"}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-white/10 text-gray-400"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          const value = getValue(card.key);
          const isText = card.isPr;
          return (
            <motion.div
              key={card.key}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="show"
              whileHover={{ y: -4, boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${card.from}22` }}
              className="relative rounded-2xl p-5 cursor-default overflow-hidden"
              style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
            >
              {/* Subtle corner glow */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none rounded-bl-full"
                style={{ background: `radial-gradient(circle,${card.from},transparent)` }} />
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg,${card.from},${card.to})`, boxShadow: `0 0 16px ${card.from}55` }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-black text-white leading-none mb-1">
                {isText ? (typeof value === "string" ? value : "None yet") : (
                  <AnimatedCounter value={typeof value === "number" ? value : 0} decimals={card.unit === "kg" && typeof value === "number" && !Number.isInteger(value) ? 1 : 0} />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">{card.label} {card.unit && <span className="text-gray-600">{card.unit}</span>}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Water + Goals Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Tracker */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-2xl p-6"
          style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-400" /> Water Intake
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">Daily hydration goal: 8 glasses</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={addWater}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg,#06B6D4,#0EA5E9)" }}
            >
              + 1 Glass
            </motion.button>
          </div>
          {/* Glass icons */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="w-8 h-10 rounded-lg flex items-center justify-center border transition-all duration-300"
                style={{
                  background: i < (data?.waterGlasses || 0) ? "linear-gradient(180deg,rgba(6,182,212,0.3),rgba(14,165,233,0.1))" : "rgba(255,255,255,0.04)",
                  borderColor: i < (data?.waterGlasses || 0) ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.06)",
                }}
              >
                <Droplets className={`w-4 h-4 transition-colors ${i < (data?.waterGlasses || 0) ? "text-cyan-400" : "text-gray-700"}`} />
              </motion.div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${waterPct}%` }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#06B6D4,#0EA5E9)" }}
            />
          </div>
          <p className="text-right text-xs text-gray-500 mt-2">{data?.waterGlasses || 0} / 8 glasses</p>
        </motion.div>

        {/* Nutrition Goals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-2xl p-6"
          style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
        >
          <h3 className="text-white font-bold text-lg mb-1">Nutrition Targets</h3>
          <p className="text-gray-500 text-xs mb-5">Based on your <span className="text-red-400">{data?.user?.goal}</span> goal</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Calories", value: targetCals, unit: "kcal", from: "#FF2D20", to: "#FF6B35" },
              { label: "Protein",  value: Math.round((data?.user?.weight || 70) * 2), unit: "g", from: "#8B5CF6", to: "#EC4899" },
              { label: "Workouts", value: data?.workoutsCount ?? 0, unit: "today", from: "#10B981", to: "#34D399" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="text-xl font-black" style={{ background: `linear-gradient(135deg,${item.from},${item.to})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  <AnimatedCounter value={item.value} />
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">{item.label}</div>
                <div className="text-[10px] text-gray-600">{item.unit}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
