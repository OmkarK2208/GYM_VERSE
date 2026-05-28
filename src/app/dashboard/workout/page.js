"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Plus, Trophy, Trash2, ChevronDown } from "lucide-react";

const CATEGORIES = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Cardio"];
const CAT_COLORS = { Chest: "#FF2D20", Back: "#3B82F6", Legs: "#10B981", Shoulders: "#8B5CF6", Arms: "#F59E0B", Cardio: "#EC4899" };

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Chest");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState([{ name: "", weight: "", sets: "", reps: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { fetchWorkouts(); }, []);

  const fetchWorkouts = async () => {
    const res = await fetch("/api/workouts");
    if (res.status === 401) { window.location.href = "/login"; return; }
    const data = await res.json();
    setWorkouts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const addExercise = () => setExercises([...exercises, { name: "", weight: "", sets: "", reps: "" }]);
  const removeExercise = (i) => setExercises(exercises.filter((_, idx) => idx !== i));
  const updateEx = (i, field, val) => {
    const updated = [...exercises]; updated[i][field] = val; setExercises(updated);
  };
  const calc1RM = (w, r) => (!w || !r) ? "—" : (parseFloat(w) * (1 + parseInt(r) / 30)).toFixed(1) + " kg";

  const submit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    const res = await fetch("/api/workouts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category, duration, exercises }) });
    if (res.ok) { setCategory("Chest"); setDuration(""); setExercises([{ name: "", weight: "", sets: "", reps: "" }]); fetchWorkouts(); }
    setSubmitting(false);
  };

  const catColor = CAT_COLORS[category] || "#FF2D20";

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-3xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)", boxShadow: "0 0 20px rgba(255,45,32,0.4)" }}>
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          Workout Tracker
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Log your sessions and track your personal records</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
          <h2 className="text-lg font-bold text-white mb-5">Log Workout</h2>
          <form onSubmit={submit} className="space-y-4">
            {/* Category Pills */}
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => setCategory(c)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                    style={{
                      background: category === c ? `${CAT_COLORS[c]}22` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${category === c ? CAT_COLORS[c] + "66" : "rgba(255,255,255,0.07)"}`,
                      color: category === c ? CAT_COLORS[c] : "#6B7280"
                    }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Duration (mins)</label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 45"
                className="w-full bg-transparent rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                onFocus={e => e.target.style.borderColor = catColor}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            </div>

            {/* Exercises */}
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-3 block">Exercises</label>
              <AnimatePresence>
                {exercises.map((ex, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="rounded-xl p-4 mb-3 space-y-3 relative"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {exercises.length > 1 && (
                      <button type="button" onClick={() => removeExercise(i)} className="absolute top-3 right-3 text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <input type="text" placeholder="Exercise name" value={ex.name} onChange={e => updateEx(i, "name", e.target.value)} required
                      className="w-full bg-transparent text-white placeholder-gray-600 text-sm outline-none pb-1"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }} />
                    <div className="grid grid-cols-3 gap-2">
                      {[["weight", "kg"], ["sets", "sets"], ["reps", "reps"]].map(([field, ph]) => (
                        <div key={field}>
                          <input type="number" step={field === "weight" ? "0.5" : "1"} placeholder={ph} value={ex[field]} onChange={e => updateEx(i, field, e.target.value)} required
                            className="w-full text-center bg-transparent rounded-lg px-2 py-2 text-white placeholder-gray-600 text-sm outline-none"
                            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" }} />
                        </div>
                      ))}
                    </div>
                    {(ex.weight && ex.reps) && (
                      <div className="text-right text-xs" style={{ color: catColor }}>Est 1RM: {calc1RM(ex.weight, ex.reps)}</div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <button type="button" onClick={addExercise}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-all"
                style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                <Plus className="w-4 h-4" /> Add Exercise
              </button>
            </div>

            <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: `linear-gradient(135deg,${catColor},${catColor}bb)`, boxShadow: `0 0 20px ${catColor}33`, opacity: submitting ? 0.6 : 1 }}>
              {submitting ? "Saving..." : "Save Workout 🔥"}
            </motion.button>
          </form>
        </motion.div>

        {/* History */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-4">
          <h2 className="text-lg font-bold text-white">Workout History</h2>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
            ))}</div>
          ) : workouts.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Dumbbell className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No workouts yet. Start crushing it!</p>
            </div>
          ) : (
            workouts.map((w, i) => {
              const vol = w.exercises.reduce((a, ex) => a + ex.weight * ex.reps * ex.sets, 0);
              const color = CAT_COLORS[w.category] || "#FF2D20";
              const isExpanded = expanded === w.id;
              return (
                <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "rgba(15,15,22,0.8)", border: `1px solid rgba(255,255,255,0.07)`, backdropFilter: "blur(16px)" }}>
                  <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : w.id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                        <Dumbbell className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{w.category} Workout</span>
                          {w.exercises.some(e => e.isPr) && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-400" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
                              🏆 NEW PR
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {w.duration ? `${w.duration} mins` : "—"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color }}>{vol.toLocaleString()} kg</div>
                        <div className="text-[10px] text-gray-600">volume</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="px-5 pb-5 space-y-2 border-t border-white/5 pt-4">
                          {w.exercises.map(ex => (
                            <div key={ex.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                              style={{ background: "rgba(255,255,255,0.03)" }}>
                              <span className="text-sm text-gray-300 flex items-center gap-2">
                                {ex.name}
                                {ex.isPr && <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />}
                              </span>
                              <span className="text-xs text-gray-500">{ex.weight}kg × {ex.sets}×{ex.reps}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
