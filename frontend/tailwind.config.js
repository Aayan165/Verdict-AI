/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F1DE',
        surface: '#B0BA99',
        ink: '#23150F',
        primary: '#4E220F',
        muted: '#7A6A57',
        border: '#D8CDAF',
        success: '#4F6A38',
        danger: '#A54A3A',
        warning: '#A9792E',
        info: '#355C7D',
      },
      boxShadow: {
        soft: '0 24px 70px rgba(78, 34, 15, 0.10)',
        subtle: '0 10px 30px rgba(78, 34, 15, 0.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        spinSlow: 'spinSlow 14s linear infinite',
        fadeUp: 'fadeUp 0.45s ease-out both',
      },
    },
  },
  plugins: [],
};