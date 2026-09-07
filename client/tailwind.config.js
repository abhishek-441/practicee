/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#0F2A1F",
          900: "#14361F",
          800: "#1B4332",
          700: "#255C41",
          600: "#2D6A4F",
          500: "#3B8562"
        },
        moss: {
          100: "#EAF6ED",
          200: "#D8F3DC",
          300: "#BCE8C6"
        },
        paper: "#FBFDFB",
        ink: "#132018"
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
