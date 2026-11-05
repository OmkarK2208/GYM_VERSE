"use client";
import { useState } from "react";
import Link from "next/link";
import { Dumbbell, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMessage("If an account exists with this email, a password reset link has been sent.");
      setLoading(false);
    }, 1500);
  };

  const inputClass = "w-full rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-base outline-none bg-white/[0.03] border border-white/10 focus:border-red-500/50 transition-colors";

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4" style={{ background: "#050508" }}>
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle,#FF2D20,transparent)", filter: "blur(100px)" }} />

      <div className="relative w-full max-w-sm rounded-2xl p-6 sm:p-8"
        style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>

        <Link href="/login" className="inline-flex items-center text-xs text-gray-500 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)", boxShadow: "0 0 30px rgba(255,45,32,0.4)" }}>
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your email to receive a reset link</p>
        </div>

        {message && (
          <div className="rounded-xl px-4 py-3 mb-4 text-sm font-medium text-green-400 text-center"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com" required className={inputClass} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50 mt-2"
            style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)", boxShadow: "0 0 20px rgba(255,45,32,0.3)" }}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
