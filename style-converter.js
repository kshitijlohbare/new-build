#!/usr/bin/env node

/**
 * Style Conversion Helper
 * 
 * This script helps convert common inline styles to Tailwind classes.
 * Run it with a CSS property and value to get the equivalent Tailwind class.
 * 
 * Usage:
 * node style-converter.js <property> <value>
 * 
 * Examples:
 * node style-converter.js padding 20px
 * node style-converter.js backgroundColor #f5f5f5
 */

import colors from 'tailwindcss/colors.js';

// Common CSS properties to Tailwind mappings
const mappings = {
  // Padding
  padding: (value) => mapSpacing('p', value),
  paddingTop: (value) => mapSpacing('pt', value),
  paddingRight: (value) => mapSpacing('pr', value),
  paddingBottom: (value) => mapSpacing('pb', value),
  paddingLeft: (value) => mapSpacing('pl', value),
  paddingInline: (value) => mapSpacing('px', value),
  paddingBlock: (value) => mapSpacing('py', value),
  
  // Margin
  margin: (value) => mapSpacing('m', value),
  marginTop: (value) => mapSpacing('mt', value),
  marginRight: (value) => mapSpacing('mr', value),
  marginBottom: (value) => mapSpacing('mb', value),
  marginLeft: (value) => mapSpacing('ml', value),
  marginInline: (value) => mapSpacing('mx', value),
  marginBlock: (value) => mapSpacing('my', value),
  
  // Width/Height
  width: (value) => mapSize('w', value),
  height: (value) => mapSize('h', value),
  maxWidth: (value) => mapSize('max-w', value),
  maxHeight: (value) => mapSize('max-h', value),
  minWidth: (value) => mapSize('min-w', value),
  minHeight: (value) => mapSize('min-h', value),
  
  // Display & Positioning
  display: (value) => value,
  position: (value) => value,
  top: (value) => mapSpacing('top', value),
  right: (value) => mapSpacing('right', value),
  bottom: (value) => mapSpacing('bottom', value),
  left: (value) => mapSpacing('left', value),
  
  // Flexbox
  flexDirection: (value) => value === 'row' ? 'flex-row' : value === 'column' ? 'flex-col' : `flex-${value}`,
  justifyContent: (value) => {
    const map = {
      'flex-start': 'start',
      'flex-end': 'end',
      'center': 'center',
      'space-between': 'between',
      'space-around': 'around',
      'space-evenly': 'evenly'
    };
    return `justify-${map[value] || value}`;
  },
  alignItems: (value) => {
    const map = {
      'flex-start': 'start',
      'flex-end': 'end',
      'center': 'center',
      'baseline': 'baseline',
      'stretch': 'stretch'
    };
    return `items-${map[value] || value}`;
  },
  flex: (value) => {
    if (value === '1') return 'flex-1';
    if (value === 'auto') return 'flex-auto';
    if (value === 'initial') return 'flex-initial';
    if (value === 'none') return 'flex-none';
    return `flex-${value}`;
  },
  flexWrap: (value) => value === 'wrap' ? 'flex-wrap' : value === 'nowrap' ? 'flex-nowrap' : 'flex-wrap-reverse',
  
  // Typography
  fontSize: (value) => {
    // Remove 'px' if present
    const size = parseInt(value);
    
    // Font size mapping
    if (size <= 12) return 'text-xs';
    if (size <= 14) return 'text-sm';
    if (size <= 16) return 'text-base';
    if (size <= 18) return 'text-lg';
    if (size <= 20) return 'text-xl';
    if (size <= 24) return 'text-2xl';
    if (size <= 30) return 'text-3xl';
    if (size <= 36) return 'text-4xl';
    if (size <= 48) return 'text-5xl';
    return 'text-6xl';
  },
  fontWeight: (value) => {
    const weight = parseInt(value);
    
    // Font weight mapping
    if (weight <= 300) return 'font-light';
    if (weight <= 400) return 'font-normal';
    if (weight <= 500) return 'font-medium';
    if (weight <= 600) return 'font-semibold';
    if (weight <= 700) return 'font-bold';
    if (weight <= 800) return 'font-extrabold';
    return 'font-black';
  },
  textAlign: (value) => `text-${value}`,
  lineHeight: (value) => {
    // Line height mapping
    if (value === '1') return 'leading-none';
    if (value <= '1.25') return 'leading-tight';
    if (value <= '1.5') return 'leading-normal';
    if (value <= '1.75') return 'leading-relaxed';
    if (value > '1.75') return 'leading-loose';
    return 'leading-normal';
  },
  
  // Colors
  color: (value) => mapColor('text', value),
  backgroundColor: (value) => mapColor('bg', value),
  borderColor: (value) => mapColor('border', value),
  
  // Borders
  borderWidth: (value) => {
    const width = parseInt(value);
    if (width === 0) return 'border-0';
    if (width === 1) return 'border';
    if (width === 2) return 'border-2';
    if (width === 4) return 'border-4';
    return 'border-8';
  },
  borderRadius: (value) => {
    const radius = parseInt(value);
    if (radius === 0) return 'rounded-none';
    if (radius <= 2) return 'rounded-sm';
    if (radius <= 4) return 'rounded';
    if (radius <= 8) return 'rounded-md';
    if (radius <= 12) return 'rounded-lg';
    if (radius <= 20) return 'rounded-xl';
    if (radius <= 24) return 'rounded-2xl';
    if (radius <= 32) return 'rounded-3xl';
    return 'rounded-full';
  },
  
  // Box Shadow
  boxShadow: (value) => {
    if (value === 'none') return 'shadow-none';
    if (value.includes('sm')) return 'shadow-sm';
    if (value.includes('lg')) return 'shadow-lg';
    if (value.includes('xl')) return 'shadow-xl';
    if (value.includes('2xl')) return 'shadow-2xl';
    return 'shadow';
  },
  
  // Z-Index
  zIndex: (value) => `z-${value}`,
  
  // Opacity
  opacity: (value) => {
    const opacity = parseFloat(value) * 100;
    return `opacity-${opacity}`;
  },
  
  // Transforms
  transform: (value) => {
    if (value === 'none') return 'transform-none';
    return 'transform';
  }
};

