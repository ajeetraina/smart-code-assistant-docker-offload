/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'docker-blue': '#0db7ed',
        'docker-dark': '#384d54'
      },
      fontFamily: {
        'code': ['Consolas', 'Monaco', 'Courier New', 'monospace']
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}