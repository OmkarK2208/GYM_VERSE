"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Plus, Zap, Search, Sparkles, Clock, Flame } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { calcNutrition, searchFoods } from "@/lib/foodDb";
import { Interactive3DBowl } from "@/components/3d/Interactive3DBowl";

function NutritionRing({ consumed, target, label, color, unit }) {
  const pct = Math.min(consumed / (target || 1), 1);
  const r = 52;
  const C = 2 * Math.PI * r;
  const over = consumed > target;

  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto">
      <svg width="100%" height="100%" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${pct * C} ${C}`}
          style={{ filter: `drop-shadow(0 0 10px ${color})`, transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-black text-white">
          <AnimatedCounter value={consumed} />
        </div>
        <div className="text-[10px] uppercase font-mono text-stone-400 mt-0.5">
          of {target} {unit}
        </div>
        <div className={`text-xs font-bold mt-1 ${over ? "text-rose-400" : "text-lime"}`}>
          {over ? `+${consumed - target} over` : `${target - consumed} left`}
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
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setUser(d);
      });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (sugRef.current && !sugRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        if (isAuto) {
          setCalories("");
          setProtein("");
          setIsAuto(false);
        }
      }
    } else {
      setAutoMatch(null);
    }
  }, [meal, weight]);

  const fetchLogs = async () => {
    const res = await fetch("/api/diet");
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
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
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!calories) return;
    setSubmitting(true);
    const res = await fetch("/api/diet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meal, calories, protein }),
    });
    if (res.ok) {
      setMeal("");
      setWeight("");
      setCalories("");
      setProtein("");
      setAutoMatch(null);
      setIsAuto(false);
      fetchLogs();
    }
    setSubmitting(false);
  };

  // Direct callback from 3D Bowl component
  const handleSave3DBowlMeal = async ({ meal, calories, protein }) => {
    const res = await fetch("/api/diet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meal, calories, protein }),
    });
    if (res.ok) {
      fetchLogs();
    }
  };

  const targetCal = user?.goal === "Bulk" ? 2800 : user?.goal === "Cut" ? 1800 : 2200;
  const targetPro = Math.round((user?.weight || 75) * 2);
  const consumedCal = logs.reduce((s, l) => s + l.calories, 0);
  const consumedPro = logs.reduce((s, l) => s + (l.protein || 0), 0);

  const inputStyle =
    "w-full rounded-xl px-4 py-3 text-white placeholder-stone-600 text-sm outline-none bg-dark-900 border border-white/10 focus:border-lime transition-colors";

  return (
    <div className="space-y-8">
      {/* ───── Page Header ───── */}
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-lime" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">
            NUTRITIONAL BIO-CHEMISTRY
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          3D Nutrition & Macro Studio
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Compose real bowls with physical mass, auto-calculate caloric density, and log nutrients.
        </p>
      </div>

      {/* ───── Dual Ring Bio-Feedback Hero ───── */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-6">
          <div className="text-center">
            <NutritionRing
              consumed={consumedCal}
              target={targetCal}
              label="Calories"
              unit="kcal"
              color={consumedCal > targetCal ? "#F43F5E" : "#C8F36A"}
            />
            <p className="text-xs font-bold text-white mt-2">Energy Balance</p>
          </div>
          <div className="text-center">
            <NutritionRing
              consumed={consumedPro}
              target={targetPro}
              label="Protein"
              unit="g"
              color={consumedPro > targetPro ? "#4ADE80" : "#38BDF8"}
            />
            <p className="text-xs font-bold text-white mt-2">Protein Synthesis</p>
          </div>
        </div>

        {/* 4 Macro Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5">
          <div className="text-center p-3 rounded-xl bg-dark-900/80 border border-white/5">
            <div className="text-xl font-black text-lime">
              <AnimatedCounter value={targetCal} />
            </div>
            <div className="text-[10px] uppercase font-mono text-stone-400">Target kcal</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-dark-900/80 border border-white/5">
            <div className="text-xl font-black text-white">
              <AnimatedCounter value={consumedCal} />
            </div>
            <div className="text-[10px] uppercase font-mono text-stone-400">Consumed kcal</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-dark-900/80 border border-white/5">
            <div className="text-xl font-black text-cyan-gym">
              <AnimatedCounter value={targetPro} />g
            </div>
            <div className="text-[10px] uppercase font-mono text-stone-400">Target Protein</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-dark-900/80 border border-white/5">
            <div className="text-xl font-black text-emerald-400">
              <AnimatedCounter value={consumedPro} />g
            </div>
            <div className="text-[10px] uppercase font-mono text-stone-400">Protein Eaten</div>
          </div>
        </div>
      </div>

      {/* ───── 3D Interactive Bowl Builder Component ───── */}
      <Interactive3DBowl onSaveMeal={handleSave3DBowlMeal} />

      {/* ───── Manual / Quick Food Search & Log ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Log Form */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-black text-white mb-1 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-lime" /> Quick Log Meal
          </h2>
          <p className="text-xs text-stone-400 mb-5 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-lime" /> Search from 100+ foods for instant auto-calculation
          </p>

          <form onSubmit={submit} className="space-y-4">
            {/* Meal search with dropdown */}
            <div className="relative" ref={sugRef}>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5 block">
                Food Name / Recipe
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  value={meal}
                  onChange={(e) => handleMealInput(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length) setShowSuggestions(true);
                  }}
                  placeholder="e.g. Chicken Breast, Moong Sprouts, Oats..."
                  required
                  autoComplete="off"
                  className={`${inputStyle} pl-10`}
                />
              </div>

              {/* Autocomplete suggestions */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute z-20 w-full mt-1.5 rounded-xl overflow-hidden shadow-2xl bg-dark-900 border border-white/10"
                  >
                    {suggestions.map((food) => (
                      <button
                        key={food.name}
                        type="button"
                        onClick={() => selectSuggestion(food)}
                        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/5 text-left border-b border-white/5 last:border-0"
                      >
                        <span className="text-sm font-semibold text-white capitalize">{food.name}</span>
                        <span className="text-[11px] font-mono text-stone-400">
                          {food.cal} kcal • {food.pro}g pro / 100g
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mass in grams */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5 block">
                Portion Weight (Grams)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 150"
                className={inputStyle}
              />
            </div>

            {/* Auto match indicator */}
            {autoMatch && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-lime/10 border border-lime/30 text-xs text-lime">
                <Zap className="h-4 w-4 flex-shrink-0" />
                <span>
                  Auto-calculated: <strong className="capitalize">{autoMatch}</strong> → {calories} kcal, {protein}g protein
                </span>
              </div>
            )}

            {/* Calories & Protein */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5 block">
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => {
                    setCalories(e.target.value);
                    setIsAuto(false);
                  }}
                  required
                  placeholder="kcal"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5 block">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => {
                    setProtein(e.target.value);
                    setIsAuto(false);
                  }}
                  placeholder="grams"
                  className={inputStyle}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl text-sm font-black text-dark-950 bg-lime hover:bg-lime-hover transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(200,243,106,0.3)] flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> {submitting ? "Logging..." : "Log Manual Food"}
            </motion.button>
          </form>
        </div>

        {/* Today's Meals Timeline */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-lime" /> Today's Meal Logs
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="py-16 text-center text-stone-500">
                <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No meals registered today. Build a 3D bowl above!</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {logs.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900/80 border border-white/5"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{l.meal}</div>
                      <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                        {new Date(l.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <span className="text-sm font-black text-lime">{l.calories}</span>
                        <span className="text-[10px] text-stone-500 ml-1">kcal</span>
                      </div>
                      <div>
                        <span className="text-sm font-black text-cyan-gym">{l.protein || 0}</span>
                        <span className="text-[10px] text-stone-500 ml-1">g pro</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
