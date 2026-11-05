/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /* New GYMVERSE design system */
        gym: {
          bg:        '#0E1012',
          card:      '#141618',
          hover:     '#1A1D20',
          lime:      '#C8F36A',
          'lime-muted': '#B8E36B',
          olive:     '#566B39',
          border:    'rgba(255,255,255,0.08)',
          'border-accent': 'rgba(200,243,106,0.25)',
        },
        text: {
          primary:   '#F2F0EA',
          secondary: '#9A9B95',
          tertiary:  '#5C5E58',
        },
        /* legacy aliases kept for compatibility */
        neon: { red: '#C8F36A', orange: '#B8E36B' },
      },

      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },

      backgroundSize: {
        '200%': '200%',
        '300%': '300%',
      },

      animation: {
        'float':        'float 7s ease-in-out infinite',
        'float-slow':   'float 10s ease-in-out infinite',
        'float-fast':   'float 4s ease-in-out infinite',
        'pulse-glow':   'pulse-glow 2.4s ease-in-out infinite',
        'shimmer':      'shimmer 2.4s linear infinite',
        'spin-slow':    'spin 12s linear infinite',
        'fade-up':      'fade-up 0.55s ease forwards',
        'slide-up':     'slide-up 0.55s ease forwards',
        'gradient-x':   'gradient-x 4s ease infinite',
        'blob':         'blob-drift 10s ease-in-out infinite',
        'blob-slow':    'blob-drift 14s ease-in-out infinite',
      },

      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 20px rgba(200,243,106,0.2)' },
          '50%':     { boxShadow: '0 0 48px rgba(200,243,106,0.55)' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-x': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        'blob-drift': {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%':     { transform: 'translate(30px,-20px) scale(1.08)' },
          '66%':     { transform: 'translate(-20px,15px) scale(0.96)' },
        },
      },

      boxShadow: {
        'lime':    '0 0 24px rgba(200,243,106,0.35), 0 0 60px rgba(200,243,106,0.12)',
        'lime-sm': '0 0 12px rgba(200,243,106,0.3)',
        'card':    '0 4px 24px rgba(0,0,0,0.5)',
        'card-lg': '0 8px 48px rgba(0,0,0,0.6)',
      },

      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
};
