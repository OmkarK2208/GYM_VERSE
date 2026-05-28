"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

  const inputClass = "w-full rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-base outline-none bg-white/[0.03] border border-white/10 focus:border-red-500/50 transition-colors";

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4" style={{ background: "#050508" }}>
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle,#FF2D20,transparent)", filter: "blur(100px)" }} />

      <div className="relative w-full max-w-sm rounded-2xl p-6 sm:p-8"
        style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)", boxShadow: "0 0 30px rgba(255,45,32,0.4)" }}>
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to track your progress</p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 mb-4 text-sm font-medium text-red-400 text-center"
            style={{ background: "rgba(255,45,32,0.1)", border: "1px solid rgba(255,45,32,0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com" required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required className={inputClass} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50 mt-2"
            style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)", boxShadow: "0 0 20px rgba(255,45,32,0.3)" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold" style={{ color: "#FF2D20" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
