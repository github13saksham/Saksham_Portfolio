export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      geist: ['Geist', 'sans-serif'],
      nura: ['"Clash Display"', 'sans-serif'],
    },
    extend: {
      colors: {
        background: "#0A0A0A",
        primary: {
          light: "#ff4d4d",
          main: "#e60000",
          dark: "#990000"
        }
      },
      spacing: {
        '8px': '8px',
      }
    },
  },
  plugins: [],
}
