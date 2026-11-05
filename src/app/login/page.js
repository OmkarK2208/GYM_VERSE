"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

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
        setError("OTP sent to your email (or terminal for dev)");
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
    "w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 " +
    "placeholder:text-[#5C5E58]";

  const inputStyle = {
    background: "#1A1D20",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#F2F0EA",
  };

  const inputFocusStyle = {
    borderColor: "rgba(200,243,106,0.5)",
    boxShadow: "0 0 0 3px rgba(200,243,106,0.08)",
  };

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: "#0E1012" }}
    >
      {/* ── Animated background blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-[0.07] animate-blob"
          style={{
            background: "radial-gradient(circle, #C8F36A, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full opacity-[0.05] animate-blob-slow"
          style={{
            background: "radial-gradient(circle, #566B39, transparent 70%)",
            filter: "blur(100px)",
            animationDelay: "4s",
          }}
        />
        {/* particles */}
        {[
          { size: 3, top: "15%", left: "10%", delay: "0s",   dur: "7s" },
          { size: 2, top: "75%", left: "85%", delay: "1.5s", dur: "9s" },
          { size: 2, top: "50%", left: "5%",  delay: "3s",   dur: "6s" },
          { size: 3, top: "30%", left: "90%", delay: "2s",   dur: "8s" },
        ].map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      {/* ── Card ── */}
      <div
        className="relative w-full max-w-sm rounded-3xl p-7 sm:p-9"
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
            Welcome Back
          </h1>
          <p className="text-sm" style={{ color: "#5C5E58" }}>
            Sign in to track your progress
          </p>
        </div>

        {/* ── Method toggle ── */}
        <div
          className="flex p-1 mb-6 rounded-xl gap-1"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {["password", "otp"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setLoginMethod(m); setOtpSent(false); setError(""); }}
              className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize"
              style={
                loginMethod === m
                  ? {
                      background: "linear-gradient(135deg, #C8F36A, #A8D94A)",
                      color: "#0E1012",
                      boxShadow: "0 2px 8px rgba(200,243,106,0.25)",
                    }
                  : { color: "#5C5E58" }
              }
            >
              {m === "otp" ? "OTP" : "Password"}
            </button>
          ))}
        </div>

        {/* ── Error / info banner ── */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 mb-5 text-sm font-medium text-center"
            style={
              error.includes("OTP sent") || error.includes("Verified")
                ? { background: "rgba(200,243,106,0.08)", border: "1px solid rgba(200,243,106,0.2)", color: "#C8F36A" }
                : { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }
            }
          >
            {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label
              className="block text-xs uppercase tracking-widest mb-1.5 font-semibold"
              style={{ color: "#5C5E58" }}
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              disabled={otpSent}
              className={inputClass}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          {/* Password */}
          {loginMethod === "password" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-xs uppercase tracking-widest font-semibold"
                  style={{ color: "#5C5E58" }}
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium transition-colors"
                  style={{ color: "#C8F36A" }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
          )}

          {/* OTP */}
          {loginMethod === "otp" && otpSent && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-xs uppercase tracking-widest font-semibold"
                  style={{ color: "#5C5E58" }}
                  htmlFor="otp"
                >
                  One-Time Password
                </label>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs font-medium"
                  style={{ color: "#C8F36A", background: "none", padding: 0, border: "none" }}
                >
                  Edit Email
                </button>
              </div>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 4-digit OTP"
                required
                maxLength={4}
                className={inputClass}
                style={{ ...inputStyle, letterSpacing: "0.3em", textAlign: "center", fontSize: "1.25rem" }}
                onFocus={(e) => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle, letterSpacing: "0.3em", textAlign: "center", fontSize: "1.25rem" })}
                onBlur={(e) => Object.assign(e.target.style, { ...inputStyle, letterSpacing: "0.3em", textAlign: "center", fontSize: "1.25rem" })}
              />
            </div>
          )}

          {/* Submit */}
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
            {/* Shimmer overlay */}
            {!loading && (
              <span
                className="absolute inset-0 animate-shimmer pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  width: "60%",
                }}
              />
            )}
            {loading
              ? "Processing…"
              : loginMethod === "otp"
              ? otpSent
                ? "Verify OTP"
                : "Send OTP"
              : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: "#5C5E58" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold transition-colors"
            style={{ color: "#C8F36A" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
