# Styling Best Practices Guide

## Overview

This document provides practical guidelines for maintaining consistent styling across our application. We follow a **Tailwind-first** approach with component-specific CSS when needed.

## Decision Tree: Tailwind or CSS?

### Use Tailwind for:
- Layout (flexbox, grid, padding, margin)
- Typography (text size, font weight, color)
- Common visual elements (backgrounds, borders)
- Responsive design
- Interactive states (hover, focus, active)
- Spacing and sizing

### Use Component CSS for:
- Complex animations and transitions
- Specialized styling that would be verbose in Tailwind
- Global themes and design system elements
- When CSS variables are needed across components

### Avoid Inline Styles except for:
- Dynamically computed values that can't be handled by Tailwind
- Temporary debugging

## Standardization Checklist

When working on a component, use this checklist:

1. **Replace inline styles with Tailwind classes**
   - Use the `style-converter.js` tool for assistance
   - Group related classes for readability (layout, typography, color)

2. **Keep component-specific CSS for complex styling only**
   - Animations, keyframes
   - Complex selectors
   - Styles requiring CSS variables

3. **Remove redundant styling**
   - Don't mix Tailwind and CSS for the same property
   - Remove unused CSS classes
   - Consolidate duplicate styles

## Working with Tailwind

### Class Organization
```tsx
// Good - Grouped by category
<div className="
  flex items-center justify-between  // Layout
  p-4 mt-2                          // Spacing
  text-lg font-medium text-gray-800 // Typography
  bg-white rounded-lg shadow-md     // Visual
  hover:bg-gray-50                  // States
">

// Avoid - Mixed organization
<div className="text-lg p-4 flex bg-white hover:bg-gray-50 font-medium items-center mt-2 justify-between shadow-md text-gray-800 rounded-lg">
```

### Responsive Design
Use Tailwind's responsive prefixes:
```tsx
<div className="
  w-full md:w-1/2 lg:w-1/3  // Different widths at different breakpoints
  p-2 md:p-4                // Different padding at different breakpoints
">
```

### For Complex UI Components
Extract complex styling patterns into reusable utilities:

1. Add to `tailwind-utilities.css`:
```css
@layer components {
  .card-base {
    @apply p-4 bg-white rounded-lg shadow-md;
  }
  
  .form-input {
    @apply px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

2. Use in components:
```tsx
<div className="card-base">
  <input className="form-input" />
</div>
```

## Using Component CSS

### When to Create a CSS File

Create a dedicated CSS file when:
- You have complex animations
- You need CSS variables for component theming
- You have complex nested selectors
- You need media queries beyond Tailwind's breakpoints

### CSS File Structure

```css
/* ComponentName.css */

/* 1. Component-specific variables */
.component-name {
  --component-accent: #3b82f6;
  --component-radius: 8px;
}

/* 2. Base styling */
.component-name {
  position: relative;
}

/* 3. Variations */
.component-name.large {
  padding: 2rem;
}

/* 4. Child elements */
.component-name__header {
  border-bottom: 1px solid var(--component-accent);
}

/* 5. Animations */
@keyframes component-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.component-name.animate {
  animation: component-fade-in 0.3s ease-in-out;
}
```

## Conversion Tools

### Style Converter

The `style-converter.js` script helps convert inline styles to Tailwind:

```bash
node style-converter.js padding 20px
# Output: p-5

node style-converter.js backgroundColor #f5f5f5
# Output: bg-gray-100
```

### Style Checker

Run the `style-checker.js` regularly to identify files with mixed styling:

```bash
node style-checker.js
```

## Example Transformations

### Before and After Examples

#### Inline Styles to Tailwind

Before:
```tsx
<div style={{
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}}>
```

After:
```tsx
<div className="flex flex-col p-4 bg-white rounded-lg shadow-md">
```

#### Mixed Approach to Tailwind-First

Before:
```tsx
<div className="card" style={{ marginBottom: '20px' }}>
  <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Title</h2>
  <p className="card-text">Content</p>
</div>
```

After:
```tsx
<div className="card mb-5">
  <h2 className="text-lg font-semibold">Title</h2>
  <p className="card-text">Content</p>
</div>
```

## Common Gotchas

- **Specificity conflicts**: Tailwind utilities have high specificity. Be cautious when mixing with component CSS.
- **Responsive behavior**: Test all components at various screen sizes after conversion.
- **Dynamic styling**: Use CSS variables for values that need to be calculated at runtime.
- **Animation performance**: Keep complex animations in CSS for better performance.
- **Overflow issues**: Watch for unexpected overflow behavior after conversion.

## Further Resources

- [Tailwind Documentation](https://tailwindcss.com/docs)
- [CSS_STANDARDIZATION.md](./CSS_STANDARDIZATION.md)
- [TAILWIND_CHEATSHEET.md](./TAILWIND_CHEATSHEET.md)
