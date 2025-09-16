/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ enable class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",       // scan all pages
    "./components/**/*.{js,ts,jsx,tsx}",  // scan all components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
