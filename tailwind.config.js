/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#04C4D5',
      },
      fontFamily: {
        'happy-monkey': ['"Happy Monkey"', 'cursive'],
        'righteous': ['Righteous', 'cursive'],
        'luckiest-guy': ['"Luckiest Guy"', 'cursive'],
      },
      scrollBehavior: {
        'smooth': 'smooth',
        'auto': 'auto',
        'initial': 'initial',
        'inherit': 'inherit',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}
