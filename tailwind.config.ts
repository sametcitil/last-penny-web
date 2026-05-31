import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0D",
        primary: "#B22222",
        secondary: "#F5F1E8",
        muted: "#A1A1A1",
      },
    },
  },
  plugins: [],
} satisfies Config;