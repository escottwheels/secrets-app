/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {},
        stone: {
          DEFAULT: "#464866",
          dark: "#464866",
          light: "#AAABB8",
        },
        cobalt: {
          light: "#2E9CCA",
          DEFAULT: "#2E9CCA",
          dark: "#29648A",
          midnight: "#25274D",
        },
        transparent: "transparent",
        current: "currentColor",
      },
    },
  },
  plugins: [],
};
