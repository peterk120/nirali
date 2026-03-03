import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        ui: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        'brand-teal': {
          50: '#F0FAFA',
          100: '#E1F5F5',
          500: '#1A7A7A',
          600: '#156363',
          700: '#104C4C',
        },
        'brand-rose-gold': {
          50: '#FEF8F9',
          100: '#FCF1F3',
          500: '#B76E79',
          600: '#9E5C66',
          700: '#854A53',
        },
        'bg-white': {
          DEFAULT: '#FFFFFF',
        },
        'brand-dark': {
          DEFAULT: '#1A1A2E',
          light: '#2D2D4A',
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.35s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        luxury: '0 20px 60px rgba(0,0,0,0.12)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          md: '2rem',
          xl: '4rem',
        },
      },
      screens: {
        xs: '375px', // mobile-first base
      },
    },
  },
  plugins: [],
};

export default config;