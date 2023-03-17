module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        indigo: {
          500: "#416cbb",
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
