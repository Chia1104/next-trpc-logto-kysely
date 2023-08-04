import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          DEFAULT: "#9200ff",
          light: "#b200ff",
          dark: "#6e00cc",
          transparent: "rgba(146,0,255,0.75)",
        },
        secondary: {
          DEFAULT: "#007aff",
          light: "#339cff",
          dark: "#0062cc",
          transparent: "rgba(0,122,255,0.75)",
        },
        success: {
          DEFAULT: "#4caf50",
          light: "#80e27e",
          dark: "#087f23",
          transparent: "rgba(76,175,80,0.75)",
        },
        info: {
          DEFAULT: "#2196f3",
          light: "#6ec6ff",
          dark: "#0069c0",
          transparent: "rgba(33,150,243,0.75)",
        },
        warning: {
          DEFAULT: "#ff9800",
          light: "#ffc947",
          dark: "#c66900",
          transparent: "rgba(255,152,0,0.75)",
        },
        danger: {
          DEFAULT: "#f44336",
          light: "#ff7961",
          dark: "#ba000d",
          transparent: "rgba(244,67,54,0.75)",
        },
        light: {
          DEFAULT: "#fafafa",
          light: "#ffffff",
          dark: "#c7c7c7",
          transparent: "rgba(250,250,250,0.75)",
        },
        dark: {
          DEFAULT: "#212121",
          light: "#484848",
          dark: "#000000",
          transparent: "rgba(33,33,33,0.75)",
        },
      },
    },
  },
  plugins: [],
  // darkMode: "class",
} satisfies Config;
