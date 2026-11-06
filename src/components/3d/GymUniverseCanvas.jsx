"use client";
import { useEffect, useRef } from "react";

export function GymUniverseCanvas({ interactive = true, density = 45 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Generate 3D floating gym objects (Dumbbells, Hex Plates, Dust particles)
    const items = [];
    for (let i = 0; i < density; i++) {
      items.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 100, // Depth
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 18 + 8,
        type: i % 5 === 0 ? "dumbbell" : i % 3 === 0 ? "plate" : "particle",
        color: i % 4 === 0 ? "rgba(200, 243, 106, " : "rgba(245, 244, 238, ",
        baseAlpha: Math.random() * 0.45 + 0.15,
      });
    }

    const fov = 400; // Focal length

    const drawDumbbell = (ctx, x, y, scale, rot, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(scale, scale);

      ctx.fillStyle = `rgba(35, 42, 48, ${alpha})`;
      ctx.strokeStyle = `rgba(200, 243, 106, ${alpha * 0.9})`;
      ctx.lineWidth = 1.2;

      // Handle
      ctx.beginPath();
      ctx.rect(-18, -2.5, 36, 5);
      ctx.fill();
      ctx.stroke();

      // Left plate
      ctx.beginPath();
      ctx.roundRect(-24, -12, 7, 24, 2);
      ctx.fill();
      ctx.stroke();

      // Left inner collar
      ctx.fillStyle = `rgba(200, 243, 106, ${alpha * 0.8})`;
      ctx.fillRect(-17, -5, 2, 10);

      // Right plate
      ctx.fillStyle = `rgba(35, 42, 48, ${alpha})`;
      ctx.beginPath();
      ctx.roundRect(17, -12, 7, 24, 2);
      ctx.fill();
      ctx.stroke();

      // Right inner collar
      ctx.fillStyle = `rgba(200, 243, 106, ${alpha * 0.8})`;
      ctx.fillRect(15, -5, 2, 10);

      ctx.restore();
    };

    const drawWeightPlate = (ctx, x, y, scale, rot, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(scale, scale);

      // Outer rim
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(22, 28, 32, ${alpha * 0.9})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(200, 243, 106, ${alpha * 0.7})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner ring
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.25})`;
      ctx.stroke();

      // Center hole
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10, 12, 14, ${alpha})`;
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    let time = 0;
    const render = () => {
      time += 0.01;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const offsetX = (mouseX - width / 2) * 0.15;
      const offsetY = (mouseY - height / 2) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // 3D Perspective Grid at the bottom floor
      const horizonY = height * 0.65;
      ctx.save();
      ctx.strokeStyle = "rgba(200, 243, 106, 0.04)";
      ctx.lineWidth = 1;

      // Perspective floor lines radiating from vanishing point
      const vpX = width / 2 - offsetX * 0.4;
      const vpY = horizonY - offsetY * 0.4;
      const numLines = 24;

      for (let i = -numLines; i <= numLines; i++) {
        const spreadX = vpX + (i * width) / (numLines * 0.4);
        ctx.beginPath();
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(spreadX, height + 100);
        ctx.stroke();
      }

      // Horizontal depth rings
      for (let z = 1; z <= 8; z++) {
        const yPos = vpY + Math.pow(z / 8, 2) * (height - vpY);
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(width, yPos);
        ctx.stroke();
      }
      ctx.restore();

      // Render 3D Objects sorted by depth
      items.sort((a, b) => b.z - a.z);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.x += item.vx;
        item.y += item.vy;
        item.rot += item.rotSpeed;

        // Wrap around bounds in 3D
        if (item.x < -width) item.x = width;
        if (item.x > width) item.x = -width;
        if (item.y < -height) item.y = height;
        if (item.y > height) item.y = -height;

        // Camera perspective projection
        const scale = fov / (fov + item.z);
        const projX = width / 2 + (item.x - offsetX) * scale;
        const projY = height / 2 + (item.y - offsetY) * scale;

        if (projX < -50 || projX > width + 50 || projY < -50 || projY > height + 50) continue;

        const alpha = Math.min(item.baseAlpha * scale * 1.8, 0.85);

        if (item.type === "dumbbell") {
          drawDumbbell(ctx, projX, projY, scale, item.rot, alpha);
        } else if (item.type === "plate") {
          drawWeightPlate(ctx, projX, projY, scale, item.rot, alpha);
        } else {
          // Ambient glowing dust particle
          ctx.beginPath();
          ctx.arc(projX, projY, Math.max(item.size * scale * 0.35, 1.2), 0, Math.PI * 2);
          ctx.fillStyle = `${item.color}${alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = item.color + "0.6)";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive, density]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60"
    />
  );
}
