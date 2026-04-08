/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This ensures Tailwind looks inside ALL subfolders in src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}