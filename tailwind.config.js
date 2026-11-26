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
        chomu: {
          bg: '#070B12',
          bgSecondary: '#0B111C',
          surface: '#111824',
          elevated: '#182233',
          border: '#233044',
          teal: '#1CE8C6',
          tealHover: '#16CFB0',
          tealActive: '#12B59A',
          purple: '#1CE8C6',
          purpleHover: '#16CFB0',
          purpleActive: '#12B59A',
          lime: '#34D399',
          limeHover: '#2BBF88',
          limeActive: '#22A876',
          coral: '#FF5A5F',
          coralHover: '#F0484E',
          coralActive: '#DC3B41',
          cyan: '#38BDF8',
          yellow: '#F5C542',
          text: '#F5F7FA',
          secondary: '#9AA8BE',
          muted: '#6E7D96',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 180ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up': 'slideUp 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scale-in': 'scaleIn 220ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        shake: 'shake 320ms cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
        },
      },
    },
  },
  plugins: [],
}
