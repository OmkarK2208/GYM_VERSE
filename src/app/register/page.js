"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell, TrendingUp, Zap, Minus } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", age: "", gender: "", height: "", weight: "", goal: "Maintain"
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

  const inputStyle = {
    background: "#1A1D20",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#F2F0EA",
  };
  const inputFocusStyle = {
    borderColor: "rgba(200,243,106,0.5)",
    boxShadow: "0 0 0 3px rgba(200,243,106,0.08)",
    outline: "none",
  };
  const inputClass =
    "w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 placeholder:text-[#5C5E58]";
  const labelClass =
    "block text-xs uppercase tracking-widest mb-1.5 font-semibold";

  const goals = [
    { value: "Maintain", label: "Maintain",  icon: Minus,       desc: "Stay at current weight" },
    { value: "Bulk",     label: "Bulk",       icon: TrendingUp,  desc: "Build muscle & mass" },
    { value: "Cut",      label: "Cut",        icon: Zap,         desc: "Burn fat & lean out" },
  ];

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: "#0E1012" }}
    >
      {/* ── Animated background blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.07] animate-blob"
          style={{
            background: "radial-gradient(circle, #C8F36A, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full opacity-[0.05] animate-blob-slow"
          style={{
            background: "radial-gradient(circle, #566B39, transparent 70%)",
            filter: "blur(80px)",
            animationDelay: "5s",
          }}
        />
        {[
          { size: 3, top: "10%", left: "5%",  delay: "0s",   dur: "7s" },
          { size: 2, top: "80%", left: "90%", delay: "2s",   dur: "9s" },
          { size: 2, top: "45%", left: "95%", delay: "1s",   dur: "6s" },
          { size: 3, top: "65%", left: "3%",  delay: "3.5s", dur: "8s" },
        ].map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: p.size, height: p.size,
              top: p.top, left: p.left,
              animationDelay: p.delay, animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      {/* ── Card ── */}
      <div
        className="relative w-full max-w-lg rounded-3xl p-7 sm:p-9"
        style={{
          background: "rgba(20,22,24,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Brand ── */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse-glow"
            style={{
              background: "linear-gradient(135deg, #C8F36A, #8BB840)",
              boxShadow: "0 0 32px rgba(200,243,106,0.35)",
            }}
          >
            <Dumbbell className="w-8 h-8" style={{ color: "#0E1012" }} />
          </div>
          <span
            className="block text-sm font-black tracking-[0.3em] mb-3"
            style={{
              background: "linear-gradient(90deg, #C8F36A, #A8D94A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            GYMVERSE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: "#F2F0EA", marginBottom: "0.25rem" }}>
            Join GYMVERSE
          </h1>
          <p className="text-sm" style={{ color: "#5C5E58" }}>
            Start your fitness journey today
          </p>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 mb-5 text-sm font-medium text-center"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">

          {/* ── Section: Personal Info ── */}
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#C8F36A" }}
            >
              Personal Info
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={{ color: "#5C5E58" }} htmlFor="name">
                  Full Name *
                </label>
                <input
                  id="name" type="text" value={formData.name} onChange={handleChange}
                  required placeholder="John Doe" className={inputClass} style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
              <div>
                <label className={labelClass} style={{ color: "#5C5E58" }} htmlFor="email">
                  Email *
                </label>
                <input
                  id="email" type="email" value={formData.email} onChange={handleChange}
                  required placeholder="you@email.com" className={inputClass} style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
            </div>
            <div>
              <label className={labelClass} style={{ color: "#5C5E58" }} htmlFor="password">
                Password *
              </label>
              <input
                id="password" type="password" value={formData.password} onChange={handleChange}
                required placeholder="••••••••" className={inputClass} style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

          {/* ── Section: Body Stats ── */}
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#C8F36A" }}
            >
              Body Stats
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass} style={{ color: "#5C5E58" }} htmlFor="age">Age</label>
                <input
                  id="age" type="number" min="10" max="120" value={formData.age} onChange={handleChange}
                  placeholder="25" className={inputClass} style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
              <div>
                <label className={labelClass} style={{ color: "#5C5E58" }} htmlFor="height">Height (cm)</label>
                <input
                  id="height" type="number" step="0.1" value={formData.height} onChange={handleChange}
                  placeholder="175" className={inputClass} style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
              <div>
                <label className={labelClass} style={{ color: "#5C5E58" }} htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight" type="number" step="0.1" value={formData.weight} onChange={handleChange}
                  placeholder="75" className={inputClass} style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
            </div>
            <div>
              <label className={labelClass} style={{ color: "#5C5E58" }} htmlFor="gender">Gender</label>
              <select
                id="gender" value={formData.gender} onChange={handleChange}
                className={inputClass}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={(e) => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle, cursor: "pointer" })}
                onBlur={(e) => Object.assign(e.target.style, { ...inputStyle, cursor: "pointer" })}
              >
                <option value="" style={{ background: "#1A1D20" }}>Select gender</option>
                <option value="Male" style={{ background: "#1A1D20" }}>Male</option>
                <option value="Female" style={{ background: "#1A1D20" }}>Female</option>
                <option value="Other" style={{ background: "#1A1D20" }}>Other</option>
              </select>
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

          {/* ── Section: Fitness Goal (visual cards) ── */}
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#C8F36A" }}
            >
              Fitness Goal
            </p>
            {/* Hidden input so handleChange / formData.goal still works */}
            <input type="hidden" id="goal" value={formData.goal} onChange={handleChange} />

            <div className="grid grid-cols-3 gap-3">
              {goals.map(({ value, label, icon: Icon, desc }) => {
                const active = formData.goal === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: value })}
                    className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl transition-all duration-200 text-center active:scale-95"
                    style={
                      active
                        ? {
                            background: "rgba(200,243,106,0.1)",
                            border: "1px solid rgba(200,243,106,0.4)",
                            boxShadow: "0 0 16px rgba(200,243,106,0.1)",
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }
                    }
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: active ? "#C8F36A" : "#5C5E58" }}
                    />
                    <span
                      className="text-sm font-bold"
                      style={{ color: active ? "#C8F36A" : "#9A9B95" }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-xs leading-tight"
                      style={{ color: active ? "#9A9B95" : "#5C5E58" }}
                    >
                      {desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl text-sm font-black tracking-wide transition-all active:scale-95 disabled:opacity-50 mt-2 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #C8F36A, #A8D94A)",
              color: "#0E1012",
              boxShadow: loading ? "none" : "0 0 28px rgba(200,243,106,0.35)",
            }}
          >
            {!loading && (
              <span
                className="absolute inset-0 animate-shimmer pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  width: "60%",
                }}
              />
            )}
            {loading ? "Creating Account…" : "Create Account 🚀"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: "#5C5E58" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold transition-colors"
            style={{ color: "#C8F36A" }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
