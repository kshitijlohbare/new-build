/**
 * TokensToCSS.ts
 * Utility to convert design tokens to CSS variables
 */

import tokens from '@/styles/DesignTokens';

// Function to flatten nested objects into CSS variable format
function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
  return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
    const prefixedKey = prefix ? `${prefix}-${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], prefixedKey));
    } else {
      acc[`--${prefixedKey}`] = obj[key].toString();
    }
    
    return acc;
  }, {});
}

// Generate CSS variables from tokens
export function generateCSSVariables(): string {
  const flatTokens = flattenObject(tokens);
  
  let cssVars = ":root {\n";
  
  // Add each variable
  Object.entries(flatTokens).forEach(([key, value]) => {
    cssVars += `  ${key}: ${value};\n`;
  });
  
  cssVars += "}\n";
  return cssVars;
}

// Generate a CSS file with all variables
export function generateCSSFile(): string {
  return `/**
 * Generated CSS Variables from Design Tokens
 * DO NOT EDIT DIRECTLY - Edit the source tokens in DesignTokens.ts instead
 */

${generateCSSVariables()}

/* Media query variables */
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode overrides would go here */
    --color-background-default: ${tokens.colors.neutral.black};
    --color-text-primary: ${tokens.colors.neutral.white};
  }
}

/* Responsive breakpoint variables */
@media (min-width: ${tokens.breakpoints.sm}) {
  :root {
    /* Small screen specific variables */
  }
}

@media (min-width: ${tokens.breakpoints.md}) {
  :root {
    /* Medium screen specific variables */
  }
}

@media (min-width: ${tokens.breakpoints.lg}) {
  :root {
    /* Large screen specific variables */
  }
}

@media (min-width: ${tokens.breakpoints.xl}) {
  :root {
    /* Extra large screen specific variables */
  }
}
`;
}

// Usage example:
// import fs from 'fs';
// fs.writeFileSync('src/styles/variables.css', generateCSSFile());

export default {
  generateCSSVariables,
  generateCSSFile
};
