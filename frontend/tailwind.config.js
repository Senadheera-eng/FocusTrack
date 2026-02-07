/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add custom colors/fonts later if needed
      colors: {
        primary: '#4F46E5', // indigo-600 example
      },
    },
  },
  plugins: [],
}