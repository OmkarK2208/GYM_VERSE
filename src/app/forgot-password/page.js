"use client";
import { useState } from "react";
import Link from "next/link";
import { Dumbbell, ArrowLeft, Send } from "lucide-react";
import { GymUniverseCanvas } from "@/components/3d/GymUniverseCanvas";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setMessage("If an account exists with this email, a security reset link has been dispatched.");
      setLoading(false);
    }, 1200);
  };

  const inputClass =
    "w-full rounded-xl px-4 py-3.5 text-white placeholder-stone-500 text-sm outline-none bg-dark-900/80 border border-white/10 focus:border-lime focus:ring-1 focus:ring-lime transition-all";

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center px-4 py-12 bg-dark-950 overflow-hidden">
      <GymUniverseCanvas density={30} interactive={true} />

      <div className="relative z-10 w-full max-w-sm rounded-3xl p-8 glass-panel border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <Link
          href="/login"
          className="inline-flex items-center text-xs text-stone-400 hover:text-white transition-colors mb-6 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to portal
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-lime to-olive shadow-[0_0_25px_rgba(200,243,106,0.35)]">
            <Dumbbell className="w-7 h-7 text-dark-950" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Recovery Access</h1>
          <p className="text-stone-400 text-xs mt-1">Enter your athlete email to receive verification instructions</p>
        </div>

        {message && (
          <div className="rounded-xl px-4 py-3 mb-5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-stone-400 font-semibold mb-2" htmlFor="email">
              Athlete Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@gymverse.com"
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-black text-dark-950 bg-lime hover:bg-lime-hover transition-all active:scale-98 disabled:opacity-50 mt-2 shadow-[0_0_20px_rgba(200,243,106,0.3)] flex items-center justify-center gap-2"
          >
            {loading ? "Transmitting..." : "Send Reset Link"}
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
