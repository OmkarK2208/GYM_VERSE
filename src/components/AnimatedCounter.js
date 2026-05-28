"use client";
import { useEffect, useRef } from "react";

export function AnimatedCounter({ value, duration = 1400, decimals = 0, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = parseFloat(value) || 0;
    const start = performance.now();
    const run = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (ease * target).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [value, duration, decimals, prefix, suffix]);
  return <span ref={ref}>{prefix}{(parseFloat(value) || 0).toFixed(decimals)}{suffix}</span>;
}
