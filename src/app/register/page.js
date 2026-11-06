"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell, ArrowRight, Target, Sparkles, User, Mail, Lock, Ruler, Weight } from "lucide-react";
import { GymUniverseCanvas } from "@/components/3d/GymUniverseCanvas";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "Maintain",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl px-4 py-3 text-white placeholder-stone-500 text-sm outline-none bg-dark-900/80 border border-white/10 focus:border-lime focus:ring-1 focus:ring-lime transition-all";
  const labelClass = "block text-[11px] uppercase tracking-widest text-stone-400 font-semibold mb-1.5";

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center px-4 py-12 bg-dark-950 overflow-hidden">
      {/* Interactive 3D Canvas Background */}
      <GymUniverseCanvas density={35} interactive={true} />

      {/* Atmospheric Glow */}
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial-gradient from-lime/10 to-transparent blur-3xl opacity-60" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl p-6 sm:p-10 glass-panel border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* Brand */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block group">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-lime to-olive shadow-[0_0_25px_rgba(200,243,106,0.35)] transition-transform group-hover:scale-105">
              <Dumbbell className="w-7 h-7 text-dark-950" />
            </div>
          </Link>
          <div className="text-xs uppercase tracking-[4px] text-lime font-mono font-bold mb-1">
            ONBOARDING PROTOCOL
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Create Athlete Profile</h1>
          <p className="text-stone-400 text-xs mt-1">Calibrate your physical metrics for precision 3D tracking</p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 mb-6 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="name">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Marcus Aurelius"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="email">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="athlete@gymverse.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="password">
              Security Password *
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••••••"
              className={inputClass}
            />
          </div>

          {/* Goal Selector Cards */}
          <div>
            <label className={labelClass}>Fitness Objective *</label>
            <div className="grid grid-cols-3 gap-2">
              {["Maintain", "Bulk", "Cut"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: g })}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                    formData.goal === g
                      ? "bg-lime text-dark-950 border-lime shadow-[0_0_15px_rgba(200,243,106,0.3)]"
                      : "bg-dark-900/80 text-stone-300 border-white/10 hover:border-white/20"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Body Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass} htmlFor="age">
                Age
              </label>
              <input
                id="age"
                type="number"
                min="10"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="gender">
                Gender
              </label>
              <select id="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="height">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                step="0.1"
                value={formData.height}
                onChange={handleChange}
                placeholder="178"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="weight">
              Current Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              placeholder="76.5"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl text-sm font-black text-dark-950 bg-lime hover:bg-lime-hover transition-all active:scale-98 disabled:opacity-50 mt-4 shadow-[0_0_25px_rgba(200,243,106,0.35)] flex items-center justify-center gap-2"
          >
            {loading ? "Generating Account..." : "Initialize 3D Gym Profile"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-stone-400">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-lime hover:underline ml-1">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
