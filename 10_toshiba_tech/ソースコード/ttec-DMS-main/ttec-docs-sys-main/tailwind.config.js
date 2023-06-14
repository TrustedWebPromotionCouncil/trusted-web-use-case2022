/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        "rotate-center": "rotate-center 1.5s linear  infinite both"
      },
      keyframes: {
        "rotate-center": {
          "0%": {
            transform: "rotate(0)"
          },
          to: {
            transform: "rotate(360deg)"
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
