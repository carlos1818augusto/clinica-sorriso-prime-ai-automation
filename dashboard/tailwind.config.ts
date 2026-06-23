import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        mist: "#f5f7f8",
        teal: "#0f766e",
        coral: "#e76f51"
      },
      boxShadow: {
        soft: "0 12px 32px rgba(23, 32, 38, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
