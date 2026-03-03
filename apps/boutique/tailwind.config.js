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
        'brand-rose': '#C0436A',
        'brand-gold': '#C9922A',
        'brand-ivory': '#FAF7F0',
      }
    },
  },
  plugins: [],
}