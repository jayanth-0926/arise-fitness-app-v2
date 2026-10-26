import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#050B14",
          secondary: "#0A1424",
          card: "#101D31",
        },
        accent: {
          // Primary cyan (replaces old red everywhere)
          red: "#06B6D4",
          hover: "#22D3EE",
          // Named aliases for clarity in new code
          cyan: "#06B6D4",
          "cyan-light": "#22D3EE",
          highlight: "#67E8F9",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
        },
        border: {
          DEFAULT: "#1E334D",
        },
        // Category accent colors (used only for icons / badges / borders)
        cat: {
          strength: "#E50914",
          conditioning: "#F97316",
          cardio: "#3B82F6",
          flexibility: "#8B5CF6",
          core: "#F59E0B",
          arms: "#DC143C",
          calisthenics: "#22C55E",
          hybrid: "#E5E7EB",
        },
        // Semantic
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        display: ["var(--font-anton)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "check-bounce": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.5s ease forwards",
        "scale-in": "scale-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "check-bounce": "check-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.25)",
        "glow-sm": "0 0 10px rgba(6, 182, 212, 0.15)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
