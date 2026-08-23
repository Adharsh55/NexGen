/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#09090b',
        'bg-panel': '#0f1117',
        'bg-surface': '#141720',
        'bg-hover': '#1a1f2e',
        'border-subtle': '#1e2330',
        'border-default': '#252b3a',
        'text-primary': '#e2e8f0',
        'text-secondary': '#94a3b8',
        'text-muted': '#475569',
        'sentinel-green': '#22c55e',
        'sentinel-orange': '#f97316',
        'sentinel-red': '#ef4444',
        'sentinel-accent': '#38bdf8',
        'sentinel-yellow': '#eab308',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.15)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.15)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.15)',
        'glow-accent': '0 0 20px rgba(56, 189, 248, 0.1)',
        'panel': '0 1px 3px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      }
    },
  },
  plugins: [],
}
