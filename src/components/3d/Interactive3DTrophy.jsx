"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Trophy, Sparkles, Award } from "lucide-react";

export function Interactive3DTrophy({ prName = "Bench Press", prWeight = 100, isCelebration = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let time = 0;
    const w = (canvas.width = 200);
    const h = (canvas.height = 200);

    const sparkles = [];
    for (let i = 0; i < 12; i++) {
      sparkles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2.5 + 1,
        speed: Math.random() * 0.05 + 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.52;

      // Draw Rotating 3D Pedestal Base
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 50, 45, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.filter = "blur(8px)";
      ctx.fill();
      ctx.restore();

      // Pedestal Block
      ctx.save();
      const pedGrad = ctx.createLinearGradient(cx - 35, cy + 30, cx + 35, cy + 50);
      pedGrad.addColorStop(0, "#1F2937");
      pedGrad.addColorStop(0.5, "#374151");
      pedGrad.addColorStop(1, "#111827");

      ctx.beginPath();
      ctx.roundRect(cx - 30, cy + 32, 60, 16, 4);
      ctx.fillStyle = pedGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Gold Trophy Stem
      const goldStem = ctx.createLinearGradient(cx - 8, cy, cx + 8, cy);
      goldStem.addColorStop(0, "#D97706");
      goldStem.addColorStop(0.5, "#FDE68A");
      goldStem.addColorStop(1, "#B45309");

      ctx.beginPath();
      ctx.moveTo(cx - 6, cy + 32);
      ctx.lineTo(cx + 6, cy + 32);
      ctx.lineTo(cx + 10, cy + 8);
      ctx.lineTo(cx - 10, cy + 8);
      ctx.closePath();
      ctx.fillStyle = goldStem;
      ctx.fill();

      // 3D Trophy Cup Bowl
      const rot = Math.sin(time) * 0.25; // Subtle 3D rocking
      ctx.translate(cx, cy);
      ctx.rotate(rot);

      const cupGrad = ctx.createLinearGradient(-30, -40, 30, 10);
      cupGrad.addColorStop(0, "#B45309");
      cupGrad.addColorStop(0.3, "#F59E0B");
      cupGrad.addColorStop(0.5, "#FEF08A");
      cupGrad.addColorStop(0.8, "#F59E0B");
      cupGrad.addColorStop(1, "#78350F");

      // Cup Body
      ctx.beginPath();
      ctx.moveTo(-28, -35);
      ctx.quadraticCurveTo(-26, 5, 0, 8);
      ctx.quadraticCurveTo(26, 5, 28, -35);
      ctx.closePath();
      ctx.fillStyle = cupGrad;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "rgba(245, 158, 11, 0.4)";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Cup Rim Ellipse
      ctx.beginPath();
      ctx.ellipse(0, -35, 28, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#FEF08A";
      ctx.fill();
      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Trophy Handles (Left and Right loops)
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#F59E0B";

      // Left handle
      ctx.beginPath();
      ctx.moveTo(-25, -28);
      ctx.bezierCurveTo(-45, -28, -42, -5, -18, -2);
      ctx.stroke();

      // Right handle
      ctx.beginPath();
      ctx.moveTo(25, -28);
      ctx.bezierCurveTo(45, -28, 42, -5, 18, -2);
      ctx.stroke();

      // Metallic ray reflections
      const lightSweepX = Math.sin(time * 2) * 18;
      ctx.beginPath();
      ctx.moveTo(lightSweepX - 3, -33);
      ctx.lineTo(lightSweepX + 3, -33);
      ctx.lineTo(lightSweepX + 6, 2);
      ctx.lineTo(lightSweepX, 2);
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.fill();

      ctx.restore();

      // Floating sparkles around trophy
      for (let s of sparkles) {
        const alpha = (Math.sin(time * 3 + s.phase) + 1) / 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="glass-panel relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-amber-500/30 p-5 text-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none" />

      {/* Badge */}
      <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
        <Award className="h-3.5 w-3.5" /> Personal Record Today
      </div>

      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="h-[170px] w-[170px]" />

      {/* PR Name & Value */}
      <div className="mt-1">
        <h4 className="text-xl font-black text-white">{prName || "New Milestone"}</h4>
        <div className="text-2xl font-black text-gradient-gold">
          {prWeight ? `${prWeight} kg` : "Active"}
        </div>
      </div>
    </div>
  );
}
