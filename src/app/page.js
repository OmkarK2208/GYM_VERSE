import Link from "next/link";
import { Dumbbell, Activity, Flame, Shield, ArrowRight, Zap, Target, Award, Sparkles } from "lucide-react";
import { GymUniverseCanvas } from "@/components/3d/GymUniverseCanvas";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark-950 text-stone-50 overflow-hidden flex flex-col">
      {/* Interactive 3D Gym Universe Background */}
      <GymUniverseCanvas density={50} interactive={true} />

      {/* Atmospheric Radial Glows */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-radial-gradient from-lime/10 to-transparent blur-3xl opacity-70" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[600px] h-[500px] bg-radial-gradient from-cyan-gym/10 to-transparent blur-3xl opacity-40" />

      {/* Navigation Header — Squarespace Inspired Elegance */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime to-olive flex items-center justify-center shadow-[0_0_20px_rgba(200,243,106,0.35)]">
            <Dumbbell className="h-5 w-5 text-dark-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              GYM<span className="text-lime">VERSE</span>
            </span>
            <span className="text-[9px] uppercase tracking-[3px] text-stone-400 font-mono">3D FITNESS UNIVERSE</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
          <a href="#features" className="hover:text-lime transition-colors">Architecture</a>
          <a href="#experience" className="hover:text-lime transition-colors">3D Experience</a>
          <a href="#performance" className="hover:text-lime transition-colors">Performance</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-stone-300 hover:text-white px-4 py-2 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-black text-dark-950 bg-lime hover:bg-lime-hover px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(200,243,106,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Enter Universe
          </Link>
        </div>
      </header>

      {/* Hero Section — Ysuriadesign Cinematic Scale & Squarespace Visual Polish */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center text-center">
        {/* Release Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-lime animate-spin-slow" />
          <span className="text-xs font-bold uppercase tracking-widest text-lime">Next-Gen 3D Fitness Intelligence</span>
        </div>

        {/* Large Editorial Headline */}
        <h1 className="max-w-5xl text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8 text-white">
          SCULPT YOUR BODY <br />
          <span className="text-gradient-lime">IN THREE DIMENSIONS.</span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-stone-400 mb-10 leading-relaxed font-normal">
          Experience fitness tracking reimagined as a photorealistic universe. Interactive 3D nutrition physics, biomechanical muscle demonstrations, precision PR detection, and intelligent analytics.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-3 text-base font-black text-dark-950 bg-lime hover:bg-lime-hover px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(200,243,106,0.4)] hover:scale-105 active:scale-95"
          >
            Start Your Journey <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center text-base font-semibold text-stone-200 border border-white/10 bg-dark-850/80 hover:bg-dark-800 px-8 py-4 rounded-xl backdrop-blur-md transition-all hover:border-lime/40"
          >
            Explore Engine
          </a>
        </div>

        {/* Asymmetric Editorial Highlights (Bizar + Squarespace) */}
        <div id="features" className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left my-8">
          {/* Card 1: 3D Nutrition */}
          <div className="glass-panel-hover glass-panel rounded-2xl p-7 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime/10 rounded-full blur-2xl pointer-events-none group-hover:bg-lime/20 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-lime/15 border border-lime/30 flex items-center justify-center mb-6 text-lime">
              <Flame className="h-6 w-6" />
            </div>
            <div className="text-xs uppercase tracking-widest text-lime font-mono mb-2">PHYSICS ENGINE</div>
            <h3 className="text-2xl font-black text-white mb-3">Interactive 3D Nutrition</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Drop real ingredients into a 3D bowl with physical mass and collision. Watch sprouts, moong, and soya chunks accumulate while macros calculate in real time.
            </p>
          </div>

          {/* Card 2: Biomechanical Athlete */}
          <div className="glass-panel-hover glass-panel rounded-2xl p-7 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-gym/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-gym/20 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-cyan-gym/15 border border-cyan-gym/30 flex items-center justify-center mb-6 text-cyan-gym">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div className="text-xs uppercase tracking-widest text-cyan-gym font-mono mb-2">ANATOMICAL 3D</div>
            <h3 className="text-2xl font-black text-white mb-3">Biomechanical Athlete</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Rotate 360° around a dynamic 3D athlete demonstrating exercise form with real-time target muscle group activation highlights and barbell physics.
            </p>
          </div>

          {/* Card 3: 3D Hydration & Analytics */}
          <div className="glass-panel-hover glass-panel rounded-2xl p-7 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center mb-6 text-amber-400">
              <Award className="h-6 w-6" />
            </div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-mono mb-2">DYNAMIC FEEDBACK</div>
            <h3 className="text-2xl font-black text-white mb-3">Trophies & Water Waves</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Hydrate with an interactive 3D water glass featuring fluid wave simulations. Unlock golden PR trophies and celebrate personal records with real data persistence.
            </p>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div id="experience" className="w-full mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-white/10">
          <div className="text-center">
            <div className="text-4xl font-black text-lime font-mono">100%</div>
            <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">Real Data Persistence</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-white font-mono">60 FPS</div>
            <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">3D Hardware Accelerated</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-cyan-gym font-mono">100+</div>
            <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">Foods & Exercises</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-amber-400 font-mono">PRO</div>
            <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">PR Detection Engine</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 py-8 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">GYMVERSE</span>
            <span>— The Interactive 3D Fitness Universe</span>
          </div>
          <div>© {new Date().getFullYear()} GymVerse Corp. All features preserved and enhanced.</div>
        </div>
      </footer>
    </div>
  );
}
