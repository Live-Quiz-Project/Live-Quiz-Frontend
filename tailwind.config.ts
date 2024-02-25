/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      current: "currentColor",
      transparent: "transparent",
      scarlet: "#FF2E00",
      sienna: "#F27F60",
      koromiko: "#FFBB60",
      karry: "#ffe6d0",
      "egg-sour": "#FFF2DD",
      apple: "#63A54B",
      denim: "#1068bb",
      "jordy-blue": "#7CBDF5",
      quartz: "#cfe2f2",
      "regent-gray": "#919EA8",
      "quill-gray": "#E3E3E0",
      beige: "#faf7ee",
      white: "#FFF",
      dune: "#322F2D",
      black: "#000",
    },
    fontFamily: {
      serif: ["Young Serif", "IBM Plex Sans Thai Looped", "serif"],
      "sans-serif": ["Gabarito", "IBM Plex Sans Thai Looped", "sans-serif"],
      mono: ["Courier New", "monospace"],
    },
    extend: {
      screens: {
        "2xs": "280px",
        xs: "375px",
      },
      fontSize: {
        "2xs": "0.625rem",
      },
      zIndex: {
        "-1": "-1",
        1: "1",
      },
      height: {
        dscreen: ["100vh", "100dvh"],
      },
    },
  },
  plugins: [],
};
