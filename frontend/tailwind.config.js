/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          950: '#0a0b0f',
          900: '#121318',
          800: '#1f2028',
          700: '#2e3039',
          600: '#4b4c58',
          500: '#696a77',
          400: '#888996',
          300: '#a7a8b5',
          200: '#c6c7d4',
          100: '#e5e6f3',
        },
      },
    },
  },
  plugins: [],
};