const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Public Sans", ...defaultTheme.fontFamily.sans],
        serif: ["Bitter", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        indigo: {
          500: "#416cbb",
        },
        primary: {
          200: "#E7DDED",
          600: "#4B2163",
        },
        secondary: {
          200: "#C5EDD8",
          // 400: "#82AB95",
          400: "#6B8D72",
        },
        neutral: {
          200: "#F0DCB8",
        }
      },
    },
  },
  plugins: [require("daisyui")],
};
