import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "404 - Coordinate Not Found | GYMVERSE",
  description: "The requested training coordinate does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070809] text-[#F5F4EE] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-[#C8F36A] text-[#070809] flex items-center justify-center font-black text-2xl mb-6 shadow-[0_0_30px_rgba(200,243,106,0.4)]">
          GV
        </div>
        <div className="text-xs font-mono uppercase tracking-[3px] text-[#C8F36A] font-bold mb-2">
          ERROR 404 • UNMATCHED VECTOR
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Out of Gymverse Bounds
        </h1>
        <p className="max-w-md text-stone-400 text-sm mb-8">
          The requested coordinate does not exist in the active 3D fitness universe.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-6 py-3.5 rounded-xl bg-[#C8F36A] text-[#070809] font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(200,243,106,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          Return to Command Center →
        </Link>
      </body>
    </html>
  );
}
