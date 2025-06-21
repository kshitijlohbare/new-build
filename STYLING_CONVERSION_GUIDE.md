# Step-by-Step Guide: Converting a Component to the Standard Styling Approach

This guide walks you through the process of converting a component from mixed styling to our standardized Tailwind-first approach.

## Example: Converting `MobileHome.tsx`

We'll use `MobileHome.tsx` as our example, but the same steps can be applied to any component.

### Step 1: Analyze Current Styling

First, identify all the different styling methods used in the file:

1. **Imported CSS files:**
   - `@/styles/mobileHome.css`
   - `@/styles/mobileHomeBackgroundFix.css`

2. **Inline styles:**
   ```tsx
   <div style={{ maxWidth: '100%' }}>
   <div style={{ background: 'none' }}>
   <input style={{ caretColor: "white", fontSize: "14px" }}>
   ```

3. **Tailwind classes:**
   ```tsx
   <div className="flex-1 overflow-y-auto w-full">
   ```

### Step 2: Plan the Conversion

Decide which styles should be:

- ✅ Converted to Tailwind classes (most layout, spacing, colors)
- 🔄 Kept in component CSS files (animations, complex styles)
- 🗑️ Removed if redundant

### Step 3: Convert Inline Styles to Tailwind

For each inline style, find the equivalent Tailwind class:

1. **Style: `style={{ maxWidth: '100%' }}`**  
   **Tailwind:** `className="max-w-full"`

2. **Style: `style={{ background: 'none' }}`**  
   **Tailwind:** `className="bg-none"`

3. **Style: `style={{ caretColor: "white", fontSize: "14px" }}`**  
   **Tailwind:** `className="caret-white text-sm"`

Use our `style-converter.js` tool for help:
```bash
node style-converter.js fontSize 14px
# Output: text-sm
```

### Step 4: Handle Component-Specific CSS

Review imported CSS files:

1. For styles that can be converted to Tailwind:
   - Migrate them to Tailwind classes in the component
   - Remove them from the CSS file

2. For complex styles (animations, etc.):
   - Keep them in the CSS file
   - Add comments explaining why they need to remain as CSS

### Step 5: Merge Classes

When adding Tailwind classes to elements that already have classes:

```tsx
// BEFORE
<div 
  className="welcome-header" 
  style={{ background: 'none' }}
>

// AFTER
<div className="welcome-header bg-none">
```

### Step 6: Fix Input Elements

Special attention for input elements with multiple attributes:

```tsx
// BEFORE
<input 
  className="w-full bg-transparent outline-none"
  style={{caretColor: "white", fontSize: "14px"}}
/>

// AFTER
<input 
  className="w-full bg-transparent outline-none caret-white text-sm"
/>
```

### Step 7: Verify & Test

After converting:
1. Run the style checker to verify no mixed styling remains
2. Test the component visually at all breakpoints
3. Check for any styling regressions

### Step 8: Document Exceptions

If some styles must remain as CSS, add a comment explaining why:

```tsx
import "@/styles/mobileHome.css"; // Contains complex animations and transitions
```

## Common Conversion Patterns

### Spacing & Layout

| Inline Style | Tailwind Class |
|-------------|---------------|
| `padding: '16px'` | `p-4` |
| `margin: '8px 16px'` | `my-2 mx-4` |
| `display: 'flex'` | `flex` |
| `flexDirection: 'column'` | `flex-col` |
| `justifyContent: 'center'` | `justify-center` |

### Typography

| Inline Style | Tailwind Class |
|-------------|---------------|
| `fontSize: '14px'` | `text-sm` |
| `fontWeight: 600` | `font-semibold` |
| `textAlign: 'center'` | `text-center` |
| `color: '#333'` | `text-gray-800` |

### Visual Styles

| Inline Style | Tailwind Class |
|-------------|---------------|
| `backgroundColor: '#fff'` | `bg-white` |
| `borderRadius: '8px'` | `rounded-lg` |
| `border: '1px solid #ccc'` | `border border-gray-300` |
| `boxShadow: '0 2px 4px rgba(0,0,0,0.1)'` | `shadow-md` |
