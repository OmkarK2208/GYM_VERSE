import Link from "next/link";
import { Activity, Dumbbell, Flame, ChevronRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <div
      className="min-h-[100dvh] flex flex-col overflow-x-hidden"
      style={{ background: "#0E1012", color: "#F2F0EA" }}
    >
      {/* ── Animated gradient mesh background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* blob 1 */}
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07] animate-blob"
          style={{
            background: "radial-gradient(circle, #C8F36A, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* blob 2 */}
        <div
          className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full opacity-[0.05] animate-blob-slow"
          style={{
            background: "radial-gradient(circle, #566B39, transparent 70%)",
            filter: "blur(100px)",
            animationDelay: "3s",
          }}
        />
        {/* blob 3 */}
        <div
          className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.06] animate-blob"
          style={{
            background: "radial-gradient(circle, #B8E36B, transparent 70%)",
            filter: "blur(90px)",
            animationDelay: "6s",
          }}
        />

        {/* CSS particle dots */}
        {[
          { size: 3, top: "12%", left: "8%",  delay: "0s",   dur: "7s"  },
          { size: 2, top: "28%", left: "90%", delay: "1.5s", dur: "9s"  },
          { size: 4, top: "55%", left: "15%", delay: "3s",   dur: "6s"  },
          { size: 2, top: "72%", left: "80%", delay: "0.8s", dur: "8s"  },
          { size: 3, top: "88%", left: "45%", delay: "2s",   dur: "10s" },
          { size: 2, top: "40%", left: "50%", delay: "4s",   dur: "7s"  },
          { size: 2, top: "18%", left: "65%", delay: "2.5s", dur: "8s"  },
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

        {/* subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,243,106,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,243,106,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* ═══════════════════════════════════
          HEADER / NAV
      ═══════════════════════════════════ */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-5 sm:px-8 py-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center glow-lime-sm animate-pulse-glow"
            style={{ background: "linear-gradient(135deg, #C8F36A, #8BB840)" }}
          >
            <Dumbbell className="h-5 w-5" style={{ color: "#0E1012" }} />
          </div>
          <span
            className="text-xl font-black tracking-widest text-gradient-lime"
          >
            GYMVERSE
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium transition-colors"
            style={{ color: "#9A9B95" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F2F0EA")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9A9B95")}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #C8F36A, #A8D94A)",
              color: "#0E1012",
              boxShadow: "0 0 20px rgba(200,243,106,0.25)",
            }}
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* ═══════════════════════════════════
          HERO
      ═══════════════════════════════════ */}
      <main className="relative z-10 flex-1 flex flex-col">
        <section className="max-w-7xl mx-auto w-full px-5 sm:px-8 pt-12 pb-24 sm:pt-20 sm:pb-36 flex flex-col items-center text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: "rgba(200,243,106,0.08)",
              border: "1px solid rgba(200,243,106,0.25)",
              color: "#C8F36A",
            }}
          >
            <Zap className="h-3 w-3" />
            Smart Fitness Tracker
          </div>

          {/* Editorial headline */}
          <h1
            className="font-black tracking-tighter leading-none mb-6"
            style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)" }}
          >
            <span style={{ color: "#F2F0EA" }}>TRAIN BEYOND</span>
            <br />
            <span className="text-gradient-lime">YOUR LIMITS</span>
          </h1>

          <p
            className="max-w-xl mb-10 leading-relaxed"
            style={{ color: "#9A9B95", fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
          >
            Track workouts, monitor your progress, plan your diet, and crush
            every goal — all in one premium fitness dashboard.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-2xl transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #C8F36A, #A8D94A)",
                color: "#0E1012",
                fontSize: "1rem",
                boxShadow: "0 0 36px rgba(200,243,106,0.3)",
              }}
            >
              Start Training <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="flex items-center justify-center font-semibold px-8 py-4 rounded-2xl transition-all active:scale-95"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F2F0EA",
                fontSize: "1rem",
              }}
            >
              Explore Features
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════
            STATS BAR
        ═══════════════════════════════════ */}
        <section
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(20,22,24,0.6)",
          }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            {[
              { value: "10,000+", label: "Workouts Logged" },
              { value: "500+",    label: "Foods Tracked" },
              { value: "100%",    label: "Free" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-2xl sm:text-3xl font-black text-gradient-lime"
                >
                  {stat.value}
                </div>
                <div className="text-sm mt-1" style={{ color: "#5C5E58" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════
            FEATURES — ASYMMETRIC LAYOUT
        ═══════════════════════════════════ */}
        <section
          id="features"
          className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-20 sm:py-28"
        >
          <div className="mb-12 text-center">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#C8F36A" }}
            >
              Everything You Need
            </p>
            <h2
              className="font-black tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#F2F0EA" }}
            >
              Built for Results
            </h2>
          </div>

          {/* Asymmetric grid: large card left, two stacked right */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Feature 1 — large card (spans 3 cols) */}
            <div
              className="lg:col-span-3 card-glass p-8 sm:p-10 group relative overflow-hidden"
              style={{ minHeight: "340px" }}
            >
              {/* Decorative corner glow */}
              <div
                className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle, #C8F36A, transparent)", filter: "blur(40px)" }}
              />

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "rgba(200,243,106,0.1)", border: "1px solid rgba(200,243,106,0.2)" }}
              >
                <Activity className="h-7 w-7" style={{ color: "#C8F36A" }} />
              </div>

              <h3
                className="text-2xl sm:text-3xl font-black mb-4 tracking-tight"
                style={{ color: "#F2F0EA" }}
              >
                Smart Analytics
              </h3>
              <p style={{ color: "#9A9B95", lineHeight: "1.7", maxWidth: "400px" }}>
                Visualize your progress with advanced interactive charts.
                Track workout volume, personal records, daily streaks, and
                long-term trends — all in real time.
              </p>

              {/* Fake mini chart decoration */}
              <div className="mt-8 flex items-end gap-1.5 h-12">
                {[40, 65, 50, 80, 55, 90, 70, 95, 72, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all duration-300"
                    style={{
                      height: `${h}%`,
                      background: i === 9
                        ? "linear-gradient(180deg, #C8F36A, #8BB840)"
                        : "rgba(200,243,106,0.15)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right column — two stacked cards */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Feature 2 */}
              <div className="card-glass p-7 group relative overflow-hidden flex-1">
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle, #C8F36A, transparent)", filter: "blur(30px)" }}
                />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(200,243,106,0.1)", border: "1px solid rgba(200,243,106,0.2)" }}
                >
                  <Dumbbell className="h-5 w-5" style={{ color: "#C8F36A" }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#F2F0EA" }}>
                  Workout Tracker
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9A9B95" }}>
                  Log exercises, sets, reps, and weight. Get automatic 1RM
                  estimations and instant PR detection.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card-glass p-7 group relative overflow-hidden flex-1">
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle, #C8F36A, transparent)", filter: "blur(30px)" }}
                />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(200,243,106,0.1)", border: "1px solid rgba(200,243,106,0.2)" }}
                >
                  <Flame className="h-5 w-5" style={{ color: "#C8F36A" }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#F2F0EA" }}>
                  Nutrition &amp; Hydration
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9A9B95" }}>
                  Calculate daily macros from your body profile and log
                  meals to stay on track toward your goals.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════
          FOOTER
      ═══════════════════════════════════ */}
      <footer
        className="relative z-10 py-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" style={{ color: "#C8F36A" }} />
            <span className="text-sm font-bold tracking-widest text-gradient-lime">
              GYMVERSE
            </span>
          </div>
          <p className="text-sm" style={{ color: "#5C5E58" }}>
            © {new Date().getFullYear()} GYMVERSE. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/login" className="text-sm transition-colors" style={{ color: "#5C5E58" }}>Login</Link>
            <Link href="/register" className="text-sm transition-colors" style={{ color: "#5C5E58" }}>Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
