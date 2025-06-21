/**
 * CSS to Tailwind Converter
 * 
 * This script helps convert common CSS patterns to Tailwind classes.
 * Use it as a reference during the migration process.
 */

// Common CSS to Tailwind mappings
const cssToTailwindMap = {
  // Display & Layout
  'display: flex;': 'flex',
  'display: grid;': 'grid',
  'display: block;': 'block',
  'display: inline;': 'inline',
  'display: inline-block;': 'inline-block',
  'display: none;': 'hidden',
  
  // Flex & Grid
  'flex-direction: row;': 'flex-row',
  'flex-direction: column;': 'flex-col',
  'justify-content: center;': 'justify-center',
  'justify-content: flex-start;': 'justify-start',
  'justify-content: flex-end;': 'justify-end',
  'justify-content: space-between;': 'justify-between',
  'align-items: center;': 'items-center',
  'align-items: flex-start;': 'items-start',
  'align-items: flex-end;': 'items-end',
  
  // Spacing
  'margin: 0;': 'm-0',
  'margin: 4px;': 'm-1',
  'margin: 8px;': 'm-2',
  'margin: 12px;': 'm-3',
  'margin: 16px;': 'm-4',
  'margin: 20px;': 'm-5',
  'padding: 0;': 'p-0',
  'padding: 4px;': 'p-1',
  'padding: 8px;': 'p-2',
  'padding: 12px;': 'p-3',
  'padding: 16px;': 'p-4',
  'padding: 20px;': 'p-5',
  
  // Typography
  'font-weight: bold;': 'font-bold',
  'font-weight: normal;': 'font-normal',
  'text-align: center;': 'text-center',
  'text-align: left;': 'text-left',
  'text-align: right;': 'text-right',
  
  // Colors
  'color: white;': 'text-white',
  'color: black;': 'text-black',
  'background-color: white;': 'bg-white',
  'background-color: black;': 'bg-black',
  
  // Borders
  'border-radius: 4px;': 'rounded',
  'border-radius: 9999px;': 'rounded-full',
  'border: 1px solid black;': 'border border-black',
  'border: none;': 'border-0',
  
  // Width & Height
  'width: 100%;': 'w-full',
  'height: 100%;': 'h-full',
  'width: auto;': 'w-auto',
  'height: auto;': 'h-auto',
  
  // Positioning
  'position: relative;': 'relative',
  'position: absolute;': 'absolute',
  'position: fixed;': 'fixed',
  'position: sticky;': 'sticky',
};

// Function to convert CSS string to Tailwind classes
function convertCssToTailwind(cssString) {
  let tailwindClasses = [];
  
  // Remove whitespace and split by semicolons
  const cssRules = cssString
    .replace(/\s+/g, ' ')
    .split(';')
    .filter(rule => rule.trim() !== '');
  
  cssRules.forEach(rule => {
    rule = rule.trim() + ';';
    
    // Check if the rule matches any in our map
    if (cssToTailwindMap[rule]) {
      tailwindClasses.push(cssToTailwindMap[rule]);
    } else {
      // Handle special cases or complex properties
      if (rule.includes('padding:') || rule.includes('margin:')) {
        handleSpacingRule(rule, tailwindClasses);
      } else if (rule.includes('font-size:')) {
        handleFontSizeRule(rule, tailwindClasses);
      } else if (rule.includes('color:') || rule.includes('background-color:')) {
        handleColorRule(rule, tailwindClasses);
      }
    }
  });
  
  return tailwindClasses.join(' ');
}

// Examples of how to use this script:

// Example 1: Convert a simple CSS string
const cssExample = `
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  margin-top: 10px;
`;

// Example 2: Converting an inline style object
const inlineStyleExample = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
  marginTop: '10px',
};

// The converted classes would be:
// "flex flex-col items-center p-5 bg-white rounded mt-2.5"

// For more complex conversions, use a specialized converter tool
console.log('Refer to CSS_STANDARDIZATION.md for our styling guidelines');
