/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // include root index.html
    "./src/**/*.{js,jsx,ts,tsx}", // include all React files
  ],
  theme: {
    extend: {},
  },
  darkMode: "class", // Enables class-based dark mode toggle
  plugins: [],
};
