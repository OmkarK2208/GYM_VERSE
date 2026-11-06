"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Plus, Trophy, Trash2, ChevronDown, Sparkles, Clock, Flame, Zap } from "lucide-react";
import { Interactive3DAthlete } from "@/components/3d/Interactive3DAthlete";

const CATEGORIES = ["Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Abs", "Cardio"];
const CAT_COLORS = {
  Chest: "#C8F36A",
  Back: "#38BDF8",
  Legs: "#4ADE80",
  Shoulders: "#A78BFA",
  Biceps: "#FBBF24",
  Triceps: "#FB923C",
  Abs: "#22D3EE",
  Cardio: "#F43F5E",
};

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Chest");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState([{ name: "Bench Press", sets: [{ weight: "", reps: "" }] }]);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const res = await fetch("/api/workouts");
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
    const data = await res.json();
    setWorkouts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const addExercise = () =>
    setExercises([...exercises, { name: "", sets: [{ weight: "", reps: "" }] }]);

  const removeExercise = (i) => setExercises(exercises.filter((_, idx) => idx !== i));

  const updateExName = (i, val) => {
    const updated = [...exercises];
    updated[i].name = val;
    setExercises(updated);
  };

  const addSet = (exIdx) => {
    const updated = [...exercises];
    const lastSet = updated[exIdx].sets[updated[exIdx].sets.length - 1];
    updated[exIdx].sets.push({
      weight: lastSet ? lastSet.weight : "",
      reps: lastSet ? lastSet.reps : "",
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

  const calc1RM = (w, r) => (!w || !r ? "—" : (parseFloat(w) * (1 + parseInt(r) / 30)).toFixed(1) + " kg");

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const flattenedExercises = [];
    exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        flattenedExercises.push({
          name: ex.name.trim() || `${category} Movement`,
          weight: parseFloat(set.weight) || 0,
          sets: 1,
          reps: parseInt(set.reps) || 0,
        });
      });
    });

    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, duration, exercises: flattenedExercises }),
    });

    if (res.ok) {
      setCategory("Chest");
      setDuration("");
      setExercises([{ name: "Bench Press", sets: [{ weight: "", reps: "" }] }]);
      fetchWorkouts();
    }
    setSubmitting(false);
  };

  const activeColor = CAT_COLORS[category] || "#C8F36A";

  return (
    <div className="space-y-8">
      {/* ───── Page Header ───── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeColor }} />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">
              BIOMECHANICAL TRAINING STUDIO
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Workout Studio & PR Forge
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Demonstrate form, compute 1RM limits, and track permanent personal bests.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl glass-panel border border-white/10 text-xs">
          <Clock className="h-4 w-4 text-lime" />
          <span className="text-stone-300">
            Total Sessions: <strong className="text-white">{workouts.length}</strong>
          </span>
        </div>
      </div>

      {/* ───── 3D Athlete & Workout Form Grid ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3D Anatomical Demonstrator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Interactive3DAthlete
            activeCategory={category}
            exerciseName={exercises[0]?.name || `${category} Exercise`}
          />

          {/* Biomechanical Tips */}
          <div className="glass-panel rounded-2xl border border-white/10 p-5 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-lime" /> Target Muscle Activation
            </div>
            <p className="text-stone-400 leading-relaxed">
              When training <span className="font-bold text-white">{category}</span>, maintain scapular retraction and controlled eccentric phase (2-3 seconds) to maximize hypertrophy signaling.
            </p>
          </div>
        </div>

        {/* Right: Workout Logging Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-black text-white mb-5 flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-lime" /> Record New Session
            </h2>

            <form onSubmit={submit} className="space-y-5">
              {/* Category Selector Pills */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2 block">
                  Select Muscle Focus
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        backgroundColor: category === c ? `${CAT_COLORS[c]}25` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${category === c ? CAT_COLORS[c] : "rgba(255,255,255,0.08)"}`,
                        color: category === c ? CAT_COLORS[c] : "#9CA3AF",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Input */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5 block">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 45"
                  className="w-full rounded-xl px-4 py-3 text-white placeholder-stone-600 text-sm outline-none bg-dark-900 border border-white/10 focus:border-lime transition-all"
                />
              </div>

              {/* Exercises & Multi-Sets */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2.5 block">
                  Exercise Movements & Sets
                </label>
                <div className="space-y-3">
                  <AnimatePresence>
                    {exercises.map((ex, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-xl p-4 bg-dark-900/90 border border-white/5 space-y-3 relative"
                      >
                        {exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExercise(i)}
                            className="absolute top-3 right-3 text-stone-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <input
                          type="text"
                          placeholder="e.g. Incline Dumbbell Press"
                          value={ex.name}
                          onChange={(e) => updateExName(i, e.target.value)}
                          required
                          className="w-full bg-transparent text-white placeholder-stone-600 text-sm font-bold outline-none border-b border-white/10 pb-1 focus:border-lime"
                        />

                        {/* Sets list */}
                        <div className="space-y-2">
                          {ex.sets.map((set, sIdx) => {
                            const est1RM = calc1RM(set.weight, set.reps);
                            return (
                              <div key={sIdx} className="grid grid-cols-12 gap-2 items-center text-xs">
                                <span className="col-span-2 font-mono font-bold text-stone-400 text-center">
                                  SET {sIdx + 1}
                                </span>
                                <div className="col-span-3">
                                  <input
                                    type="number"
                                    step="0.5"
                                    placeholder="Weight (kg)"
                                    value={set.weight}
                                    onChange={(e) => updateSet(i, sIdx, "weight", e.target.value)}
                                    required
                                    className="w-full text-center rounded-lg px-2 py-2 text-white placeholder-stone-600 outline-none bg-dark-950 border border-white/10 focus:border-lime"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <input
                                    type="number"
                                    placeholder="Reps"
                                    value={set.reps}
                                    onChange={(e) => updateSet(i, sIdx, "reps", e.target.value)}
                                    required
                                    className="w-full text-center rounded-lg px-2 py-2 text-white placeholder-stone-600 outline-none bg-dark-950 border border-white/10 focus:border-lime"
                                  />
                                </div>
                                <div className="col-span-3 text-[10px] text-stone-400 text-center font-mono">
                                  1RM: <span className="text-lime font-bold">{est1RM}</span>
                                </div>
                                <div className="col-span-1 text-center">
                                  {ex.sets.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeSet(i, sIdx)}
                                      className="text-stone-500 hover:text-rose-400"
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => addSet(i)}
                          className="text-[11px] font-bold text-lime hover:underline flex items-center gap-1 mt-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Set
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={addExercise}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white border border-dashed border-white/15 hover:border-lime/40 flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4 text-lime" /> Add Another Exercise
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl text-sm font-black text-dark-950 bg-lime hover:bg-lime-hover transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(200,243,106,0.3)] flex items-center justify-center gap-2"
              >
                {submitting ? "Writing to Database..." : "Complete & Save Workout 🔥"}
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* ───── Workout History ───── */}
      <div className="glass-panel rounded-2xl border border-white/10 p-6 space-y-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-lime" /> Chronological Session Logs
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No workout sessions logged yet. Record your inaugural session above!</p>
          </div>
        ) : (
          workouts.map((w) => {
            const vol = w.exercises.reduce((a, ex) => a + ex.weight * ex.reps * ex.sets, 0);
            const color = CAT_COLORS[w.category] || "#C8F36A";
            const isExpanded = expanded === w.id;

            return (
              <div
                key={w.id}
                className="rounded-xl overflow-hidden border border-white/5 bg-dark-900/60 transition-all hover:border-white/15"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : w.id)}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
                    >
                      <Dumbbell className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{w.category} Training</span>
                        {w.exercises.some((e) => e.isPr) && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-amber-400 bg-amber-400/15 border border-amber-400/30 flex items-center gap-1">
                            <Trophy className="h-3 w-3" /> PR
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} •{" "}
                        {w.duration ? `${w.duration} mins` : "Standard"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-black" style={{ color }}>
                        {vol.toLocaleString()} kg
                      </div>
                      <div className="text-[10px] uppercase font-mono text-stone-500">Volume</div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {/* Expanded Exercise Breakdown */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-white/5 px-4 pb-4 pt-3 space-y-2"
                    >
                      {w.exercises.map((ex, exIdx) => (
                        <div
                          key={ex.id || exIdx}
                          className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-white/5"
                        >
                          <span className="font-semibold text-stone-200">{ex.name}</span>
                          <span className="font-mono text-stone-400">
                            {ex.weight} kg × {ex.reps} reps
                            {ex.isPr && <span className="ml-2 text-amber-400 font-bold">★ PR</span>}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
