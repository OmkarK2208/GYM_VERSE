"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Plus, Zap, Search } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { calcNutrition, searchFoods } from "@/lib/foodDb";

function NutritionRing({ consumed, target, label, color }) {
  const pct = Math.min(consumed / (target || 1), 1);
  const r = 52, C = 2 * Math.PI * r;
  const over = consumed > target;
  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto">
      <svg width="100%" height="100%" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={`${pct * C} ${C}`}
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dasharray 0.8s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-black" style={{ color: "#F2F0EA" }}><AnimatedCounter value={consumed} /></div>
        <div className="text-[10px] mt-1" style={{ color: "#5C5E58" }}>of {target} {label}</div>
        <div className="text-xs font-semibold mt-1" style={{ color: over ? "#f87171" : "#4ade80" }}>
          {over ? `${consumed - target} over` : `${target - consumed} left`}
        </div>
      </div>
    </div>
  );
}

export default function DietTracker() {
  const [logs, setLogs] = useState([]);
  const [meal, setMeal] = useState("");
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoMatch, setAutoMatch] = useState(null);
  const [isAuto, setIsAuto] = useState(false);
  const sugRef = useRef(null);

  useEffect(() => {
    fetchLogs();
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (!d.error) setUser(d); });
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => { if (sugRef.current && !sugRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("touchstart", handler); };
  }, []);

  // Auto-calculate when meal or weight changes
  useEffect(() => {
    if (meal && weight) {
      const result = calcNutrition(meal, weight);
      if (result) {
        setCalories(String(result.calories));
        setProtein(String(result.protein));
        setAutoMatch(result.matchedFood);
        setIsAuto(true);
      } else {
        setAutoMatch(null);
        if (isAuto) { setCalories(""); setProtein(""); setIsAuto(false); }
      }
    } else {
      setAutoMatch(null);
    }
  }, [meal, weight]);

  const fetchLogs = async () => {
    const res = await fetch("/api/diet");
    if (res.status === 401) { window.location.href = "/login"; return; }
    const data = await res.json();
    if (Array.isArray(data)) setLogs(data);
    setLoading(false);
  };

  const handleMealInput = (value) => {
    setMeal(value);
    const results = searchFoods(value);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
  };

  const selectSuggestion = (food) => {
    setMeal(food.name.charAt(0).toUpperCase() + food.name.slice(1));
    setShowSuggestions(false);
    // If weight already entered, auto-calc will trigger via useEffect
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!calories) return;
    setSubmitting(true);
    const res = await fetch("/api/diet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meal, calories, protein })
    });
    if (res.ok) { setMeal(""); setWeight(""); setCalories(""); setProtein(""); setAutoMatch(null); setIsAuto(false); fetchLogs(); }
    setSubmitting(false);
  };

  const targetCal = user?.goal === "Bulk" ? 2800 : user?.goal === "Cut" ? 1800 : 2200;
  const targetPro = Math.round((user?.weight || 70) * 2);
  const consumedCal = logs.reduce((s, l) => s + l.calories, 0);
  const consumedPro = logs.reduce((s, l) => s + (l.protein || 0), 0);

  const inputStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#F2F0EA",
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[10px] uppercase tracking-[5px] mb-1" style={{ color: "#5C5E58" }}>Nutrition</p>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ color: "#F2F0EA" }}>
          DIET <span style={{ color: "#C8F36A" }}>PLANNER</span>
        </h1>
      </motion.div>

      {/* ── Stats Hero: Dual Rings ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 sm:p-8"
        style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)" }}>

        <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-6">
          <div className="text-center">
            <NutritionRing consumed={consumedCal} target={targetCal} label="kcal" color={consumedCal > targetCal ? "#f87171" : "#C8F36A"} />
            <p className="text-xs font-semibold mt-2" style={{ color: "#9A9B95" }}>Calories</p>
          </div>
          <div className="text-center">
            <NutritionRing consumed={consumedPro} target={targetPro} label="g" color={consumedPro > targetPro ? "#4ade80" : "#A78BFA"} />
            <p className="text-xs font-semibold mt-2" style={{ color: "#9A9B95" }}>Protein</p>
          </div>
        </div>

        {/* 4 stat chips */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: "Cal Target", value: targetCal, unit: "kcal", color: "#C8F36A" },
            { label: "Cal Eaten",  value: consumedCal, unit: "kcal", color: "#4ade80" },
            { label: "Pro Target", value: targetPro, unit: "g", color: "#A78BFA" },
            { label: "Pro Eaten",  value: consumedPro, unit: "g", color: "#60A5FA" },
          ].map(m => (
            <div key={m.label} className="text-center p-2 sm:p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="text-lg sm:text-xl font-black" style={{ color: m.color }}>
                <AnimatedCounter value={m.value} />
              </div>
              <div className="text-[9px] sm:text-[10px] mt-0.5" style={{ color: "#5C5E58" }}>{m.unit}</div>
              <div className="text-[9px] sm:text-[10px]" style={{ color: "#9A9B95" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Form Panel ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-5 sm:p-6"
          style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)" }}>

          <h2 className="text-base font-bold mb-1" style={{ color: "#F2F0EA" }}>Log Meal</h2>
          <p className="text-xs mb-5 flex items-center gap-1.5" style={{ color: "#5C5E58" }}>
            <Zap className="w-3 h-3" style={{ color: "#C8F36A" }} />
            Type a food name — calories &amp; protein auto-calculate
          </p>

          <form onSubmit={submit} className="space-y-4">
            {/* Meal name + suggestions */}
            <div className="relative" ref={sugRef}>
              <label className="text-[10px] uppercase tracking-[3px] mb-2 block" style={{ color: "#5C5E58" }}>Meal / Food Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5C5E58" }} />
                <input type="text" value={meal} onChange={e => handleMealInput(e.target.value)}
                  onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
                  placeholder="e.g. Chicken Breast, Rice, Banana..."
                  required autoComplete="off"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "rgba(200,243,106,0.4)"; e.target.style.boxShadow = "0 0 0 1px rgba(200,243,106,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }} />
              </div>

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="absolute z-20 w-full mt-1 rounded-xl overflow-hidden shadow-2xl"
                    style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {suggestions.map((food) => (
                      <button key={food.name} type="button"
                        onClick={() => selectSuggestion(food)}
                        className="w-full px-4 py-2.5 flex items-center justify-between transition-colors text-left"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(200,243,106,0.05)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <span className="text-sm capitalize" style={{ color: "#F2F0EA" }}>{food.name}</span>
                        <span className="text-[11px]" style={{ color: "#5C5E58" }}>{food.cal} kcal · {food.pro}g pro /100g</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Weight */}
            <div>
              <label className="text-[10px] uppercase tracking-[3px] mb-2 block" style={{ color: "#5C5E58" }}>Weight (grams)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                placeholder="e.g. 200"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(200,243,106,0.4)"; e.target.style.boxShadow = "0 0 0 1px rgba(200,243,106,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }} />
            </div>

            {/* Auto-match indicator */}
            {autoMatch && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ background: "rgba(200,243,106,0.08)", border: "1px solid rgba(200,243,106,0.2)" }}>
                <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#C8F36A" }} />
                <span style={{ color: "#C8F36A" }}>
                  Auto-matched: <span className="font-bold capitalize">{autoMatch}</span> → {calories} kcal, {protein}g protein
                </span>
              </motion.div>
            )}

            {/* Calories & Protein */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-[3px] mb-2 block" style={{ color: "#5C5E58" }}>
                  Calories {isAuto && <span style={{ color: "#C8F36A" }} className="normal-case">(auto)</span>}
                </label>
                <input type="number" value={calories}
                  onChange={e => { setCalories(e.target.value); setIsAuto(false); }}
                  placeholder="kcal" required
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{ ...inputStyle, ...(isAuto ? { borderColor: "rgba(200,243,106,0.3)" } : {}) }}
                  onFocus={e => { e.target.style.borderColor = "rgba(200,243,106,0.4)"; }}
                  onBlur={e => { e.target.style.borderColor = isAuto ? "rgba(200,243,106,0.3)" : "rgba(255,255,255,0.08)"; }} />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[3px] mb-2 block" style={{ color: "#5C5E58" }}>
                  Protein {isAuto && <span style={{ color: "#C8F36A" }} className="normal-case">(auto)</span>}
                </label>
                <input type="number" value={protein}
                  onChange={e => { setProtein(e.target.value); setIsAuto(false); }}
                  placeholder="grams"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{ ...inputStyle, ...(isAuto ? { borderColor: "rgba(200,243,106,0.3)" } : {}) }}
                  onFocus={e => { e.target.style.borderColor = "rgba(200,243,106,0.4)"; }}
                  onBlur={e => { e.target.style.borderColor = isAuto ? "rgba(200,243,106,0.3)" : "rgba(255,255,255,0.08)"; }} />
              </div>
            </div>

            <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-xl text-sm font-black tracking-wide flex items-center justify-center gap-2 transition-all"
              style={{ background: "#C8F36A", color: "#0A0C0E", boxShadow: "0 0 24px rgba(200,243,106,0.2)", opacity: submitting ? 0.6 : 1 }}>
              <Plus className="w-4 h-4" /> {submitting ? "Adding..." : "Add Meal →"}
            </motion.button>
          </form>
        </motion.div>

        {/* ── Meal Log ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl p-5 sm:p-6"
          style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)" }}>

          <h2 className="text-base font-bold mb-5" style={{ color: "#F2F0EA" }}>Today's Meals</h2>

          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}</div>
          ) : logs.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center gap-3">
              {/* SVG plate illustration */}
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="36" r="22" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
                <circle cx="32" cy="36" r="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
                <path d="M20 14 C20 10 44 10 44 14" stroke="rgba(200,243,106,0.2)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="32" y1="10" x2="32" y2="18" stroke="rgba(200,243,106,0.2)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div className="text-center">
                <p className="font-bold mb-1" style={{ color: "#9A9B95" }}>No meals logged today</p>
                <p className="text-sm" style={{ color: "#5C5E58" }}>Track your nutrition above</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              <AnimatePresence>
                {logs.map((l, i) => (
                  <motion.div key={l.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between px-4 py-3 rounded-xl transition-colors"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#F2F0EA" }}>{l.meal}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: "#5C5E58" }}>
                        {new Date(l.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ background: "rgba(200,243,106,0.1)", color: "#C8F36A", border: "1px solid rgba(200,243,106,0.15)" }}>
                        {l.calories} kcal
                      </div>
                      <div className="px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ background: "rgba(167,139,250,0.1)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.15)" }}>
                        {l.protein || 0}g
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
