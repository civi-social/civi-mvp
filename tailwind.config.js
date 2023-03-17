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
      },
    },
  },
  plugins: [require("daisyui")],
};
