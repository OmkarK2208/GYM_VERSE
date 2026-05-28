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
        <div className="text-2xl font-black text-white"><AnimatedCounter value={consumed} /></div>
        <div className="text-[10px] text-gray-500 mt-1">of {target} {label}</div>
        <div className={`text-xs font-semibold mt-1 ${over ? "text-red-400" : "text-green-400"}`}>
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

  const inputStyle = "w-full bg-transparent rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none border border-white/[0.08] bg-white/[0.03] focus:border-green-500/40 transition-colors";

  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-3xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10B981,#34D399)", boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}>
            <Utensils className="w-5 h-5 text-white" />
          </div>
          Diet Planner
        </h1>
      </motion.div>

      {/* Dual Ring Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 sm:p-8" style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-6">
          <div className="text-center">
            <NutritionRing consumed={consumedCal} target={targetCal} label="kcal" color={consumedCal > targetCal ? "#FF2D20" : "#FF6B35"} />
            <p className="text-xs text-gray-500 mt-2 font-semibold">Calories</p>
          </div>
          <div className="text-center">
            <NutritionRing consumed={consumedPro} target={targetPro} label="g" color={consumedPro > targetPro ? "#34D399" : "#8B5CF6"} />
            <p className="text-xs text-gray-500 mt-2 font-semibold">Protein</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: "Cal Target", value: targetCal, unit: "kcal", from: "#FF2D20", to: "#FF6B35" },
            { label: "Cal Eaten", value: consumedCal, unit: "kcal", from: "#10B981", to: "#34D399" },
            { label: "Pro Target", value: targetPro, unit: "g", from: "#8B5CF6", to: "#EC4899" },
            { label: "Pro Eaten", value: consumedPro, unit: "g", from: "#06B6D4", to: "#0EA5E9" },
          ].map(m => (
            <div key={m.label} className="text-center p-2 sm:p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-lg sm:text-xl font-black" style={{ background: `linear-gradient(135deg,${m.from},${m.to})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                <AnimatedCounter value={m.value} />
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5">{m.unit}</div>
              <div className="text-[9px] sm:text-[10px] text-gray-500">{m.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-5 sm:p-6" style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-lg font-bold text-white mb-1">Log Meal</h2>
          <p className="text-xs text-gray-500 mb-5 flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" /> Type a food name — calories & protein auto-calculate
          </p>
          <form onSubmit={submit} className="space-y-4">
            {/* Meal name with suggestions */}
            <div className="relative" ref={sugRef}>
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Meal / Food Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input type="text" value={meal} onChange={e => handleMealInput(e.target.value)}
                  onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
                  placeholder="e.g. Chicken Breast, Rice, Banana..."
                  required autoComplete="off"
                  className={inputStyle + " pl-10"} />
              </div>
              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="absolute z-20 w-full mt-1 rounded-xl overflow-hidden shadow-2xl"
                    style={{ background: "#0F0F16", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {suggestions.map((food) => (
                      <button key={food.name} type="button"
                        onClick={() => selectSuggestion(food)}
                        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors text-left">
                        <span className="text-sm text-white capitalize">{food.name}</span>
                        <span className="text-[11px] text-gray-500">{food.cal} kcal • {food.pro}g pro /100g</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Weight input */}
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Weight (grams)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                placeholder="e.g. 200" className={inputStyle} />
            </div>

            {/* Auto-match indicator */}
            {autoMatch && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <Zap className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                <span className="text-green-400">
                  Auto-matched: <span className="font-bold capitalize">{autoMatch}</span> → {calories} kcal, {protein}g protein
                </span>
              </motion.div>
            )}

            {/* Calories & Protein (auto-filled or manual) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                  Calories {isAuto && <span className="text-green-400 normal-case">(auto)</span>}
                </label>
                <input type="number" value={calories}
                  onChange={e => { setCalories(e.target.value); setIsAuto(false); }}
                  placeholder="kcal" required
                  className={inputStyle}
                  style={isAuto ? { borderColor: "rgba(16,185,129,0.3)" } : {}} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                  Protein {isAuto && <span className="text-green-400 normal-case">(auto)</span>}
                </label>
                <input type="number" value={protein}
                  onChange={e => { setProtein(e.target.value); setIsAuto(false); }}
                  placeholder="grams"
                  className={inputStyle}
                  style={isAuto ? { borderColor: "rgba(16,185,129,0.3)" } : {}} />
              </div>
            </div>

            <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#10B981,#34D399)", boxShadow: "0 0 20px rgba(16,185,129,0.3)", opacity: submitting ? 0.6 : 1 }}>
              <Plus className="w-4 h-4" /> {submitting ? "Adding..." : "Add Meal"}
            </motion.button>
          </form>
        </motion.div>

        {/* Meal Log */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl p-5 sm:p-6" style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-lg font-bold text-white mb-5">Today's Meals</h2>
          {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)}</div>
            : logs.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-gray-600">
                <Utensils className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">No meals logged today</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {logs.map((l, i) => (
                    <motion.div key={l.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div>
                        <div className="text-sm font-semibold text-white">{l.meal}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {new Date(l.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <span className="text-sm font-bold text-orange-400">{l.calories}</span>
                          <span className="text-[10px] text-gray-600 ml-0.5">kcal</span>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-purple-400">{l.protein || 0}</span>
                          <span className="text-[10px] text-gray-600 ml-0.5">g</span>
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