// Helper functions
function mapSpacing(prefix, value) {
  // Handle negative values
  const isNegative = value.startsWith('-');
  value = isNegative ? value.substring(1) : value;
  
  // Remove 'px' if present
  const numericValue = parseInt(value);
  
  // Standard spacing system
  if (numericValue === 0) return `${isNegative ? '-' : ''}${prefix}-0`;
  if (numericValue <= 1) return `${isNegative ? '-' : ''}${prefix}-px`;
  if (numericValue <= 2) return `${isNegative ? '-' : ''}${prefix}-0.5`;
  if (numericValue <= 4) return `${isNegative ? '-' : ''}${prefix}-1`;
  if (numericValue <= 6) return `${isNegative ? '-' : ''}${prefix}-1.5`;
  if (numericValue <= 8) return `${isNegative ? '-' : ''}${prefix}-2`;
  if (numericValue <= 10) return `${isNegative ? '-' : ''}${prefix}-2.5`;
  if (numericValue <= 12) return `${isNegative ? '-' : ''}${prefix}-3`;
  if (numericValue <= 14) return `${isNegative ? '-' : ''}${prefix}-3.5`;
  if (numericValue <= 16) return `${isNegative ? '-' : ''}${prefix}-4`;
  if (numericValue <= 20) return `${isNegative ? '-' : ''}${prefix}-5`;
  if (numericValue <= 24) return `${isNegative ? '-' : ''}${prefix}-6`;
  if (numericValue <= 28) return `${isNegative ? '-' : ''}${prefix}-7`;
  if (numericValue <= 32) return `${isNegative ? '-' : ''}${prefix}-8`;
  if (numericValue <= 36) return `${isNegative ? '-' : ''}${prefix}-9`;
  if (numericValue <= 40) return `${isNegative ? '-' : ''}${prefix}-10`;
  if (numericValue <= 44) return `${isNegative ? '-' : ''}${prefix}-11`;
  if (numericValue <= 48) return `${isNegative ? '-' : ''}${prefix}-12`;
  if (numericValue <= 56) return `${isNegative ? '-' : ''}${prefix}-14`;
  if (numericValue <= 64) return `${isNegative ? '-' : ''}${prefix}-16`;
  if (numericValue <= 80) return `${isNegative ? '-' : ''}${prefix}-20`;
  if (numericValue <= 96) return `${isNegative ? '-' : ''}${prefix}-24`;
  if (numericValue <= 112) return `${isNegative ? '-' : ''}${prefix}-28`;
  if (numericValue <= 128) return `${isNegative ? '-' : ''}${prefix}-32`;
  return `${isNegative ? '-' : ''}${prefix}-${numericValue}`;
}

function mapSize(prefix, value) {
  // Remove 'px' if present
  if (value.endsWith('px')) {
    const numericValue = parseInt(value);
    return `${prefix}-${numericValue}`;
  }
  
  // Handle percentages
  if (value.endsWith('%')) {
    const percent = parseInt(value);
    if (percent === 100) return `${prefix}-full`;
    if (percent === 75) return `${prefix}-3/4`;
    if (percent === 50) return `${prefix}-1/2`;
    if (percent === 25) return `${prefix}-1/4`;
    return `${prefix}-[${value}]`;
  }
  
  // Handle special values
  if (value === 'auto') return `${prefix}-auto`;
  if (value === 'fit-content') return `${prefix}-fit`;
  
  return `${prefix}-[${value}]`;
}

function mapColor(prefix, value) {
  // Handle hex colors
  if (value.startsWith('#')) {
    // Convert to lowercase and remove #
    const hex = value.toLowerCase().substring(1);
    
    // Try to find match in Tailwind color palette
    for (const [colorName, shades] of Object.entries(colors)) {
      if (typeof shades === 'object') {
        for (const [shade, colorValue] of Object.entries(shades)) {
          if (colorValue === value) {
            return `${prefix}-${colorName}-${shade}`;
          }
        }
      }
    }
    
    // If no match found, return custom color
    return `${prefix}-[${value}]`;
  }
  
  // Handle named colors
  if (value === 'transparent') return `${prefix}-transparent`;
  if (value === 'white') return `${prefix}-white`;
  if (value === 'black') return `${prefix}-black`;
  
  return `${prefix}-[${value}]`;
}

// Main function
function convertStyleToTailwind(property, value) {
  if (mappings[property]) {
    return mappings[property](value);
  }
  
  // If no mapping found
  return `unknown: ${property}=${value}`;
}

// CLI handler
const property = process.argv[2];
const value = process.argv[3];

if (property && value) {
  console.log(convertStyleToTailwind(property, value));
} else {
  console.log('Usage: node style-converter.js <property> <value>');
  console.log('Example: node style-converter.js padding 20px');
}
