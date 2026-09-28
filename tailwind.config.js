/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        magenta: {
          50: "#fdf2fa",
          100: "#fbe6f6",
          400: "#e84fc0",
          500: "#d6249f",
          600: "#b81788",
        },
        violet: {
          50: "#f6f3fe",
          400: "#9b6bf0",
          500: "#7c3aed",
          600: "#6526d9",
          700: "#531fb3",
        },
        sky: {
          50: "#eef9ff",
          400: "#36b6f1",
          500: "#13a0e8",
          600: "#0c84c4",
        },
        gold: {
          200: "#fbf0a8",
          300: "#f7e16f",
          400: "#f2d23f",
          500: "#e0b820",
        },
        ink: {
          50: "#f7f7fb",
          100: "#eeeef5",
          200: "#dadae6",
          400: "#8b8aa3",
          600: "#54526b",
          800: "#2c2a42",
          900: "#1a1830",
        },
      },
      fontFamily: {
        display: ["'Baloo 2'", "system-ui", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "connect-gradient":
          "linear-gradient(135deg, #d6249f 0%, #9b3ce8 35%, #6c3ce8 55%, #1ea7e8 100%)",
        "connect-gradient-soft":
          "linear-gradient(135deg, #fdf2fa 0%, #f6f3fe 50%, #eef9ff 100%)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,24,48,0.04), 0 8px 24px -8px rgba(108,60,232,0.18)",
        pop: "0 12px 32px -8px rgba(108,60,232,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
