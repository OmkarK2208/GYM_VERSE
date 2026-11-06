"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, Minus, CheckCircle, Sparkles } from "lucide-react";

export function Interactive3DWaterGlass({ currentLitres = 0, targetLitres = 6, onAddWater }) {
  const canvasRef = useRef(null);
  const [isPouring, setIsPouring] = useState(false);
  const currentLitresRef = useRef(currentLitres);

  useEffect(() => {
    currentLitresRef.current = currentLitres;
  }, [currentLitres]);

  // Handle water addition
  const handleAdd = (amount = 0.5) => {
    setIsPouring(true);
    if (onAddWater) {
      onAddWater(amount);
    }
    setTimeout(() => setIsPouring(false), 800);
  };

  // Canvas fluid wave simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let time = 0;
    const w = (canvas.width = 240);
    const h = (canvas.height = 280);

    const bubbles = [];
    for (let i = 0; i < 15; i++) {
      bubbles.push({
        x: Math.random() * 100 + 70,
        y: Math.random() * 180 + 50,
        r: Math.random() * 3 + 1.5,
        speed: Math.random() * 1.5 + 0.8,
      });
    }

    const render = () => {
      time += 0.04;
      ctx.clearRect(0, 0, w, h);

      // Glass dimensions
      const gx = 45;
      const gy = 30;
      const gw = 150;
      const gh = 210;
      const taper = 20; // Bottom is slightly narrower

      // Calculate fill ratio
      const fillRatio = Math.min(Math.max(currentLitresRef.current / targetLitres, 0), 1);
      const waterHeight = (gh - 20) * fillRatio;
      const waterTopY = gy + gh - 10 - waterHeight;

      // Draw Glass Base Shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(w / 2, gy + gh + 12, gw * 0.45, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.filter = "blur(10px)";
      ctx.fill();
      ctx.restore();

      // Draw 3D Water Volume inside Glass
      if (waterHeight > 2) {
        ctx.save();
        // Clip to glass interior
        ctx.beginPath();
        ctx.moveTo(gx + 6, gy + 10);
        ctx.lineTo(gx + taper + 8, gy + gh - 6);
        ctx.quadraticCurveTo(w / 2, gy + gh, gx + gw - taper - 8, gy + gh - 6);
        ctx.lineTo(gx + gw - 6, gy + 10);
        ctx.closePath();
        ctx.clip();

        // Water Body with animated wave at the surface
        ctx.beginPath();
        ctx.moveTo(gx - 10, waterTopY);

        const waveAmp = isPouring ? 7 : 3.5;
        const waveFreq = 0.04;
        for (let x = gx - 10; x <= gx + gw + 10; x += 5) {
          const y = waterTopY + Math.sin(x * waveFreq + time * 2) * waveAmp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(gx + gw + 20, gy + gh + 20);
        ctx.lineTo(gx - 20, gy + gh + 20);
        ctx.closePath();

        // Water Gradient
        const waterGrad = ctx.createLinearGradient(0, waterTopY, 0, gy + gh);
        waterGrad.addColorStop(0, "rgba(34, 211, 238, 0.75)");
        waterGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.85)");
        waterGrad.addColorStop(1, "rgba(14, 116, 144, 0.95)");
        ctx.fillStyle = waterGrad;
        ctx.fill();

        // Water Top Surface Ellipse
        ctx.beginPath();
        ctx.ellipse(w / 2, waterTopY, (gw - taper * (1 - fillRatio)) * 0.45, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(165, 243, 252, 0.8)";
        ctx.fill();

        // Rising bubbles inside water
        for (let b of bubbles) {
          b.y -= b.speed;
          if (b.y < waterTopY) {
            b.y = gy + gh - 15;
            b.x = gx + taper + Math.random() * (gw - taper * 2);
          }
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.fill();
        }

        ctx.restore();
      }

      // Pouring Stream Animation
      if (isPouring) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(w / 2 - 3, 0);
        ctx.lineTo(w / 2 + 3, 0);
        ctx.lineTo(w / 2 + 2 + Math.sin(time * 5) * 2, waterTopY);
        ctx.lineTo(w / 2 - 2 + Math.sin(time * 5) * 2, waterTopY);
        ctx.closePath();
        ctx.fillStyle = "rgba(165, 243, 252, 0.85)";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#22D3EE";
        ctx.fill();

        // Splash circles at contact point
        ctx.beginPath();
        ctx.arc(w / 2, waterTopY, Math.random() * 8 + 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
        ctx.restore();
      }

      // Draw 3D Crystal Glass Shell
      ctx.save();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";

      // Glass rim (top oval)
      ctx.beginPath();
      ctx.ellipse(w / 2, gy + 8, gw * 0.48, 12, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Glass body outline
      ctx.beginPath();
      ctx.moveTo(gx, gy + 8);
      ctx.lineTo(gx + taper, gy + gh - 4);
      ctx.quadraticCurveTo(w / 2, gy + gh + 10, gx + gw - taper, gy + gh - 4);
      ctx.lineTo(gx + gw, gy + 8);
      ctx.stroke();

      // Glass Left Reflection Highlight
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.beginPath();
      ctx.moveTo(gx + 10, gy + 20);
      ctx.lineTo(gx + taper + 8, gy + gh - 16);
      ctx.stroke();

      // Measurement Tick Marks
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "9px monospace";
      for (let mark = 1; mark <= 5; mark++) {
        const markY = gy + gh - 10 - ((gh - 20) / targetLitres) * mark;
        ctx.fillRect(gx + gw - taper - 6, markY, 8, 1.5);
        ctx.fillText(`${mark}L`, gx + gw - taper + 6, markY + 3);
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [targetLitres, isPouring]);

  const pct = Math.round(Math.min((currentLitres / targetLitres) * 100, 100));
  const isGoalReached = currentLitres >= targetLitres;

  return (
    <div className="glass-panel relative flex flex-col items-center justify-between overflow-hidden rounded-2xl border border-white/10 p-6">
      {/* Background glow when goal is hit */}
      {isGoalReached && (
        <div className="absolute inset-0 bg-cyan-gym/10 pointer-events-none animate-pulse" />
      )}

      {/* Title & Stats */}
      <div className="w-full flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-cyan-gym" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-gym">
              3D Hydration Chamber
            </span>
          </div>
          <h4 className="text-xl font-black text-white">Daily Water Intake</h4>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-cyan-gym">{currentLitres.toFixed(1)} L</div>
          <div className="text-[10px] text-stone-400">Target: {targetLitres} L ({pct}%)</div>
        </div>
      </div>

      {/* 3D Glass Canvas */}
      <div className="relative my-2 flex items-center justify-center">
        <canvas ref={canvasRef} className="h-[220px] w-[200px]" />
        {isGoalReached && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 flex items-center gap-1 rounded-full border border-cyan-gym/50 bg-cyan-gym/20 px-2.5 py-1 text-xs font-bold text-cyan-gym backdrop-blur-md"
          >
            <Sparkles className="h-3 w-3" /> Target Crushed!
          </motion.div>
        )}
      </div>

      {/* Quick Add Buttons */}
      <div className="w-full space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAdd(0.25)}
            className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-dark-850 py-2.5 text-xs font-bold text-white transition-all hover:border-cyan-gym/50 hover:bg-dark-800"
          >
            <Plus className="h-3 w-3 text-cyan-gym" /> 250 ml
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAdd(0.5)}
            className="flex items-center justify-center gap-1 rounded-xl border border-cyan-gym/40 bg-cyan-gym/15 py-2.5 text-xs font-bold text-cyan-gym transition-all hover:bg-cyan-gym/25"
          >
            <Plus className="h-3 w-3" /> + 0.5 L
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAdd(1.0)}
            className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-dark-850 py-2.5 text-xs font-bold text-white transition-all hover:border-cyan-gym/50 hover:bg-dark-800"
          >
            <Plus className="h-3 w-3 text-cyan-gym" /> 1.0 L
          </motion.button>
        </div>

        {/* Hydration progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-dark-950 border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-gym via-blue-500 to-indigo-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
          />
        </div>
      </div>
    </div>
  );
}
