/**
 * DesignTokens.ts
 * A central location for design tokens that can be used throughout the application
 * This helps maintain consistency and makes it easier to update the design system
 */

// Color Palette
export const colors = {
  // Primary brand colors
  primary: {
    light: '#04C4D5',  // Light blue - primary brand color
    main: '#148BAF',   // Main blue - primary action color
    dark: '#0e6883',   // Dark blue - hover states
    contrast: '#FFFFFF' // Text color on primary backgrounds
  },
  // Secondary brand colors  
  secondary: {
    light: '#FFE066', // Light yellow
    main: '#FCDF4D',  // Main yellow - active states
    dark: '#e6c832',  // Dark yellow - hover states
    contrast: '#000000' // Text color on secondary backgrounds
  },
  // Neutrals
  neutral: {
    white: '#FFFFFF',
    lightestGray: '#F7FFFF',
    lightGray: '#EDFEFF',
    mediumGray: '#E0E0E0',
    darkGray: '#666666',
    charcoal: '#444444',
    black: '#111111',
  },
  // Feedback colors
  feedback: {
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3'
  },
  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#F7FFFF',
    subtle: '#EDFEFF',
    highlight: '#FAF8EC'
  },
  // Text colors
  text: {
    primary: '#111111',
    secondary: '#666666',
    disabled: '#999999',
    hint: '#AAAAAA'
  }
};

// Typography
export const typography = {
  fontFamily: {
    primary: '"Happy Monkey", sans-serif',
    secondary: '"Righteous", cursive',
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2
  }
};

// Spacing
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
  40: '10rem',   // 160px
  48: '12rem',   // 192px
  56: '14rem',   // 224px
  64: '16rem',   // 256px
  72: '18rem',   // 288px
  80: '20rem',   // 320px
};

// Breakpoints
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px'     // Circle
};

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(73, 218, 234, 0.1)',
  DEFAULT: '0 1px 3px rgba(73, 218, 234, 0.2), 0 1px 2px rgba(73, 218, 234, 0.1)',
  md: '0 4px 6px rgba(73, 218, 234, 0.2), 0 2px 4px rgba(73, 218, 234, 0.1)',
  lg: '0 10px 15px -3px rgba(73, 218, 234, 0.2), 0 4px 6px -2px rgba(73, 218, 234, 0.1)',
  xl: '0 20px 25px -5px rgba(73, 218, 234, 0.2), 0 10px 10px -5px rgba(73, 218, 234, 0.1)',
  '2xl': '0 25px 50px -12px rgba(73, 218, 234, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(73, 218, 234, 0.1)'
};

// Z-index values
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  raised: 1,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  drawer: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
  overlay: 90,
  highest: 100
};

// Animation
export const animation = {
  durations: {
    fastest: '100ms',
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    slowest: '700ms'
  },
  easings: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  }
};

// Export all tokens as a single object
export const tokens = {
  colors,
  typography,
  spacing,
  breakpoints,
  borderRadius,
  shadows,
  zIndex,
  animation
};

export default tokens;
