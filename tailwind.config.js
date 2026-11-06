/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070809',
          900: '#0B0D0F',
          850: '#101316',
          800: '#161A1E',
          700: '#22272E',
          600: '#2E353F',
        },
        lime: {
          DEFAULT: '#C8F36A',
          hover: '#D4F685',
          muted: '#8AA84B',
          glow: 'rgba(200, 243, 106, 0.35)',
        },
        olive: {
          DEFAULT: '#566B39',
          dark: '#3A4826',
        },
        stone: {
          50: '#F5F4EE',
          100: '#E6E5DC',
          200: '#C7C6BA',
          400: '#9CA3AF',
          600: '#64748B',
        },
        cyan: {
          gym: '#22D3EE',
          glow: 'rgba(34, 211, 238, 0.35)',
        },
        amber: {
          gold: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.35)',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer-fast': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
