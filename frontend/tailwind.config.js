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
        primary: "#3b82f6",
        'primary-light': "#60a5fa",
        'primary-main': "#3b82f6",
        'primary-dark': "#1e40af"
      },
      spacing: {
        '8px': '8px',
      }
    },
  },
  plugins: [],
}
