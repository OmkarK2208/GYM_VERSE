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
  { key: "waterAmount",   label: "Water",           unit: "/ 6 L", icon: Droplets, from: "#06B6D4", to: "#0EA5E9" },
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
    setData(prev => ({ ...prev, waterAmount: (prev.waterAmount || 0) + 0.5 }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="w-14 h-14 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(200,243,106,0.2)", borderTopColor: "#C8F36A", boxShadow: "0 0 20px rgba(200,243,106,0.2)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full" style={{ background: "#C8F36A" }} />
          </div>
        </div>
        <p className="text-xs tracking-[3px] uppercase" style={{ color: "#5C5E58" }}>Loading</p>
      </div>
    </div>
  );

  const getName = () => data?.user?.name?.split(" ")[0] ?? "Athlete";
  const getHour = () => { const h = new Date().getHours(); if (h < 12) return "Morning"; if (h < 17) return "Afternoon"; return "Evening"; };
  const waterPct = Math.min(((data?.waterAmount || 0) / 6) * 100, 100);
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
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl"
        style={{ background: "linear-gradient(135deg,rgba(200,243,106,0.06) 0%,rgba(14,16,18,0) 55%,rgba(14,16,18,0) 100%)", border: "1px solid rgba(200,243,106,0.1)" }}
      >
        {/* Background bleed */}
        <div className="absolute top-0 left-0 w-72 h-72 pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle,rgba(200,243,106,0.15),transparent 70%)", filter: "blur(40px)", transform: "translate(-25%,-30%)" }} />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left */}
          <div>
            <p className="text-[10px] uppercase tracking-[5px] mb-2" style={{ color: "#5C5E58" }}>Good {getHour()}</p>
            <h1 className="text-3xl sm:text-5xl font-black leading-none mb-3" style={{ color: "#F2F0EA" }}>
              Welcome back,{" "}
              <span style={{ color: "#C8F36A" }}>{getName()}</span>
            </h1>
            <p className="text-xs sm:text-sm italic max-w-md" style={{ color: "#5C5E58" }}>"{quote}"</p>
          </div>
          {/* Right badges */}
          <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 flex-shrink-0">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(200,243,106,0.1)", border: "1px solid rgba(200,243,106,0.2)", color: "#C8F36A" }}>
              Goal: {data?.user?.goal ?? "Maintain"}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9A9B95" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Grid 2×4 / 4×2 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
              whileHover={{ y: -4, boxShadow: `0 24px 48px rgba(0,0,0,0.5), 0 0 24px rgba(200,243,106,0.06)` }}
              className="relative rounded-2xl p-4 sm:p-5 cursor-default overflow-hidden"
              style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
            >
              {/* Corner lime glow */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20 rounded-bl-full"
                style={{ background: `radial-gradient(circle,${card.from},transparent)` }} />

              {/* Icon badge — top-right */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg,${card.from}22,${card.to}11)`, border: `1px solid ${card.from}33` }}>
                <Icon className="w-4 h-4" style={{ color: card.from }} />
              </div>

              <div className="mt-1 mb-2">
                <div className="text-2xl sm:text-3xl font-black leading-none" style={{ color: "#F2F0EA" }}>
                  {isText ? (typeof value === "string" ? value : "None yet") : (
                    <AnimatedCounter value={typeof value === "number" ? value : 0} decimals={card.unit === "kg" && typeof value === "number" && !Number.isInteger(value) ? 1 : 0} />
                  )}
                </div>
              </div>
              <div className="text-[10px] sm:text-xs font-medium" style={{ color: "#5C5E58" }}>
                {card.label}{card.unit && <span className="ml-1" style={{ color: "#3A3B37" }}>{card.unit}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Water + Nutrition Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Water Tracker */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-2xl p-6"
          style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "#F2F0EA" }}>
                <Droplets className="w-4 h-4" style={{ color: "#C8F36A" }} /> Water Intake
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "#5C5E58" }}>Daily hydration goal: 6 Litres</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(200,243,106,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={addWater}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ background: "#C8F36A", color: "#0A0C0E" }}
            >
              + 0.5L
            </motion.button>
          </div>

          {/* 12 glass icons */}
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {Array.from({ length: 12 }).map((_, i) => {
              const filled = i < (data?.waterAmount || 0) * 2;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.04 }}
                  className="w-7 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    background: filled ? "rgba(200,243,106,0.12)" : "rgba(255,255,255,0.03)",
                    border: filled ? "1px solid rgba(200,243,106,0.35)" : "1px solid rgba(255,255,255,0.05)",
                    boxShadow: filled ? "0 0 10px rgba(200,243,106,0.15)" : "none",
                  }}
                >
                  <Droplets className={`w-3.5 h-3.5 transition-colors`}
                    style={{ color: filled ? "#C8F36A" : "#3A3B37" }} />
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${waterPct}%` }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#C8F36A,#9DD64A)", boxShadow: "0 0 8px rgba(200,243,106,0.4)" }}
            />
          </div>
          <p className="text-right text-xs" style={{ color: "#5C5E58" }}>
            <span style={{ color: "#C8F36A", fontWeight: 700 }}>{data?.waterAmount || 0}</span> / 6L
          </p>
        </motion.div>

        {/* Nutrition Targets */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-2xl p-6"
          style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <h3 className="text-base font-bold mb-1" style={{ color: "#F2F0EA" }}>Nutrition Targets</h3>
          <p className="text-xs mb-6" style={{ color: "#5C5E58" }}>
            Based on your <span style={{ color: "#C8F36A" }}>{data?.user?.goal}</span> goal
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Calories", value: targetCals, unit: "kcal", color: "#C8F36A" },
              { label: "Protein",  value: Math.round((data?.user?.weight || 70) * 2), unit: "g", color: "#A78BFA" },
              { label: "Workouts", value: data?.workoutsCount ?? 0, unit: "today", color: "#60A5FA" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-4 text-center"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="text-2xl font-black mb-1" style={{ color: item.color }}>
                  <AnimatedCounter value={item.value} />
                </div>
                <div className="text-[10px] font-medium mb-0.5" style={{ color: "#9A9B95" }}>{item.label}</div>
                <div className="text-[9px]" style={{ color: "#5C5E58" }}>{item.unit}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Motivational Quote ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}
        className="text-center py-6"
      >
        <p className="text-sm italic max-w-lg mx-auto leading-relaxed" style={{ color: "#3A3B37" }}>
          "{quote}"
        </p>
      </motion.div>
    </div>
  );
}
