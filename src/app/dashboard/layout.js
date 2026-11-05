"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Dumbbell, Scale, Utensils, LineChart,
  LogOut, Bell, ChevronLeft, ChevronRight, Menu, X
} from "lucide-react";

const NAV = [
  { name: "Overview",   href: "/dashboard",           icon: LayoutDashboard, from: "#FF2D20", to: "#FF6B35" },
  { name: "Workouts",   href: "/dashboard/workout",   icon: Dumbbell,        from: "#3B82F6", to: "#06B6D4" },
  { name: "Weight",     href: "/dashboard/weight",     icon: Scale,           from: "#8B5CF6", to: "#EC4899" },
  { name: "Diet",       href: "/dashboard/diet",       icon: Utensils,        from: "#10B981", to: "#34D399" },
  { name: "Analytics",  href: "/dashboard/analytics",  icon: LineChart,       from: "#F59E0B", to: "#FBBF24" },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (!d.error) setUser(d); });
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const active = (href) => pathname === href;
  const pageTitle = NAV.find(n => n.href === pathname)?.name ?? "Dashboard";

  /* ───── Desktop Sidebar Inner ───── */
  const SidebarInner = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`relative flex items-center gap-3 p-5 ${collapsed ? "justify-center" : ""}`}>
        {/* Lime glow at top */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(200,243,106,0.4), transparent)" }} />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(200,243,106,0.12),transparent 70%)" }} />

        {/* GV Monogram */}
        <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm"
          style={{ background: "rgba(200,243,106,0.12)", border: "1px solid rgba(200,243,106,0.25)", color: "#C8F36A" }}>
          GV
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
              <div className="text-sm font-black tracking-[4px] uppercase" style={{ color: "#C8F36A" }}>
                GYMVERSE
              </div>
              <div className="text-[9px] tracking-[2px] uppercase" style={{ color: "#5C5E58" }}>Pro Dashboard</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px mb-2" style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const on = active(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-200 group
                  ${collapsed ? "justify-center px-2" : ""}`}
                style={on
                  ? { background: "rgba(200,243,106,0.08)", border: "1px solid rgba(200,243,106,0.15)" }
                  : { background: "transparent", border: "1px solid transparent" }}
              >
                {/* Active lime left-bar */}
                {on && (
                  <motion.div layoutId="desk-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: "#C8F36A", boxShadow: "0 0 8px rgba(200,243,106,0.6)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                )}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200`}
                  style={on
                    ? { background: "rgba(200,243,106,0.15)", border: "1px solid rgba(200,243,106,0.2)" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid transparent" }}>
                  <Icon className={`w-4 h-4 transition-colors`}
                    style={{ color: on ? "#C8F36A" : "#5C5E58" }} />
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                      className="text-sm font-medium transition-colors"
                      style={{ color: on ? "#C8F36A" : "#9A9B95" }}>
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-2 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
              style={{ background: "rgba(200,243,106,0.15)", border: "1px solid rgba(200,243,106,0.25)", color: "#C8F36A" }}>
              {user.name?.[0] ?? "U"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: "#F2F0EA" }}>{user.name}</div>
              <div className="text-[10px] truncate" style={{ color: "#5C5E58" }}>{user.goal}</div>
            </div>
          </div>
        )}
        <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }} onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
            ${collapsed ? "justify-center" : ""}`}
          style={{ color: "#9A9B95" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9A9B95"; }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <LogOut className="w-4 h-4" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium">
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="flex h-[100dvh] overflow-hidden" style={{ background: "#0E1012", color: "#F2F0EA" }}>
      {/* ───── Desktop Sidebar ───── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col flex-shrink-0 relative overflow-hidden"
        style={{ background: "#0A0C0E", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <SidebarInner />
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10"
          style={{ background: "#0A0C0E", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 0 12px rgba(0,0,0,0.6)" }}>
          {collapsed ? <ChevronRight className="w-3 h-3" style={{ color: "#5C5E58" }} /> : <ChevronLeft className="w-3 h-3" style={{ color: "#5C5E58" }} />}
        </motion.button>
      </motion.aside>

      {/* ───── Main ───── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5"
          style={{ background: "rgba(10,12,14,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs"
                style={{ background: "rgba(200,243,106,0.12)", border: "1px solid rgba(200,243,106,0.25)", color: "#C8F36A" }}>
                GV
              </div>
              <span className="text-sm font-black tracking-[3px]" style={{ color: "#C8F36A" }}>
                GYMVERSE
              </span>
            </div>
            {/* Desktop breadcrumb */}
            <div className="hidden lg:block">
              <div className="text-[10px] uppercase tracking-[3px]" style={{ color: "#5C5E58" }}>Dashboard</div>
              <div className="text-sm font-semibold" style={{ color: "#F2F0EA" }}>{pageTitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center relative"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#5C5E58" }}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#C8F36A" }} />
            </motion.button>
            <button onClick={logout} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors lg:hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <LogOut className="w-4 h-4" style={{ color: "#9A9B95" }} />
            </button>
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: "rgba(200,243,106,0.15)", border: "1px solid rgba(200,243,106,0.2)", color: "#C8F36A" }}>
                {user?.name?.[0] ?? "U"}
              </div>
              <span className="text-xs sm:text-sm" style={{ color: "#9A9B95" }}>{user?.name?.split(" ")[0] ?? "User"}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* ───── Mobile Bottom Nav ───── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ background: "rgba(10,12,14,0.95)", backdropFilter: "blur(24px) saturate(180%)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-around px-2 py-1.5">
          {NAV.map((item) => {
            const on = active(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="flex flex-col items-center py-1.5 rounded-xl transition-all duration-200 relative"
                >
                  {on && (
                    <motion.div
                      layoutId="mobile-pill"
                      className="absolute -top-1.5 w-6 h-[3px] rounded-full"
                      style={{ background: "#C8F36A", boxShadow: "0 0 8px rgba(200,243,106,0.7)" }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={on ? { background: "rgba(200,243,106,0.1)" } : {}}>
                    <Icon className="w-5 h-5 transition-colors duration-200"
                      style={{ color: on ? "#C8F36A" : "#5C5E58" }} />
                  </div>
                  <span className="text-[10px] font-semibold mt-0.5 transition-colors duration-200"
                    style={{ color: on ? "#C8F36A" : "#5C5E58" }}>
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
