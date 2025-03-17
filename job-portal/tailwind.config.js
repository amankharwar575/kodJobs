/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'navy-900': '#1e2a53',
        'green-600': '#059669',
        'green-700': '#047857',
      },
      backgroundColor: {
        dark: '#121212',
        'dark-card': '#1E1E1E',
      },
      textColor: {
        'dark-primary': '#FFFFFF',
        'dark-secondary': '#A0AEC0',
      },
    },
  },
  plugins: [],
}