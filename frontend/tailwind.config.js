/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7f0',
          100: '#d4edd8',
          200: '#a9d9b1',
          300: '#74bf82',
          400: '#44a058',
          500: '#2d8a42',
          600: '#1f6e31',
          700: '#175526',
          800: '#12431e',
          900: '#0d3317',
        },
        harvest: {
          50: '#fdf8ec',
          100: '#faeec9',
          200: '#f4d98f',
          300: '#edbe4d',
          400: '#e5a020',
          500: '#c47f10',
          600: '#9a600b',
          700: '#724510',
          800: '#5c3813',
          900: '#4d2f13',
        }
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      }
    }
  },
  plugins: []
}
