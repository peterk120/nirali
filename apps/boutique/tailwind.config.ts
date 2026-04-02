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
        'brand-rose': {
          50: 'var(--brand-rose-light, #FFF5F7)',
          100: 'var(--brand-rose-light, #FFE8ED)',
          500: 'var(--brand-rose, #C0436A)',
          600: 'var(--brand-rose-dark, #A83860)',
          700: 'var(--brand-rose-dark, #8F2D52)',
        },
        'brand-gold': {
          50: 'var(--gold-light, #FDF8ED)',
          100: 'var(--gold-light, #FBF1D5)',
          500: 'var(--gold, #C9922A)',
          600: 'var(--gold, #B07E22)',
          700: 'var(--gold, #986B1A)',
        },
        'brand-ivory': {
          DEFAULT: '#FAF7F0',
          dark: '#F5F0E4',
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