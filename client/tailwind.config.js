/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        learn: {
          bg: '#F1F0E9',
          black: '#101014',
          purple: '#A77AF5',
          red: '#F34D43',
          blue: '#48B7EC',
          green: '#35D68B',
          pink: '#F27CB5',
          yellow: '#FFD21C',
          white: '#FFFFFF',
          card: '#FFFFFF',
          border: '#101014',
          gray: '#E6E5DE',
          muted: '#68676E'
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #101014',
        'neo-sm': '2px 2px 0px 0px #101014',
        'neo-lg': '6px 6px 0px 0px #101014',
        'neo-xl': '8px 8px 0px 0px #101014',
        'neo-yellow': '4px 4px 0px 0px #FFD21C',
        'neo-purple': '4px 4px 0px 0px #A77AF5',
        'neo-green': '4px 4px 0px 0px #35D68B',
        'neo-red': '4px 4px 0px 0px #F34D43',
      }
    },
  },
  plugins: [],
}
