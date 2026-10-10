/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        titan: {
          bg: '#0a0f1d',
          surface: '#111827',
          card: '#162033',
          border: '#1f293d',
          accent: '#14b8a6', // Teal 500
          accentHover: '#0d9488',
          glow: 'rgba(20, 184, 166, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
