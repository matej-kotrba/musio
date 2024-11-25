/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  safelist: ["dark"],
  theme: {
    container: {
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        foreground: {
          DEFAULT: "hsl(var(--foreground) / <alpha-value>)",
          dark: "hsl(var(--foreground-dark) / <alpha-value>)",
        },
        background: {
          DEAFULT: "hsl(var(--background) / <alpha-value>)",
          accent: "hsl(var(--background-accent) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          accent: "hsl(var(--primary-accent) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
