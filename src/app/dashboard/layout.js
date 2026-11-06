"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Dumbbell,
  Scale,
  Utensils,
  LineChart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles,
} from "lucide-react";

const NAV = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, color: "#C8F36A" },
  { name: "Workouts", href: "/dashboard/workout", icon: Dumbbell, color: "#38BDF8" },
  { name: "Diet Studio", href: "/dashboard/diet", icon: Utensils, color: "#4ADE80" },
  { name: "Weight Log", href: "/dashboard/weight", icon: Scale, color: "#A78BFA" },
  { name: "Analytics", href: "/dashboard/analytics", icon: LineChart, color: "#FBBF24" },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setUser(d);
      })
      .catch(() => {});
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const active = (href) => pathname === href;
  const pageTitle = NAV.find((n) => n.href === pathname)?.name ?? "Dashboard";

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-dark-950 text-stone-100 font-sans">
      {/* ───── Desktop Sidebar (Squarespace Executive Minimalist Style) ───── */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 260 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col flex-shrink-0 relative bg-dark-900 border-r border-white/5 z-30"
      >
        {/* Logo Bar */}
        <div className={`flex items-center gap-3 p-5 border-b border-white/5 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime to-olive flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(200,243,106,0.3)]">
            <Dumbbell className="w-5 h-5 text-dark-950" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <div className="text-base font-black tracking-tight text-white flex items-center gap-1">
                  GYM<span className="text-lime">VERSE</span>
                </div>
                <div className="text-[9px] tracking-[2.5px] text-stone-500 uppercase font-mono">
                  PRO COMMAND CENTER
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {NAV.map((item) => {
            const on = active(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`relative flex items-center gap-3 rounded-xl px-3.5 py-3 cursor-pointer transition-all ${
                    on
                      ? "bg-white/10 text-white font-bold"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                >
                  {/* Active Indicator Bar */}
                  {on && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-lime shadow-[0_0_10px_#C8F36A]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      on ? "text-lime" : "text-stone-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-white/5 space-y-2">
          {!collapsed && user && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-full bg-lime/20 border border-lime/40 flex items-center justify-center text-lime text-xs font-black">
                {user.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-lime font-mono uppercase tracking-wider">{user.goal || "Athlete"}</div>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-xs font-semibold">Terminate Session</span>}
          </button>
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-850 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white shadow-md z-40"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </motion.aside>

      {/* ───── Main Viewport ───── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-white/5 bg-dark-950/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Brand */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-lime flex items-center justify-center text-dark-950">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="text-sm font-black text-white">GYMVERSE</span>
            </div>

            {/* Desktop Breadcrumbs */}
            <div className="hidden lg:block">
              <div className="text-[10px] uppercase font-mono tracking-widest text-stone-500">
                SYSTEM INTERFACE
              </div>
              <div className="text-sm font-bold text-white">{pageTitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 3D System Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-lime font-bold">
                3D Physics Engine Active
              </span>
            </div>

            {/* User chip */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-stone-300">
                {user?.name?.split(" ")[0] ?? "Athlete"}
              </span>
            </div>

            <button
              onClick={logout}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* ───── Mobile Bottom Dock Navigation (Squarespace/iOS Style) ───── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-2xl border-t border-white/5 px-2 py-2">
        <div className="flex items-center justify-around">
          {NAV.map((item) => {
            const on = active(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <div className="flex flex-col items-center py-1 relative">
                  {on && (
                    <motion.div
                      layoutId="mobile-dock-active"
                      className="absolute -top-2 w-8 h-[2px] rounded-full bg-lime shadow-[0_0_8px_#C8F36A]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      on ? "bg-lime/20 text-lime" : "text-stone-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[9px] font-bold mt-0.5 tracking-tight ${
                      on ? "text-white" : "text-stone-500"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
