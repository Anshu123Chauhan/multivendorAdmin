/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg, #FADD93 0%, #C8A564 54.17%, #F7DA90 100%)',
      },
    },
  },
  plugins: [],
}