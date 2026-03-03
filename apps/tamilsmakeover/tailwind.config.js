/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        serif: ['var(--font-playfair-display)', 'serif'],
      },
      colors: {
        'brand-plum': '#6B2D8B',
        'brand-blush': '#F8C8D4',
        'bg-soft': '#FDF6FF',
      }
    },
  },
  plugins: [],
}