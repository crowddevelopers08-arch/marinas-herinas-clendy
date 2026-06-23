import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#163030",
        "ink-soft": "#3d5656",
        teal: "#42c8c8",
        "teal-deep": "#126e6e",
        "teal-press": "#0d5252",
        coral: "#42c8c8",
        "coral-deep": "#42c8c8",
        mist: "#e3f9f9",
        "mist-deep": "#c5f2f2",
        paper: "#fbfaf6",
      },
      boxShadow: {
        card: "0 18px 50px -24px rgba(18, 110, 110, 0.45)",
        sm: "0 6px 22px -14px rgba(18, 110, 110, 0.5)",
      },
      borderRadius: {
        xl2: "22px",
      },
      fontFamily: {
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
} satisfies Config;
