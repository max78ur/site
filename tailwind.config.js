module.exports = {
  darkMode: ["class"],
  content: [
    "index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        truckaxic: {
          red: "#b91c1c",
          "red-dark": "#7f1d1d",
          "red-light": "#fca5a5",
        },
        black: {
          "#020202": true,
          "800": "#0a0a0a",
          "600": "#171717",
        },
        gray: {
          "50": "#fafafa",
          "100": "#f5f5f5",
          "200": "#e5e5e5",
          "800": "#262626",
          "900": "#171717",
        },
        white: "#ffffff",
      },
    },
  },
  plugins: [],
}
