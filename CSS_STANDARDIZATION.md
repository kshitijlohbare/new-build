# CSS Standardization Guide

## Our Approach: Tailwind-First with Component CSS

We've adopted a "Tailwind-first" approach with component-specific CSS when needed:

### When to use Tailwind:
- For all layout (flexbox, grid, padding, margin)
- For common styles (colors, typography, spacing)
- For responsive design
- For interactive states (hover, focus, etc.)

### When to use component CSS:
- For complex animations and transitions
- For highly specific component styling that would be verbose with Tailwind
- For global themes and overrides
- For legacy components during migration

## Coding Standards

### Tailwind Classes:
- Group related classes together (layout, typography, spacing, colors)
- Use Tailwind's built-in responsive prefixes (sm:, md:, lg:)
- Extract repeated patterns to custom Tailwind components
- Use the @apply directive for frequently repeated class combinations

### Component CSS:
- Use namespaces to avoid collisions (e.g., `.homepage-hero` instead of `.hero`)
- Use CSS variables for theme colors and spacing
- Minimize use of !important
- Keep selectors as specific as needed but no more

## Migration Strategy

When working on existing components:
1. Convert inline styles to Tailwind classes
2. Move simple CSS rules from component CSS to Tailwind classes
3. Keep complex animations and specific styling in component CSS
4. Document any special cases in comments

## Examples

### Before (mixed approach):
```tsx
<div 
  className="container" 
  style={{padding: '20px', backgroundColor: '#f5f5f5'}}
>
  <h1 className="title">Hello World</h1>
</div>
```

### After (Tailwind-first):
```tsx
<div className="p-5 bg-gray-100">
  <h1 className="text-2xl font-bold text-gray-800">Hello World</h1>
</div>
```

### For complex components (Tailwind + component CSS):
```tsx
<div className="animate-fade-in p-5 bg-gray-100 my-component">
  <h1 className="text-2xl font-bold text-gray-800">Hello World</h1>
</div>
```

```css
/* component.css */
.my-component {
  animation: special-animation 0.5s ease-in-out;
}

@keyframes special-animation {
  /* complex animation */
}
```
