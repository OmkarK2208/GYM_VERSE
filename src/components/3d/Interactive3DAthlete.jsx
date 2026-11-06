"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCw, Zap, Play, Pause, Eye } from "lucide-react";

export function Interactive3DAthlete({ activeCategory = "Chest", exerciseName = "Bench Press" }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewAngle, setViewAngle] = useState("front"); // 'front', 'side', '3/4'
  const isDraggingRef = useRef(false);
  const rotAngleRef = useRef(0);
  const lastMouseXRef = useRef(0);

  // Map category to highlighted anatomical muscles & movement parameters
  const getMuscleDetails = (cat) => {
    switch (cat?.toLowerCase()) {
      case "back":
        return {
          muscles: ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Rear Delts"],
          color: "#38BDF8",
          motionType: "pull",
          equipment: "barbell",
        };
      case "legs":
        return {
          muscles: ["Quadriceps", "Hamstrings", "Gluteus Maximus", "Calves"],
          color: "#4ADE80",
          motionType: "squat",
          equipment: "squat_rack",
        };
      case "shoulders":
        return {
          muscles: ["Anterior Deltoid", "Lateral Deltoid", "Posterior Deltoid"],
          color: "#A78BFA",
          motionType: "overhead_press",
          equipment: "dumbbells",
        };
      case "biceps":
        return {
          muscles: ["Biceps Brachii", "Brachialis", "Forearms"],
          color: "#FBBF24",
          motionType: "curl",
          equipment: "barbell",
        };
      case "triceps":
        return {
          muscles: ["Triceps Lateral Head", "Long Head", "Medial Head"],
          color: "#FB923C",
          motionType: "extension",
          equipment: "cable",
        };
      case "abs":
        return {
          muscles: ["Rectus Abdominis", "Obliques", "Transverse Abdominis"],
          color: "#22D3EE",
          motionType: "crunch",
          equipment: "mat",
        };
      case "cardio":
        return {
          muscles: ["Cardiovascular System", "Quads", "Calves", "Full Body"],
          color: "#F43F5E",
          motionType: "running",
          equipment: "treadmill",
        };
      case "chest":
      default:
        return {
          muscles: ["Pectoralis Major", "Anterior Deltoid", "Triceps"],
          color: "#C8F36A",
          motionType: "bench_press",
          equipment: "bench_barbell",
        };
    }
  };

  const muscleInfo = getMuscleDetails(activeCategory);

  // Mouse drag orbit controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      lastMouseXRef.current = e.clientX;
    };
    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastMouseXRef.current;
      rotAngleRef.current += dx * 0.015;
      lastMouseXRef.current = e.clientX;
    };
    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Set preset view angles
  const setAnglePreset = (preset) => {
    setViewAngle(preset);
    if (preset === "front") rotAngleRef.current = 0;
    if (preset === "side") rotAngleRef.current = Math.PI / 2;
    if (preset === "3/4") rotAngleRef.current = Math.PI / 4;
  };

  // 3D Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let repTime = 0;
    const w = (canvas.width = canvas.parentElement?.clientWidth || 340);
    const h = (canvas.height = 360);

    const render = () => {
      if (isPlaying) {
        repTime += 0.035;
      }
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.52;
      const rot = rotAngleRef.current;

      // Draw Floor Platform & Radial Shadows
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 130, 95, 24, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.filter = "blur(12px)";
      ctx.fill();
      ctx.restore();

      // Platform grid
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 130, 90, 20, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, cy + 130, 50, 11, 0, 0, Math.PI * 2);
      ctx.strokeStyle = muscleInfo.color + "44";
      ctx.stroke();
      ctx.restore();

      // Repetition Phase (0 to 1 smooth oscillation)
      const repPhase = (Math.sin(repTime) + 1) / 2;

      // 3D Human Skeleton & Muscular Body Nodes
      // We calculate 3D coordinates (x, y, z) and project onto 2D using rotation around Y-axis
      const project = (x, y, z) => {
        // Rotate around Y
        const cosR = Math.cos(rot);
        const sinR = Math.sin(rot);
        const rx = x * cosR - z * sinR;
        const rz = x * sinR + z * cosR;

        // Perspective scale
        const fov = 400;
        const scale = fov / (fov + rz + 100);
        return {
          x: cx + rx * scale,
          y: cy + y * scale,
          scale,
          z: rz,
        };
      };

      // Base anatomical landmarks adjusted by exercise motion
      let headY = -95;
      let chestY = -55;
      let hipsY = 0;
      let leftHand = { x: -35, y: -45, z: 15 };
      let rightHand = { x: 35, y: -45, z: 15 };
      let leftFoot = { x: -22, y: 125, z: 0 };
      let rightFoot = { x: 22, y: 125, z: 0 };
      let leftKneeY = 65;
      let rightKneeY = 65;

      // Animate based on exercise type
      if (muscleInfo.motionType === "bench_press") {
        // Pressing up and down
        const pushDelta = repPhase * 28;
        leftHand.z = 25 + pushDelta;
        rightHand.z = 25 + pushDelta;
        leftHand.y = -50 - pushDelta * 0.4;
        rightHand.y = -50 - pushDelta * 0.4;
      } else if (muscleInfo.motionType === "squat") {
        // Squatting down
        const squatDrop = repPhase * 42;
        headY += squatDrop;
        chestY += squatDrop;
        hipsY += squatDrop;
        leftKneeY += squatDrop * 0.4;
        rightKneeY += squatDrop * 0.4;
      } else if (muscleInfo.motionType === "curl") {
        // Bicep curl forearm arc
        const curlPhase = repPhase;
        leftHand.y = -20 - curlPhase * 35;
        rightHand.y = -20 - curlPhase * 35;
        leftHand.z = 10 + curlPhase * 25;
        rightHand.z = 10 + curlPhase * 25;
      } else if (muscleInfo.motionType === "overhead_press") {
        // Overhead press
        const pressUp = repPhase * 45;
        leftHand.y = -55 - pressUp;
        rightHand.y = -55 - pressUp;
      }

      // Projected joints
      const pHead = project(0, headY, 0);
      const pNeck = project(0, headY + 16, 0);
      const pChest = project(0, chestY, 5);
      const pLShoulder = project(-32, chestY - 5, 0);
      const pRShoulder = project(32, chestY - 5, 0);
      const pLElbow = project(-38, chestY + 22, 10);
      const pRElbow = project(38, chestY + 22, 10);
      const pLHand = project(leftHand.x, leftHand.y, leftHand.z);
      const pRHand = project(rightHand.x, rightHand.y, rightHand.z);

      const pHips = project(0, hipsY, 0);
      const pLKnee = project(-20, leftKneeY, 0);
      const pRKnee = project(20, rightKneeY, 0);
      const pLFoot = project(leftFoot.x, leftFoot.y, leftFoot.z);
      const pRFoot = project(rightFoot.x, rightFoot.y, rightFoot.z);

      // Draw Anatomical Connectors & Musculature
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Spine & Torso
      ctx.lineWidth = 14 * pChest.scale;
      ctx.strokeStyle = "rgba(40, 48, 56, 0.9)";
      ctx.beginPath();
      ctx.moveTo(pNeck.x, pNeck.y);
      ctx.lineTo(pChest.x, pChest.y);
      ctx.lineTo(pHips.x, pHips.y);
      ctx.stroke();

      // ACTIVE MUSCLE HIGHLIGHT OVERLAY
      ctx.lineWidth = 18 * pChest.scale;
      ctx.strokeStyle = muscleInfo.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = muscleInfo.color;

      if (activeCategory === "Chest") {
        ctx.beginPath();
        ctx.moveTo(pLShoulder.x, pLShoulder.y);
        ctx.lineTo(pChest.x, pChest.y);
        ctx.lineTo(pRShoulder.x, pRShoulder.y);
        ctx.stroke();
      } else if (activeCategory === "Back") {
        ctx.beginPath();
        ctx.moveTo(pChest.x, pChest.y - 10);
        ctx.lineTo(pChest.x, pHips.y - 10);
        ctx.stroke();
      } else if (activeCategory === "Legs") {
        ctx.beginPath();
        ctx.moveTo(pHips.x - 10, pHips.y);
        ctx.lineTo(pLKnee.x, pLKnee.y);
        ctx.moveTo(pHips.x + 10, pHips.y);
        ctx.lineTo(pRKnee.x, pRKnee.y);
        ctx.stroke();
      } else if (activeCategory === "Shoulders") {
        ctx.beginPath();
        ctx.arc(pLShoulder.x, pLShoulder.y, 8, 0, Math.PI * 2);
        ctx.arc(pRShoulder.x, pRShoulder.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      } else if (activeCategory === "Biceps") {
        ctx.beginPath();
        ctx.moveTo(pLShoulder.x, pLShoulder.y);
        ctx.lineTo(pLElbow.x, pLElbow.y);
        ctx.moveTo(pRShoulder.x, pRShoulder.y);
        ctx.lineTo(pRElbow.x, pRElbow.y);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Arms (Base metallic mesh)
      ctx.lineWidth = 7 * pChest.scale;
      ctx.strokeStyle = "rgba(60, 72, 84, 0.85)";

      // Left Arm
      ctx.beginPath();
      ctx.moveTo(pLShoulder.x, pLShoulder.y);
      ctx.lineTo(pLElbow.x, pLElbow.y);
      ctx.lineTo(pLHand.x, pLHand.y);
      ctx.stroke();

      // Right Arm
      ctx.beginPath();
      ctx.moveTo(pRShoulder.x, pRShoulder.y);
      ctx.lineTo(pRElbow.x, pRElbow.y);
      ctx.lineTo(pRHand.x, pRHand.y);
      ctx.stroke();

      // Legs
      ctx.lineWidth = 9 * pChest.scale;
      ctx.beginPath();
      ctx.moveTo(pHips.x, pHips.y);
      ctx.lineTo(pLKnee.x, pLKnee.y);
      ctx.lineTo(pLFoot.x, pLFoot.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pHips.x, pHips.y);
      ctx.lineTo(pRKnee.x, pRKnee.y);
      ctx.lineTo(pRFoot.x, pRFoot.y);
      ctx.stroke();

      // Head Node
      ctx.beginPath();
      ctx.arc(pHead.x, pHead.y, 14 * pHead.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#2D3742";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Equipment Demonstration: 3D Barbell in hands
      if (muscleInfo.equipment.includes("barbell")) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#94A3B8";
        ctx.beginPath();
        // Extended barbell line between hands
        const dx = pRHand.x - pLHand.x;
        const dy = pRHand.y - pLHand.y;
        ctx.moveTo(pLHand.x - dx * 0.35, pLHand.y - dy * 0.35);
        ctx.lineTo(pRHand.x + dx * 0.35, pRHand.y + dy * 0.35);
        ctx.stroke();

        // 3D Weight Plates on Barbell ends
        ctx.fillStyle = muscleInfo.color;
        ctx.fillRect(pLHand.x - dx * 0.35 - 4, pLHand.y - dy * 0.35 - 12, 6, 24);
        ctx.fillRect(pRHand.x + dx * 0.35 - 2, pRHand.y + dy * 0.35 - 12, 6, 24);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeCategory, isPlaying, muscleInfo]);

  return (
    <div className="glass-panel relative flex flex-col overflow-hidden rounded-2xl border border-white/10 p-5">
      {/* Header bar */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: muscleInfo.color }} />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
              3D Biomechanical Demonstrator
            </span>
          </div>
          <h4 className="text-lg font-black text-white">{exerciseName || `${activeCategory} Exercise`}</h4>
        </div>

        {/* Play/Pause & Rotate Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-dark-850 text-stone-300 transition-colors hover:text-white"
            title={isPlaying ? "Pause Repetition" : "Play Repetition"}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => (rotAngleRef.current += Math.PI / 4)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-dark-850 text-stone-300 transition-colors hover:text-white"
            title="Rotate Angle"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas with drag prompt */}
      <div className="relative flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-dark-950 to-dark-900 border border-white/5 p-1 cursor-grab active:cursor-grabbing">
        <canvas ref={canvasRef} className="h-[280px] w-full" />
        <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[10px] text-stone-500 pointer-events-none">
          <Eye className="h-3 w-3" /> Drag to orbit 360°
        </div>

        {/* View angle pills */}
        <div className="absolute top-2 right-2 flex gap-1">
          {["front", "side", "3/4"].map((ang) => (
            <button
              key={ang}
              onClick={() => setAnglePreset(ang)}
              className={`rounded px-2 py-0.5 text-[10px] uppercase font-bold transition-all ${
                viewAngle === ang
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-stone-500 hover:text-stone-300"
              }`}
            >
              {ang}
            </button>
          ))}
        </div>
      </div>

      {/* Activated Muscles Breakdown */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-400">Target Muscle Groups:</span>
          <span className="font-mono text-[10px] text-stone-500">BIOMECHANICAL TARGET</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {muscleInfo.muscles.map((muscle) => (
            <span
              key={muscle}
              className="flex items-center gap-1 rounded-md border border-white/10 bg-dark-850 px-2 py-1 text-[11px] font-medium text-white"
            >
              <Zap className="h-3 w-3" style={{ color: muscleInfo.color }} />
              {muscle}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
