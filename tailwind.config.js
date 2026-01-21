/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sarabun', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        freshket: {
          green: '#00ce7c',
          orange: '#F37021',
          bg: '#f8fafc',
        }
      }
    },
  },
  plugins: [],
}