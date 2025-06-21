#!/usr/bin/env node

/**
 * Style Consistency Checker
 * 
 * This script analyzes the codebase to identify files with mixed styling approaches:
 * - Tailwind classes
 * - Inline styles
 * - Imported CSS files
 * 
 * Usage:
 * node style-checker.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SRC_DIR = path.resolve(__dirname, 'src');
const REPORT_FILE = path.resolve(__dirname, 'style-consistency-report.md');
const FILE_PATTERNS = ['.tsx', '.jsx', '.js'];

// Patterns to check
const TAILWIND_PATTERN = /className="[^"]*(?:\b|-)(?:flex|grid|p-|m-|w-|h-|text-|bg-|border|rounded)[^"]*"/;
const INLINE_STYLE_PATTERN = /style={{.*?}}/;
const CSS_IMPORT_PATTERN = /import ['"].*\.css['"]/;

// Initialize output report
let report = `# Style Consistency Report
Generated on: ${new Date().toISOString()}

## Files with Mixed Styling Approaches

| File | Tailwind | Inline Styles | CSS Imports | Recommendation |
|------|----------|---------------|------------|----------------|
`;

// Find all component files
let filesToCheck = [];

// Use fs.readdir recursively instead of find command
const getAllFiles = (dir, patterns) => {
  const results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory() && !filePath.includes('node_modules')) {
      results.push(...getAllFiles(filePath, patterns));
    } else {
      const ext = path.extname(file);
      if (patterns.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
};

try {
  filesToCheck = getAllFiles(SRC_DIR, FILE_PATTERNS);
  console.log(`Found ${filesToCheck.length} files to check`);
} catch (error) {
  console.error(`Error finding files:`, error);
}

// Analyze each file
filesToCheck.forEach(file => {
  if (!file) return; // Skip empty entries
  
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for each pattern
    const hasTailwind = TAILWIND_PATTERN.test(content);
    const hasInlineStyles = INLINE_STYLE_PATTERN.test(content);
    const hasCssImports = CSS_IMPORT_PATTERN.test(content);
    
    // Only report files with mixed approaches
    if ((hasTailwind && hasInlineStyles) || (hasTailwind && hasCssImports) || (hasInlineStyles && hasCssImports)) {
      const relativePath = path.relative(process.cwd(), file);
      
      let recommendation = '';
      if (hasTailwind && hasInlineStyles && !hasCssImports) {
        recommendation = 'Convert inline styles to Tailwind classes';
      } else if (hasTailwind && hasCssImports && !hasInlineStyles) {
        recommendation = 'Consider component-specific CSS for complex styling, Tailwind for layout';
      } else if (hasInlineStyles && hasCssImports && !hasTailwind) {
        recommendation = 'Adopt Tailwind for layout, move complex styles to CSS file';
      } else {
        recommendation = 'Consolidate approaches: Tailwind for layout, component CSS for complex styling';
      }
      
      report += `| ${relativePath} | ${hasTailwind ? '✅' : '❌'} | ${hasInlineStyles ? '✅' : '❌'} | ${hasCssImports ? '✅' : '❌'} | ${recommendation} |\n`;
    }
  } catch (error) {
    console.error(`Error processing file ${file}:`, error);
  }
});

// Add summary
report += `
## Summary

This report highlights files using multiple styling approaches, which can lead to inconsistency and maintenance challenges.

### Recommended Approach:

1. **Use Tailwind for:**
   - Layout (flex, grid, padding, margin)
   - Typography (text size, weight, color)
   - Common visual elements (backgrounds, borders)

2. **Use component CSS for:**
   - Complex animations
   - Specialized styling that would be verbose in Tailwind
   - Global themes and design system elements

3. **Avoid inline styles** except for dynamically computed values

See CSS_STANDARDIZATION.md for more detailed guidelines.
`;

// Write the report
fs.writeFileSync(REPORT_FILE, report);
console.log(`Style consistency report generated at ${REPORT_FILE}`);
