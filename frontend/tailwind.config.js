/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3f51b5',
          light: '#757de8',
          dark: '#002984',
        },
        secondary: {
          DEFAULT: '#f50057',
          light: '#ff5983',
          dark: '#bb002f',
        },
        background: {
          DEFAULT: '#f5f5f5',
          paper: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 