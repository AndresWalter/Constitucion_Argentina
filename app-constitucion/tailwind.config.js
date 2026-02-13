/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'legal-blue': {
          DEFAULT: '#181B2E',
          dark: '#121422',
          light: '#232840'
        },
        'legal-gold': {
          DEFAULT: '#C59D71',
          light: '#D6B48D',
          dark: '#A8835D'
        },
        'legal-gray': {
          DEFAULT: '#F5F6F8',
          text: '#2D3436',
          muted: '#9DA5B4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        'card': '0px 4px 20px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        'pill': '50px',
      }
    },
  },
  plugins: [],
}
