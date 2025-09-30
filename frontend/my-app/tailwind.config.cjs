/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./*.html", // root-level HTML files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
