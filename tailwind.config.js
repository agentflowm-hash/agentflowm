/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode
        'bg': 'var(--color-bg)',
        'surface': 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        'text': 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-subtle': 'var(--color-text-subtle)',
        'border': 'var(--color-border)',
        'accent': 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent2': 'var(--color-accent2)',
        'accent3': 'var(--color-accent3)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'hero': 'clamp(32px, 4.5vw, 52px)',
        'h1': 'clamp(28px, 3.8vw, 42px)',
        'h2': 'clamp(20px, 2.5vw, 32px)',
        'h3': 'clamp(16px, 2vw, 20px)',
      },
      borderRadius: {
        'card': '18px',
        'button': '14px',
        'input': '12px',
        'pill': '999px',
      },
      boxShadow: {
        'glow': '0 0 20px var(--color-glow)',
        'glow-strong': '0 0 30px var(--color-glow-strong)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'fade-slide-up': 'fadeSlideUp 0.4s ease forwards',
        'pop-in': 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
