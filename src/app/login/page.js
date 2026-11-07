"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell, ArrowRight, ShieldCheck, KeyRound, Mail, Sparkles } from "lucide-react";
import { GymUniverseCanvas } from "@/components/3d/GymUniverseCanvas";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState("password");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (loginMethod === "otp" && !otpSent) {
      // Step 1: Request OTP
      try {
        const res = await fetch("/api/auth/otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send OTP");

        setOtpSent(true);
        setError(data.message || "OTP generated successfully");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      // Step 2: Verify Login (Password or OTP)
      const payload = { email };
      if (loginMethod === "password") payload.password = password;
      if (loginMethod === "otp") payload.otp = otp;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl px-4 py-3.5 text-white placeholder-stone-500 text-sm outline-none bg-dark-900/80 border border-white/10 focus:border-lime focus:ring-1 focus:ring-lime transition-all";

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center px-4 py-12 bg-dark-950 overflow-hidden">
      {/* Interactive 3D Canvas Background */}
      <GymUniverseCanvas density={35} interactive={true} />

      {/* Atmospheric Glow */}
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-gradient from-lime/10 to-transparent blur-3xl opacity-60" />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md rounded-3xl p-8 glass-panel border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* Brand / Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-lime to-olive shadow-[0_0_25px_rgba(200,243,106,0.35)] transition-transform group-hover:scale-105">
              <Dumbbell className="w-7 h-7 text-dark-950" />
            </div>
          </Link>
          <div className="text-xs uppercase tracking-[4px] text-lime font-mono font-bold mb-1">
            ACCESS PORTAL
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Enter GYMVERSE</h1>
          <p className="text-stone-400 text-xs mt-1">Authenticate to synchronize your 3D training universe</p>
        </div>

        {/* Toggle Login Method — Squarespace Segmented Control */}
        <div className="flex p-1 mb-6 rounded-xl bg-dark-950/80 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("password");
              setOtpSent(false);
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              loginMethod === "password"
                ? "bg-white/15 text-white shadow-sm"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("otp");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              loginMethod === "otp"
                ? "bg-white/15 text-white shadow-sm"
                : "text-stone-400 hover:text-white"
            }`}
          >
            One-Time Password
          </button>
        </div>

        {error && (
          <div
            className={`rounded-xl px-4 py-3 mb-5 text-xs font-semibold text-center border ${
              error.includes("sent") || error.includes("Verified")
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : "text-rose-400 bg-rose-500/10 border-rose-500/20"
            }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-stone-400 font-semibold mb-2" htmlFor="email">
              Athlete Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@gymverse.com"
                required
                disabled={otpSent}
                className={inputClass}
              />
            </div>
          </div>

          {loginMethod === "password" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] uppercase tracking-widest text-stone-400 font-semibold" htmlFor="password">
                  Security Password
                </label>
                <Link href="/forgot-password" className="text-xs text-lime hover:underline transition-colors font-medium">
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className={inputClass}
              />
            </div>
          )}

          {loginMethod === "otp" && otpSent && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] uppercase tracking-widest text-stone-400 font-semibold" htmlFor="otp">
                  Enter 4-Digit Code
                </label>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-lime hover:underline"
                >
                  Change Email
                </button>
              </div>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="0 0 0 0"
                required
                className={`${inputClass} text-center tracking-[12px] font-mono text-lg font-bold`}
                maxLength={4}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl text-sm font-black text-dark-950 bg-lime hover:bg-lime-hover transition-all active:scale-98 disabled:opacity-50 mt-4 shadow-[0_0_25px_rgba(200,243,106,0.35)] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block animate-spin mr-2">⟳</span>
            ) : null}
            {loading
              ? "Connecting..."
              : loginMethod === "otp"
              ? otpSent
                ? "Verify & Enter Dashboard"
                : "Generate One-Time Code"
              : "Launch Dashboard"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-stone-400">
          New to the universe?{" "}
          <Link href="/register" className="font-bold text-lime hover:underline ml-1">
            Create Athlete Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
