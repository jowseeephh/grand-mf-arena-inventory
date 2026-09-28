import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 900: "#0F1B2D", 800: "#16263D", 700: "#1F3450" },
        arena: { 500: "#E4572E", 600: "#C9451F" },
      },
    },
  },
  plugins: [],
} satisfies Config;
