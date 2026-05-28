import Link from "next/link";
import { Dumbbell, Activity, Flame, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#050508", color: "#F0F0F5" }}>
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle,#FF2D20,transparent)", filter: "blur(120px)" }} />

      <header className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)" }}>
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-wider" style={{ background: "linear-gradient(90deg,#FF2D20,#FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            GYMVERSE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white font-medium transition-colors">
            Login
          </Link>
          <Link href="/register" className="text-sm font-bold text-white px-4 py-2 rounded-xl transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)" }}>
            Get Started
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full flex flex-col justify-center items-center text-center px-4 py-12 sm:py-20">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
          style={{ background: "rgba(255,45,32,0.1)", border: "1px solid rgba(255,45,32,0.2)", color: "#FF2D20" }}>
          SMART FITNESS TRACKER
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-4 sm:mb-6 leading-tight text-white">
          Level Up Your <br className="hidden sm:block" />
          <span style={{ background: "linear-gradient(90deg,#FF2D20,#FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Fitness Journey
          </span>
        </h1>
        <p className="text-base sm:text-xl text-gray-400 max-w-2xl mb-8 sm:mb-10 leading-relaxed">
          Track workouts, monitor your weight, plan your diet, and crush your goals with our premium fitness dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-12 sm:mb-20 w-full sm:w-auto">
          <Link href="/register"
            className="flex items-center justify-center gap-2 text-base sm:text-lg font-bold text-white px-8 py-4 rounded-xl transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)", boxShadow: "0 0 30px rgba(255,45,32,0.3)" }}>
            Start Free Now <ChevronRight className="h-5 w-5" />
          </Link>
          <Link href="#features"
            className="flex items-center justify-center text-base sm:text-lg font-semibold text-gray-300 px-8 py-4 rounded-xl transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            Explore Features
          </Link>
        </div>

        <div id="features" className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl text-left">
          {[
            { icon: Activity, color: "#FF2D20", title: "Smart Analytics", desc: "Visualize your progress with advanced charts. Track workout volume, PRs, and daily streaks." },
            { icon: Dumbbell, color: "#3B82F6", title: "Workout Tracker", desc: "Log exercises, sets, reps, and weight. Get automatic 1RM estimations and PR detection." },
            { icon: Flame, color: "#10B981", title: "Diet & Goals", desc: "Calculate your daily macro needs based on your body profile and log meals to stay on track." },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl p-5 sm:p-6 transition-all"
                style={{ background: "rgba(15,15,22,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}22` }}>
                  <Icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="relative z-10 py-6 sm:py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} GYMVERSE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
