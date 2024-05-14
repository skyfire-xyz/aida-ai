import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  plugins: [flowbite.plugin()],
  theme: {
    fontSize: {
      sm: "12px",
      lg: "14px",
      xl: "16px",
      "2xl": "18px",
      "3xl": "20px",
      "4xl": "24px",
      "5xl": "32px",
    },
  },
};
export default config;
