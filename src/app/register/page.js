"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

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

  const inputClass = "w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none bg-white/[0.03] border border-white/10 focus:border-red-500/50 transition-colors";
  const labelClass = "block text-xs uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 py-8" style={{ background: "#050508" }}>
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle,#FF2D20,transparent)", filter: "blur(100px)" }} />

      <div className="relative w-full max-w-md rounded-2xl p-6 sm:p-8"
        style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)", boxShadow: "0 0 30px rgba(255,45,32,0.4)" }}>
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Join GYMVERSE</h1>
          <p className="text-gray-500 text-sm mt-1">Start your fitness journey today</p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 mb-4 text-sm font-medium text-red-400 text-center"
            style={{ background: "rgba(255,45,32,0.1)", border: "1px solid rgba(255,45,32,0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="name">Full Name *</label>
              <input id="name" type="text" value={formData.name} onChange={handleChange} required placeholder="John Doe" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="email">Email *</label>
              <input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@email.com" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="password">Password *</label>
            <input id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className={inputClass} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass} htmlFor="age">Age</label>
              <input id="age" type="number" min="10" max="120" value={formData.age} onChange={handleChange} placeholder="25" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="gender">Gender</label>
              <select id="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="goal">Goal</label>
              <select id="goal" value={formData.goal} onChange={handleChange} className={inputClass}>
                <option value="Maintain">Maintain</option>
                <option value="Bulk">Bulk</option>
                <option value="Cut">Cut</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="height">Height (cm)</label>
              <input id="height" type="number" step="0.1" value={formData.height} onChange={handleChange} placeholder="175" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="weight">Weight (kg)</label>
              <input id="weight" type="number" step="0.1" value={formData.weight} onChange={handleChange} placeholder="75" className={inputClass} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50 mt-2"
            style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)", boxShadow: "0 0 20px rgba(255,45,32,0.3)" }}>
            {loading ? "Creating Account..." : "Create Account 🚀"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "#FF2D20" }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
