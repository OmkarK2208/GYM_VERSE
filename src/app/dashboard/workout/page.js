"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Plus, Trophy, Trash2, ChevronDown } from "lucide-react";

const CATEGORIES = ["Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Abs", "Cardio"];
const CAT_COLORS = { Chest: "#FF2D20", Back: "#3B82F6", Legs: "#10B981", Shoulders: "#8B5CF6", Biceps: "#F59E0B", Triceps: "#FF6B35", Abs: "#06B6D4", Cardio: "#EC4899" };

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Chest");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState([{ name: "", sets: [{ weight: "", reps: "" }] }]);
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

  const addExercise = () => setExercises([...exercises, { name: "", sets: [{ weight: "", reps: "" }] }]);
  const removeExercise = (i) => setExercises(exercises.filter((_, idx) => idx !== i));
  const updateExName = (i, val) => {
    const updated = [...exercises]; updated[i].name = val; setExercises(updated);
  };
  const addSet = (exIdx) => {
    const updated = [...exercises];
    const lastSet = updated[exIdx].sets[updated[exIdx].sets.length - 1];
    updated[exIdx].sets.push({
      weight: lastSet ? lastSet.weight : "",
      reps: lastSet ? lastSet.reps : ""
    });
    setExercises(updated);
  };
  const removeSet = (exIdx, setIdx) => {
    const updated = [...exercises];
    updated[exIdx].sets = updated[exIdx].sets.filter((_, idx) => idx !== setIdx);
    setExercises(updated);
  };
  const updateSet = (exIdx, setIdx, field, val) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx][field] = val;
    setExercises(updated);
  };
  const calc1RM = (w, r) => (!w || !r) ? "—" : (parseFloat(w) * (1 + parseInt(r) / 30)).toFixed(1) + " kg";

  const submit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    const flattenedExercises = [];
    exercises.forEach(ex => {
      ex.sets.forEach(set => {
        flattenedExercises.push({
          name: ex.name.trim(),
          weight: parseFloat(set.weight) || 0,
          sets: 1,
          reps: parseInt(set.reps) || 0
        });
      });
    });

    const res = await fetch("/api/workouts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category, duration, exercises: flattenedExercises }) });
    if (res.ok) { setCategory("Chest"); setDuration(""); setExercises([{ name: "", sets: [{ weight: "", reps: "" }] }]); fetchWorkouts(); }
    setSubmitting(false);
  };

  const catColor = CAT_COLORS[category] || "#FF2D20";

  const inputBase = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#F2F0EA",
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[10px] uppercase tracking-[5px] mb-1" style={{ color: "#5C5E58" }}>Training</p>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-1" style={{ color: "#F2F0EA" }}>
          WORKOUT <span style={{ color: "#C8F36A" }}>STUDIO</span>
        </h1>
        <p className="text-sm" style={{ color: "#5C5E58" }}>Log your sessions and track personal records</p>
      </motion.div>

      {/* ── Category Selector ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(c => {
          const on = category === c;
          const color = CAT_COLORS[c];
          return (
            <button key={c} type="button" onClick={() => setCategory(c)}
              className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all duration-200"
              style={{
                background: on ? color : "rgba(255,255,255,0.04)",
                border: `1px solid ${on ? color : "rgba(255,255,255,0.08)"}`,
                color: on ? "#0A0C0E" : "#9A9B95",
                boxShadow: on ? `0 0 16px ${color}55` : "none",
              }}>
              {c}
            </button>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Form Panel ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)" }}>

          <h2 className="text-base font-bold mb-5" style={{ color: "#F2F0EA" }}>Log Workout</h2>

          <form onSubmit={submit} className="space-y-5">
            {/* Duration */}
            <div>
              <label className="text-[10px] uppercase tracking-[3px] mb-2 block" style={{ color: "#5C5E58" }}>Duration (mins)</label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 45"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={inputBase}
                onFocus={e => { e.target.style.borderColor = catColor; e.target.style.boxShadow = `0 0 0 1px ${catColor}33`; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }} />
            </div>

            {/* Exercises */}
            <div>
              <label className="text-[10px] uppercase tracking-[3px] mb-3 block" style={{ color: "#5C5E58" }}>Exercises</label>
              <AnimatePresence>
                {exercises.map((ex, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="rounded-xl p-4 mb-3 space-y-3 relative"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {exercises.length > 1 && (
                      <button type="button" onClick={() => removeExercise(i)}
                        className="absolute top-3 right-3 transition-colors"
                        style={{ color: "#5C5E58" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                        onMouseLeave={e => e.currentTarget.style.color = "#5C5E58"}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Exercise name */}
                    <input type="text" placeholder="Exercise name" value={ex.name} onChange={e => updateExName(i, e.target.value)} required
                      className="w-full bg-transparent text-sm outline-none pb-1.5 font-bold w-[85%]"
                      style={{ color: "#F2F0EA", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                      onFocus={e => e.target.style.borderBottomColor = catColor}
                      onBlur={e => e.target.style.borderBottomColor = "rgba(255,255,255,0.08)"} />

                    {/* Sets */}
                    <div className="space-y-2">
                      {ex.sets.map((set, sIdx) => (
                        <div key={sIdx} className="grid grid-cols-12 gap-2 items-center">
                          <span className="col-span-2 text-[9px] font-black text-center uppercase tracking-widest" style={{ color: "#5C5E58" }}>S{sIdx + 1}</span>
                          <div className="col-span-4">
                            <input type="number" step="0.5" placeholder="kg" value={set.weight} onChange={e => updateSet(i, sIdx, "weight", e.target.value)} required
                              className="w-full text-center rounded-lg px-2 py-1.5 text-xs outline-none"
                              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#F2F0EA" }} />
                          </div>
                          <div className="col-span-4">
                            <input type="number" placeholder="reps" value={set.reps} onChange={e => updateSet(i, sIdx, "reps", e.target.value)} required
                              className="w-full text-center rounded-lg px-2 py-1.5 text-xs outline-none"
                              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#F2F0EA" }} />
                          </div>
                          <div className="col-span-2 text-center">
                            {/* 1RM inline */}
                            <div className="text-[9px] font-bold" style={{ color: catColor }}>{calc1RM(set.weight, set.reps)}</div>
                          </div>
                        </div>
                      ))}
                      {/* Remove set row */}
                      <div className="pl-6 space-y-1">
                        {ex.sets.length > 1 && ex.sets.map((_, sIdx) => (
                          <div key={sIdx} className="hidden" />
                        ))}
                      </div>
                      {/* Show remove-set for each row that has > 1 set */}
                      {ex.sets.length > 1 && (
                        <div className="flex gap-2 pl-6 flex-wrap">
                          {ex.sets.map((_, sIdx) => (
                            <button key={sIdx} type="button" onClick={() => removeSet(i, sIdx)}
                              className="text-[10px] px-2 py-0.5 rounded transition-colors"
                              style={{ color: "#5C5E58", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                              onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                              onMouseLeave={e => e.currentTarget.style.color = "#5C5E58"}>
                              − S{sIdx + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button type="button" onClick={() => addSet(i)}
                      className="py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                      style={{ color: "#9A9B95", border: "1px dashed rgba(255,255,255,0.1)", width: "max-content" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#F2F0EA"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "#9A9B95"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                      <Plus className="w-3 h-3" /> Add Set
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button type="button" onClick={addExercise}
                className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all mt-1"
                style={{ border: "1px dashed rgba(255,255,255,0.1)", color: "#9A9B95" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#F2F0EA"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#9A9B95"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <Plus className="w-4 h-4" /> Add Exercise
              </button>
            </div>

            {/* Submit */}
            <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl text-sm font-black tracking-wide transition-all flex items-center justify-center gap-2"
              style={{
                background: "#C8F36A",
                color: "#0A0C0E",
                boxShadow: "0 0 24px rgba(200,243,106,0.25)",
                opacity: submitting ? 0.6 : 1
              }}>
              {submitting ? "Saving..." : "Save Workout →"}
            </motion.button>
          </form>
        </motion.div>

        {/* ── History Panel ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-4">
          <h2 className="text-base font-bold" style={{ color: "#F2F0EA" }}>Workout History</h2>

          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}</div>
          ) : workouts.length === 0 ? (
            /* Empty state */
            <div className="rounded-2xl p-14 text-center flex flex-col items-center gap-4"
              style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)" }}>
              {/* SVG dumbbell illustration */}
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="26" width="48" height="12" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
                <rect x="4" y="20" width="10" height="24" rx="5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                <rect x="50" y="20" width="10" height="24" rx="5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                <rect x="1" y="24" width="6" height="16" rx="3" fill="rgba(200,243,106,0.08)" stroke="rgba(200,243,106,0.2)" strokeWidth="1.5"/>
                <rect x="57" y="24" width="6" height="16" rx="3" fill="rgba(200,243,106,0.08)" stroke="rgba(200,243,106,0.2)" strokeWidth="1.5"/>
              </svg>
              <div>
                <p className="font-bold mb-1" style={{ color: "#9A9B95" }}>No workouts yet</p>
                <p className="text-sm" style={{ color: "#5C5E58" }}>Start logging to build your history</p>
              </div>
            </div>
          ) : (
            /* Timeline */
            <div className="space-y-3">
              {workouts.map((w, i) => {
                const vol = w.exercises.reduce((a, ex) => a + ex.weight * ex.reps * ex.sets, 0);
                const color = CAT_COLORS[w.category] || "#FF2D20";
                const isExpanded = expanded === w.id;
                return (
                  <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "#141618", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center justify-between p-5 cursor-pointer"
                      onClick={() => setExpanded(isExpanded ? null : w.id)}>
                      <div className="flex items-center gap-4">
                        {/* Large category icon */}
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
                          <Dumbbell className="w-6 h-6" style={{ color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold" style={{ color: "#F2F0EA" }}>{w.category} Workout</span>
                            {w.exercises.some(e => e.isPr) && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#FBBF24" }}>
                                🏆 NEW PR
                              </span>
                            )}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: "#5C5E58" }}>
                            {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            {w.duration ? ` · ${w.duration} mins` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-black" style={{ color }}>{vol.toLocaleString()} kg</div>
                          <div className="text-[10px]" style={{ color: "#5C5E58" }}>volume</div>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          style={{ color: "#5C5E58" }} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }} className="overflow-hidden">
                          <div className="px-5 pb-5 space-y-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            {(() => {
                              const grouped = [];
                              w.exercises.forEach(ex => {
                                const lastGroup = grouped[grouped.length - 1];
                                if (lastGroup && lastGroup.name.toLowerCase() === ex.name.toLowerCase()) {
                                  lastGroup.sets.push(ex);
                                } else {
                                  grouped.push({ name: ex.name, sets: [ex] });
                                }
                              });
                              return grouped.map((group, gIdx) => (
                                <div key={gIdx} className="rounded-xl p-3.5 space-y-2.5"
                                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                  <div className="text-xs sm:text-sm font-bold flex items-center gap-2" style={{ color: "#9A9B95" }}>
                                    <span>{group.name}</span>
                                    {group.sets.some(s => s.isPr) && (
                                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse"
                                        style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#FBBF24" }}>
                                        🏆 PR
                                      </span>
                                    )}
                                  </div>
                                  <div className="space-y-1.5 pl-1.5">
                                    {group.sets.map((set, sIdx) => (
                                      <div key={set.id || sIdx} className="text-xs flex items-center justify-between py-1"
                                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#5C5E58" }}>
                                        <span className="font-medium" style={{ color: "#9A9B95" }}>
                                          Set {sIdx + 1}:{" "}
                                          <span style={{ color: "#F2F0EA" }}>{set.weight} kg</span>
                                          {" × "}
                                          <span style={{ color: "#F2F0EA" }}>{set.reps} reps</span>
                                        </span>
                                        {set.isPr && <span className="text-[10px] font-black" style={{ color: "#FBBF24" }}>★ Personal Record</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
