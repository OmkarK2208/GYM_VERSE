"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, Sparkles, UtensilsCrossed } from "lucide-react";

// Ingredient database with colors, particle sizes, and nutritional stats per 100g
export const BOWL_INGREDIENTS = [
  { id: "sprouts", name: "Sprouts (Mixed)", cal: 80, pro: 8, carb: 14, fat: 1, color: "#86EFAC", pType: "sprout" },
  { id: "moong", name: "Moong Sprouts", cal: 105, pro: 7, carb: 19, fat: 0.5, color: "#4ADE80", pType: "seed" },
  { id: "matki", name: "Matki (Moth Beans)", cal: 343, pro: 24, carb: 61, fat: 1.5, color: "#CA8A04", pType: "seed" },
  { id: "chana", name: "Boiled Chana", cal: 164, pro: 9, carb: 27, fat: 2.5, color: "#D97706", pType: "chana" },
  { id: "soya", name: "Soya Chunks", cal: 345, pro: 52, carb: 33, fat: 0.5, color: "#FBBF24", pType: "cube" },
  { id: "paneer", name: "Low-fat Paneer", cal: 265, pro: 18, carb: 4, fat: 20, color: "#F3F4F6", pType: "cube" },
  { id: "chicken", name: "Chicken Breast", cal: 165, pro: 31, carb: 0, fat: 3.6, color: "#FCA5A5", pType: "meat" },
  { id: "oats", name: "Rolled Oats", cal: 389, pro: 17, carb: 66, fat: 7, color: "#FEF08A", pType: "flake" },
  { id: "banana", name: "Banana Slices", cal: 89, pro: 1.1, carb: 23, fat: 0.3, color: "#FACC15", pType: "disk" },
];

