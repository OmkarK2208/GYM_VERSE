"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center text-stone-100">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-black text-2xl mb-6">
        !
      </div>
      <div className="text-xs font-mono uppercase tracking-[3px] text-rose-400 font-bold mb-2">
        RUNTIME EXCEPTION
      </div>
      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
        Session Interrupted
      </h1>
      <p className="max-w-md text-stone-400 text-sm mb-8">
        An unexpected condition occurred in the active fitness module.
      </p>
      <button
        onClick={() => (reset ? reset() : window.location.reload())}
        className="px-6 py-3.5 rounded-xl bg-lime text-dark-950 font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(200,243,106,0.3)] hover:scale-105 active:scale-95 transition-all"
      >
        Retry Component
      </button>
    </div>
  );
}
