import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EE',
        sand: {
          50:  '#FAF7F2',
          100: '#EDE5D8',
          200: '#DDD0BC',
          300: '#C9B89A',
          400: '#B5A07E',
        },
        terra: {
          300: '#D99070',
          400: '#C0714A',
          500: '#A85A33',
          600: '#8B4422',
        },
        olive: {
          600: '#5C6650',
          700: '#4A5240',
          800: '#333B2B',
          900: '#1E2318',
        },
        warm: {
          gray: '#8C7B6B',
          muted: '#A89585',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'warm-xs': '0 1px 2px rgba(74, 58, 40, 0.08)',
        'warm-sm': '0 1px 4px rgba(74, 58, 40, 0.12)',
        'warm-md': '0 4px 12px rgba(74, 58, 40, 0.15)',
        'warm-lg': '0 8px 24px rgba(74, 58, 40, 0.18)',
        'warm-xl': '0 16px 40px rgba(74, 58, 40, 0.22)',
      },
      animation: {
        'fade-in':      'fadeIn 0.25s ease-out',
        'slide-up':     'slideUp 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-down':   'slideDown 0.25s ease-in forwards',
        'bounce-in':    'bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'check-pop':    'checkPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'toast-in':     'toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'toast-out':    'toastOut 0.2s ease-in forwards',
        'heart-pop':    'heartPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer':      'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        slideDown: { from: { transform: 'translateY(0)', opacity: '1' }, to: { transform: 'translateY(20px)', opacity: '0' } },
        bounceIn:  { from: { transform: 'scale(0.9)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
        checkPop:  { '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.3)' }, '100%': { transform: 'scale(1)' } },
        toastIn:   { from: { transform: 'translateY(12px) scale(0.95)', opacity: '0' }, to: { transform: 'translateY(0) scale(1)', opacity: '1' } },
        toastOut:  { from: { opacity: '1', transform: 'scale(1)' }, to: { opacity: '0', transform: 'scale(0.95) translateY(8px)' } },
        heartPop:  { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.4)' }, '100%': { transform: 'scale(1)' } },
        shimmer:   { '0%, 100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
      },
    },
  },
  plugins: [],
} satisfies Config
