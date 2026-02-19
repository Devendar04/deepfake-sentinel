/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse 3s infinite",
        scan: "scan 1.5s linear infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-pulse": "fadePulse 3s ease-out infinite",
      },

      keyframes: {
        scan: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },

        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadePulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
