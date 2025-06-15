# Mobile Keyboard-Aware Input Implementation

This document outlines how to implement keyboard-aware inputs that will automatically adjust when the on-screen keyboard appears on mobile devices.

## What's Implemented

1. **Custom Hooks**: 
   - `useVisualViewport.ts` - Tracks the visual viewport changes when the keyboard appears
   - `useKeyboardAwareInput` - Specific hook for handling input field position adjustments

2. **Component Wrappers**:
   - `KeyboardAwareInput` - A wrapper for HTML input elements
   - `KeyboardAwareTextarea` - A wrapper for HTML textarea elements

## How to Implement

To implement keyboard-aware inputs across the application, follow these steps:

### Step 1: Import the Component

Add the import to your component:

```tsx
import { KeyboardAwareInput, KeyboardAwareTextarea } from "@/components/ui/KeyboardAwareInput";
```

### Step 2: Replace Standard Inputs

Replace standard HTML inputs with the KeyboardAwareInput component:

**Before**:
```tsx
<input
  type="text"
  placeholder="Your placeholder"
  className="your-classes"
  value={yourValue}
  onChange={(e) => handleChange(e)}
/>
```

**After**:
```tsx
<KeyboardAwareInput
  type="text"
  placeholder="Your placeholder"
  className="your-classes"
  value={yourValue}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
/>
```

### Step 3: Replace Textareas (if applicable)

Replace standard HTML textareas with the KeyboardAwareTextarea component:

**Before**:
```tsx
<textarea
  placeholder="Your placeholder"
  className="your-classes"
  value={yourValue}
  onChange={(e) => handleChange(e)}
/>
```

**After**:
```tsx
<KeyboardAwareTextarea
  placeholder="Your placeholder"
  className="your-classes"
  value={yourValue}
  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(e)}
/>
```

## Priority Implementation Locations

Focus on updating inputs in these components first:

1. **GroupMessages.tsx** - Message composing input field
2. **FitnessGroups.tsx** - Search and create group input fields
3. **Components with fixed-position input fields** - Especially those at the bottom of the screen

## How It Works

The implementation uses the Visual Viewport API to detect when the keyboard appears and adjusts the scroll position so that the focused input remains visible. It:

1. Detects when the viewport resizes (keyboard appears)
2. Calculates if the input would be hidden behind the keyboard
3. Scrolls the page automatically to keep the input visible
4. Handles focus/blur events to maintain proper UX

## Testing

After implementing, test on real mobile devices to ensure:
1. Input fields rise above the keyboard
2. The transition is smooth and doesn't cause layout shifts
3. The input remains accessible when typing

## Compatibility Notes

This solution works on:
- iOS Safari 13.0+
- Chrome for Android 
- Most modern mobile browsers that support the Visual Viewport API

Some older browsers might not support the Visual Viewport API, but the component includes fallbacks for those cases.