export function Interactive3DBowl({ onSaveMeal }) {
  const canvasRef = useRef(null);
  const [selectedIngredients, setSelectedIngredients] = useState([
    { ...BOWL_INGREDIENTS[0], grams: 100 },
    { ...BOWL_INGREDIENTS[2], grams: 50 },
  ]);
  const [isPouring, setIsPouring] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const particlesRef = useRef([]);

  // Initialize initial particles in bowl
  useEffect(() => {
    particlesRef.current = [];
    selectedIngredients.forEach((ing) => {
      spawnIngredientParticles(ing, ing.grams / 5);
    });
  }, []);

  const spawnIngredientParticles = (ing, count = 18) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const bowlCenter = { x: w / 2, y: h * 0.68 };

    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: bowlCenter.x + (Math.random() - 0.5) * 80,
        y: Math.random() * -60 - 20, // Start above canvas
        vx: (Math.random() - 0.5) * 2.5,
        vy: Math.random() * 3 + 2,
        gravity: 0.28,
        color: ing.color,
        pType: ing.pType,
        size: Math.random() * 4 + 3,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        settled: false,
        bounceCount: 0,
        targetY: bowlCenter.y + (Math.random() - 0.5) * 25,
      });
    }
  };

  // Add ingredient action
  const handleAddIngredient = (ing) => {
    setIsPouring(true);
    setLastAdded(ing.name);

    setSelectedIngredients((prev) => {
      const exists = prev.find((item) => item.id === ing.id);
      if (exists) {
        return prev.map((item) => (item.id === ing.id ? { ...item, grams: item.grams + 50 } : item));
      }
      return [...prev, { ...ing, grams: 100 }];
    });

    spawnIngredientParticles(ing, 24);

    setTimeout(() => {
      setIsPouring(false);
    }, 900);
  };

  // Remove ingredient
  const handleRemoveIngredient = (id) => {
    setSelectedIngredients((prev) => prev.filter((item) => item.id !== id));
    // Clear particles matching this item
    const ing = BOWL_INGREDIENTS.find((i) => i.id === id);
    if (ing) {
      particlesRef.current = particlesRef.current.filter((p) => p.color !== ing.color);
    }
  };

  // Clear bowl
  const handleResetBowl = () => {
    setSelectedIngredients([]);
    particlesRef.current = [];
  };

  // Canvas 3D rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    const w = (canvas.width = canvas.parentElement?.clientWidth || 360);
    const h = (canvas.height = 280);

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.65;
      const rx = w * 0.38;
      const ry = 42;
      const depth = 65;

      // Draw 3D Ceramic Bowl (Outer Shadow)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy + depth + 10, rx * 0.9, ry * 0.8, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.filter = "blur(14px)";
      ctx.fill();
      ctx.restore();

      // Bowl Outer Shell
      ctx.save();
      const outerGrad = ctx.createLinearGradient(cx - rx, cy, cx + rx, cy + depth);
      outerGrad.addColorStop(0, "#1F262D");
      outerGrad.addColorStop(0.5, "#2A343D");
      outerGrad.addColorStop(1, "#141A1F");

      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI);
      ctx.lineTo(cx - rx * 0.65, cy + depth);
      ctx.ellipse(cx, cy + depth, rx * 0.65, ry * 0.5, 0, 0, Math.PI);
      ctx.lineTo(cx + rx, cy);
      ctx.fillStyle = outerGrad;
      ctx.fill();

      // Outer rim highlight
      ctx.strokeStyle = "rgba(200, 243, 106, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bowl Inner Well (Dark cavity)
      const innerGrad = ctx.createRadialGradient(cx, cy + 10, 5, cx, cy + 10, rx);
      innerGrad.addColorStop(0, "#0E1215");
      innerGrad.addColorStop(0.7, "#171D22");
      innerGrad.addColorStop(1, "#252E36");

      ctx.beginPath();
      ctx.ellipse(cx, cy, rx - 3, ry - 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = innerGrad;
      ctx.fill();

      // Ceramic Inner Lip Glow
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Render & Update Physical Particles inside the Bowl
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!p.settled) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.rot += p.rotSpeed;

          // Check bowl collision
          // Elliptical bowl bounds
          const dx = (p.x - cx) / (rx * 0.75);
          const dy = (p.y - (cy + 15)) / (ry * 0.75);
          const distSq = dx * dx + dy * dy;

          if (p.y >= p.targetY || distSq > 0.85) {
            p.bounceCount++;
            p.vy = -p.vy * 0.35;
            p.vx *= 0.6;
            if (p.bounceCount > 2 || Math.abs(p.vy) < 0.8) {
              p.settled = true;
              p.vy = 0;
              p.vx = 0;
            }
          }
        }

        // Render individual particle shape based on type
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.settled ? 0 : 4;
        ctx.shadowColor = p.color;

        if (p.pType === "sprout") {
          // Curled sprout tail + head
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(p.size, -p.size * 0.8, p.size * 1.4, -p.size * 0.3);
          ctx.stroke();
        } else if (p.pType === "cube") {
          // Soya / Paneer cube
          ctx.fillRect(-p.size, -p.size, p.size * 1.8, p.size * 1.8);
          ctx.strokeStyle = "rgba(0,0,0,0.2)";
          ctx.strokeRect(-p.size, -p.size, p.size * 1.8, p.size * 1.8);
        } else if (p.pType === "chana") {
          // Teardrop / round seed
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.pType === "flake") {
          // Rolled oats
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.6, p.rot, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Seed / Meat grain
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Front rim glass highlight overlay
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI);
      ctx.strokeStyle = "rgba(200, 243, 106, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute live nutritional totals
  const totals = selectedIngredients.reduce(
    (acc, item) => {
      const factor = item.grams / 100;
      return {
        cal: acc.cal + Math.round(item.cal * factor),
        pro: acc.pro + Math.round(item.pro * factor),
        carb: acc.carb + Math.round(item.carb * factor),
        fat: acc.fat + Math.round(item.fat * factor),
        grams: acc.grams + item.grams,
      };
    },
    { cal: 0, pro: 0, carb: 0, fat: 0, grams: 0 }
  );

  const handleSaveToDiet = () => {
    if (selectedIngredients.length === 0) return;
    const mealName = `Power Bowl (${selectedIngredients.map((i) => i.name.split(" ")[0]).join(", ")})`;
    if (onSaveMeal) {
      onSaveMeal({
        meal: mealName,
        calories: totals.cal,
        protein: totals.pro,
      });
    }
  };

  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl border border-white/10 p-5 sm:p-6">
      {/* Header bar */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-lime animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-lime">Interactive 3D Engine</span>
          </div>
          <h3 className="text-lg font-black text-white sm:text-xl">Protein & Sprout Bowl Builder</h3>
          <p className="text-xs text-stone-400">Click ingredients to drop them with real physics into your 3D bowl</p>
        </div>

        {selectedIngredients.length > 0 && (
          <button
            onClick={handleResetBowl}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/20"
          >
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* 3D Visualizer Canvas & Macro HUD */}
      <div className="relative mb-5 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-dark-950 to-dark-900 border border-white/5 p-2">
        <canvas ref={canvasRef} className="h-[240px] w-full max-w-[420px]" />

        {/* Live dropping indicator */}
        <AnimatePresence>
          {isPouring && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 flex items-center gap-2 rounded-full border border-lime/40 bg-dark-950/80 px-3 py-1 text-xs font-semibold text-lime shadow-lg backdrop-blur-md"
            >
              <Sparkles className="h-3 w-3 animate-spin" /> Adding {lastAdded}...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Macro Counters (Calculated from real ingredient physics) */}
        <div className="grid w-full grid-cols-4 gap-2 pt-2 border-t border-white/5">
          <div className="rounded-lg bg-white/5 p-2 text-center">
            <div className="text-base font-black text-lime sm:text-lg">{totals.cal}</div>
            <div className="text-[10px] uppercase tracking-wider text-stone-400">Calories (kcal)</div>
          </div>
          <div className="rounded-lg bg-white/5 p-2 text-center">
            <div className="text-base font-black text-emerald-400 sm:text-lg">{totals.pro}g</div>
            <div className="text-[10px] uppercase tracking-wider text-stone-400">Protein</div>
          </div>
          <div className="rounded-lg bg-white/5 p-2 text-center">
            <div className="text-base font-black text-amber-400 sm:text-lg">{totals.carb}g</div>
            <div className="text-[10px] uppercase tracking-wider text-stone-400">Carbs</div>
          </div>
          <div className="rounded-lg bg-white/5 p-2 text-center">
            <div className="text-base font-black text-cyan-400 sm:text-lg">{totals.grams}g</div>
            <div className="text-[10px] uppercase tracking-wider text-stone-400">Total Mass</div>
          </div>
        </div>
      </div>

      {/* Ingredient Selector Pills */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">
          Add Real Nutrition Ingredients
        </label>
        <div className="flex flex-wrap gap-2">
          {BOWL_INGREDIENTS.map((ing) => (
            <motion.button
              key={ing.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddIngredient(ing)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-dark-850 px-3 py-2 text-xs font-medium text-white transition-all hover:border-lime/50 hover:bg-dark-800"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ing.color }} />
              <span>{ing.name}</span>
              <Plus className="h-3 w-3 text-lime" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Ingredients Breakdown */}
      {selectedIngredients.length > 0 && (
        <div className="mb-4 space-y-1.5">
          <div className="text-xs font-semibold text-stone-400">Active Bowl Recipe:</div>
          <div className="flex flex-wrap gap-1.5">
            {selectedIngredients.map((item) => (
              <span
                key={item.id}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white"
              >
                <span>
                  {item.name} ({item.grams}g)
                </span>
                <button
                  onClick={() => handleRemoveIngredient(item.id)}
                  className="ml-1 text-stone-400 hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Button: Persist to real API */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSaveToDiet}
        disabled={selectedIngredients.length === 0}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime py-3.5 text-sm font-black text-dark-950 transition-all hover:bg-lime-hover disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(200,243,106,0.3)]"
      >
        <UtensilsCrossed className="h-4 w-4" />
        Log 3D Bowl Meal ({totals.cal} kcal • {totals.pro}g Protein)
      </motion.button>
    </div>
  );
}
