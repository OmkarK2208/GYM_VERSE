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
      <div className={`flex items-center gap-3 p-4 border-b border-white/5 ${collapsed ? "justify-center" : ""}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)", boxShadow: "0 0 20px rgba(255,45,32,0.5)" }}
        >
          <Dumbbell className="w-5 h-5 text-white" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
              <div className="text-base font-black tracking-widest" style={{ background: "linear-gradient(90deg,#FF2D20,#FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                GYMVERSE
              </div>
              <div className="text-[9px] tracking-[3px] text-gray-500 uppercase">Pro Dashboard</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const on = active(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 3 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-200 group
                  ${on ? "border border-red-500/20" : "border border-transparent hover:bg-white/5"}
                  ${collapsed ? "justify-center px-2" : ""}`}
                style={on ? { background: "linear-gradient(135deg,rgba(255,45,32,0.12),rgba(255,107,53,0.06))" } : {}}
              >
                {on && (
                  <motion.div layoutId="desk-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: `linear-gradient(180deg,${item.from},${item.to})` }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                )}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                    ${on ? "" : "bg-white/5 group-hover:bg-white/10"}`}
                  style={on ? { background: `linear-gradient(135deg,${item.from},${item.to})`, boxShadow: `0 0 14px ${item.from}55` } : {}}>
                  <Icon className={`w-4 h-4 ${on ? "text-white" : "text-gray-500 group-hover:text-gray-200"}`} />
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                      className={`text-sm font-medium ${on ? "text-white" : "text-gray-400 group-hover:text-gray-100"}`}>
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
      <div className="p-2 border-t border-white/5 space-y-1">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)" }}>
              {user.name?.[0] ?? "U"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-gray-500 truncate">{user.goal}</div>
            </div>
          </div>
        )}
        <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }} onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 group
            ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
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
    <div className="flex h-[100dvh] overflow-hidden" style={{ background: "#050508", color: "#F0F0F5" }}>
      {/* ───── Desktop Sidebar ───── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col flex-shrink-0 relative overflow-hidden"
        style={{ background: "#0A0A0F", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <SidebarInner />
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10 border border-white/10"
          style={{ background: "#0A0A0F", boxShadow: "0 0 10px rgba(0,0,0,0.5)" }}>
          {collapsed ? <ChevronRight className="w-3 h-3 text-gray-400" /> : <ChevronLeft className="w-3 h-3 text-gray-400" />}
        </motion.button>
      </motion.aside>

      {/* ───── Main ───── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/5"
          style={{ background: "rgba(10,10,15,0.8)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)" }}>
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-black tracking-wider" style={{ background: "linear-gradient(90deg,#FF2D20,#FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                GYMVERSE
              </span>
            </div>
            {/* Desktop breadcrumb */}
            <div className="hidden lg:block">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Dashboard</div>
              <div className="text-sm font-semibold text-white">{pageTitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </motion.button>
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "linear-gradient(135deg,#FF2D20,#FF6B35)" }}>
                {user?.name?.[0] ?? "U"}
              </div>
              <span className="text-xs sm:text-sm text-gray-300 hidden sm:block">{user?.name?.split(" ")[0] ?? "User"}</span>
            </div>
          </div>
        </header>

        {/* Content — extra bottom padding on mobile for bottom nav */}
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
        style={{ background: "rgba(10,10,15,0.92)", backdropFilter: "blur(24px) saturate(180%)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
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
                      style={{ background: `linear-gradient(90deg,${item.from},${item.to})`, boxShadow: `0 0 10px ${item.from}88` }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                    ${on ? "" : "bg-transparent"}`}
                    style={on ? { background: `linear-gradient(135deg,${item.from}22,${item.to}11)` } : {}}>
                    <Icon className="w-5 h-5 transition-colors duration-200"
                      style={{ color: on ? item.from : "#4B5563" }} />
                  </div>
                  <span className={`text-[10px] font-semibold mt-0.5 transition-colors duration-200
                    ${on ? "text-white" : "text-gray-600"}`}>
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
