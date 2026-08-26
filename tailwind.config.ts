import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        "batik-gold": "#D4A574",
        "nusantara-red": "#C65D3E",
        "deep-indigo": "#2C3E50",
        "warm-cream": "#F5EBDD",
        
        // Secondary Colors (per Pulau)
        "candi-stone": "#8B6F47",
        "terapung-blue": "#2E86AB",
        "rimba-green": "#4A7C59",
        "harmoni-magenta": "#A23B72",
        "aksara-gold": "#E8A838",
        
        // Semantic Colors
        success: "#52B788",
        warning: "#F4A261",
        error: "#E63946",
        info: "#457B9D",
      },
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        caveat: ["Caveat", "cursive"],
        outfit: ["var(--font-outfit)", "sans-serif"],
        manrope: ["var(--font-manrope)", "sans-serif"],
      },
      fontSize: {
        "h1": ["56px", { lineHeight: "1.2", fontWeight: "700" }],
        "h2": ["40px", { lineHeight: "1.3", fontWeight: "600" }],
        "h3": ["28px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["20px", { lineHeight: "1.6", fontWeight: "400" }],
        "body": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "caption": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      borderRadius: {
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
      },
      boxShadow: {
        "soft": "0 4px 20px rgba(44, 62, 80, 0.08)",
        "medium": "0 8px 30px rgba(44, 62, 80, 0.12)",
        "hard": "0 12px 40px rgba(44, 62, 80, 0.16)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;