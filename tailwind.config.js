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
          bg: '#0B0D14',
          bgSecondary: '#07080D',
          surface: '#11141C',
          elevated: '#1A1E28',
          border: '#262B38',
          purple: '#9275FF',
          purpleHover: '#8263F2',
          purpleActive: '#7252E3',
          lime: '#A8D664',
          limeHover: '#9AC956',
          limeActive: '#8BBB49',
          coral: '#E85D75',
          coralHover: '#D94B64',
          coralActive: '#C73C54',
          cyan: '#5EB1C2',
          yellow: '#E0B45C',
          text: '#EEF0F5',
          secondary: '#A3A9B8',
          muted: '#7A8296',
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
