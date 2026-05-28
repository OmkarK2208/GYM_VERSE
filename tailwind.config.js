/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        neon: { red: '#FF2D20', orange: '#FF6B35' },
        gym: { dark: '#050508', card: '#0A0A0F', border: '#1a1a2e' },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'fade-up': 'fade-up 0.5s ease forwards',
        'gradient-x': 'gradient-x 4s ease infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'glow-pulse': {
          '0%,100%': { boxShadow: '0 0 20px rgba(255,45,32,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255,45,32,0.7)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-x': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: { '200%': '200%' },
    },
  },
  plugins: [],
};
