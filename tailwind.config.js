/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': { max: "699px" },
        'mdl': { min: "700px", max: "1000px" },
        '3xl': '1600px', 
      },
    },
  },
  plugins: [],
}

