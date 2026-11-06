"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Zap, Target, Trophy, Droplets, Utensils, Dumbbell, Scale, Sparkles, ArrowUpRight } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Interactive3DWaterGlass } from "@/components/3d/Interactive3DWaterGlass";
import { Interactive3DTrophy } from "@/components/3d/Interactive3DTrophy";
import Link from "next/link";

const STAT_CARDS = [
  { key: "streak", label: "Training Streak", unit: "days", icon: Flame, color: "#C8F36A" },
  { key: "todayVolume", label: "Session Volume", unit: "kg", icon: Zap, color: "#38BDF8" },
  { key: "bmi", label: "Body Mass Index", unit: "BMI", icon: Target, color: "#A78BFA" },
  { key: "weight", label: "Current Weight", unit: "kg", icon: Scale, color: "#F472B6" },
  { key: "workoutsCount", label: "Workouts Today", unit: "sessions", icon: Dumbbell, color: "#FBBF24" },
  { key: "targetCals", label: "Daily Energy Target", unit: "kcal", icon: Utensils, color: "#4ADE80" },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/login";
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d && !d.error) {
          setData(d);
          setLoading(false);
        } else if (d?.error) {
          window.location.href = "/login";
        }
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  const addWater = async (amount = 0.5) => {
    await fetch("/api/water", { method: "POST" });
    setData((prev) => ({ ...prev, waterAmount: (prev.waterAmount || 0) + amount }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-lime border-t-transparent animate-spin" />
        <p className="text-xs font-mono uppercase tracking-[3px] text-stone-500">
          Calibrating 3D Gymverse Matrix...
        </p>
      </div>
    );
  }

  const athleteName = data?.user?.name?.split(" ")[0] ?? "Athlete";
  const targetCals = data?.user?.goal === "Bulk" ? 2800 : data?.user?.goal === "Cut" ? 1800 : 2200;
  const targetProtein = Math.round((data?.user?.weight || 75) * 2);

  const getStatValue = (key) => {
    if (key === "targetCals") return targetCals;
    if (key === "weight") return data?.user?.weight ?? 0;
    if (key === "bmi") return data?.bmi ?? 0;
    return data?.[key] ?? 0;
  };

  return (
    <div className="space-y-8">
      {/* ───── Hero Banner — Squarespace Style Bold Editorial ───── */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-10">
        {/* Ambient atmospheric gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-gym/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-lime animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-lime">
                STATION READY • GOAL: {data?.user?.goal ?? "MAINTAIN"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1]">
              WELCOME BACK, <br />
              <span className="text-gradient-lime">{athleteName.toUpperCase()}.</span>
            </h1>
            <p className="mt-3 text-sm text-stone-400 max-w-lg leading-relaxed">
              Your 3D training universe is synchronized. Track sets, drop meals into the 3D physics bowl, and maintain hydration.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/workout"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lime hover:bg-lime-hover text-dark-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(200,243,106,0.3)] hover:scale-105 active:scale-95"
            >
              <Dumbbell className="h-4 w-4" /> Start Workout
            </Link>
            <Link
              href="/dashboard/diet"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider transition-all border border-white/10"
            >
              <Utensils className="h-4 w-4" /> 3D Bowl Builder
            </Link>
          </div>
        </div>
      </div>

      {/* ───── 3D Interactive Center Stage: Water Hydration + PR Trophy ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive 3D Water Glass Station (Takes 2 cols on desktop) */}
        <div className="lg:col-span-2">
          <Interactive3DWaterGlass
            currentLitres={data?.waterAmount || 0}
            targetLitres={6}
            onAddWater={addWater}
          />
        </div>

        {/* Interactive 3D Trophy / PR Showcase */}
        <div>
          <Interactive3DTrophy
            prName={data?.prOfTheDay?.name || "Record Milestone"}
            prWeight={data?.prOfTheDay?.weight || 0}
            isCelebration={!!data?.prOfTheDay}
          />
        </div>
      </div>

      {/* ───── Metric Grid — 3D Glass Tiles ───── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-lime" /> Telemetric Performance Matrix
          </h3>
          <span className="text-xs font-mono text-stone-500">REAL-TIME DATA SYNC</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {STAT_CARDS.map((stat, i) => {
            const Icon = stat.icon;
            const val = getStatValue(stat.key);
            const isFloat = typeof val === "number" && !Number.isInteger(val);

            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-3d glass-panel-hover glass-panel relative rounded-2xl p-5 border border-white/10 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${stat.color}18`,
                      border: `1px solid ${stat.color}40`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase">
                    {stat.unit}
                  </span>
                </div>

                <div className="text-3xl font-black text-white tracking-tight">
                  <AnimatedCounter value={val} decimals={isFloat ? 1 : 0} />
                </div>
                <div className="text-xs text-stone-400 mt-1 font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ───── Nutrition Targets Breakdown ───── */}
      <div className="glass-panel rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-black text-white">Daily Macro Fuel Protocol</h4>
            <p className="text-xs text-stone-400">Target metrics tailored to your {data?.user?.goal || "Maintain"} objective</p>
          </div>
          <Link
            href="/dashboard/diet"
            className="flex items-center gap-1 text-xs font-bold text-lime hover:underline"
          >
            Open 3D Kitchen <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-dark-900/80 border border-white/5 p-4 text-center">
            <div className="text-2xl font-black text-lime">{targetCals}</div>
            <div className="text-xs font-semibold text-white mt-1">Calorie Target</div>
            <div className="text-[10px] text-stone-500">kcal / day</div>
          </div>
          <div className="rounded-xl bg-dark-900/80 border border-white/5 p-4 text-center">
            <div className="text-2xl font-black text-emerald-400">{targetProtein}g</div>
            <div className="text-xs font-semibold text-white mt-1">Optimal Protein</div>
            <div className="text-[10px] text-stone-500">2g per kg bodyweight</div>
          </div>
          <div className="rounded-xl bg-dark-900/80 border border-white/5 p-4 text-center">
            <div className="text-2xl font-black text-cyan-gym">{data?.workoutsCount ?? 0}</div>
            <div className="text-xs font-semibold text-white mt-1">Workouts Logged</div>
            <div className="text-[10px] text-stone-500">Active today</div>
          </div>
        </div>
      </div>
    </div>
  );
}
