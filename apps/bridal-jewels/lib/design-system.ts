// Bridal Jewels Design System
// Brand Colors
export const BRAND_COLORS = {
  // Primary Colors
  gold: '#B8860B',        // Brand Gold
  maroon: '#800020',      // Brand Maroon  
  cream: '#FFFDD0',       // Brand Cream
  darkMaroon: '#1A0F00',  // Dark Maroon (text/headers)
  
  // Neutrals
  white: '#FFFFFF',
  creamLight: '#FFFDF5',
  maroonDark: '#4A0010',
  
  // Status Colors
  success: '#2E8B57',
  warning: '#DAA520',
  error: '#DC143C',
  
  // UI Colors
  border: 'rgba(184,134,11,0.2)',
  borderDark: 'rgba(184,134,11,0.3)',
  borderLight: 'rgba(184,134,11,0.15)',
  shadow: 'rgba(184,134,11,0.1)',
} as const;

// Typography
export const TYPOGRAPHY = {
  // Font Families
  heading: 'Playfair Display, serif',
  body: 'DM Sans, sans-serif',
  accent: 'Poppins, sans-serif',
  
  // Font Sizes
  h1: '72px',
  h2: '48px',
  h3: '40px',
  h4: '32px',
  h5: '24px',
  h6: '20px',
  
  // Body Sizes
  large: '16px',
  base: '14px',
  small: '13px',
  tiny: '12px',
  micro: '11px',
  
  // Weights
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  
  // Letter Spacing
  tight: '-0.02em',
  normal: '0',
  wide: '0.05em',
  wider: '0.1em',
  widest: '0.2em',
} as const;

// Spacing Scale
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

// Border Radius
export const RADIUS = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const;

// Shadows
export const SHADOWS = {
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// Z-Index
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Animation
export const TRANSITIONS = {
  fast: '0.2s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
} as const;

// CSS Utility Classes
export const cssClasses = {
  // Text Colors
  textGold: `text-[${BRAND_COLORS.gold}]`,
  textMaroon: `text-[${BRAND_COLORS.maroon}]`,
  textDarkMaroon: `text-[${BRAND_COLORS.darkMaroon}]`,
  textCream: `text-[${BRAND_COLORS.cream}]`,
  textWhite: `text-[${BRAND_COLORS.white}]`,
  
  // Background Colors
  bgGold: `bg-[${BRAND_COLORS.gold}]`,
  bgMaroon: `bg-[${BRAND_COLORS.maroon}]`,
  bgCream: `bg-[${BRAND_COLORS.cream}]`,
  bgDarkMaroon: `bg-[${BRAND_COLORS.darkMaroon}]`,
  
  // Border Colors
  borderGold: `border-[${BRAND_COLORS.gold}]`,
  borderMaroon: `border-[${BRAND_COLORS.maroon}]`,
  borderCream: `border-[${BRAND_COLORS.cream}]`,
  
  // Typography Classes
  headingFont: `font-[${TYPOGRAPHY.heading}]`,
  bodyFont: `font-[${TYPOGRAPHY.body}]`,
  accentFont: `font-[${TYPOGRAPHY.accent}]`,
} as const;