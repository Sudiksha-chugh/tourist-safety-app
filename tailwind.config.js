/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#F6F8FB",       // cool near-white background — calm, trustworthy
        surface: "#FFFFFF",     // cards
        border: "#E2E8F0",
        ink: "#14213D",         // deep navy text — same "safety" mood as the dashboard's navy
        muted: "#64748B",
        brand: "#0D9488",       // teal — trust, verified, "you're safe" state
        amber: "#F5A524",       // warnings — same token as the dashboard, brand consistency
        critical: "#E5484D",    // SOS — same token as the dashboard
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,33,61,0.04), 0 8px 24px -8px rgba(20,33,61,0.12)",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
      },
      animation: {
        "pulse-ring": "pulseRing 1.6s cubic-bezier(0.2,0.8,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};
