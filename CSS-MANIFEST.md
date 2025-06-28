/* 
 * CSS-MANIFEST.md
 * Documentation of CSS files and their purposes
 * This file helps track and organize the CSS structure of the project
 */

## Core Stylesheets

- `/src/styles/reset.css` - Base CSS reset to normalize browser defaults
- `/src/index.css` - Global styles and variables
- `/src/styles/tailwind-utilities.css` - Tailwind utility classes
- `/src/styles/GlobalTypographyFix.css` - Typography standardization
- `/src/styles/EssentialSpacingFix.css` - Spacing corrections

## Consolidated System Files

- `/src/styles/FilterChipsSystem.css` - Complete filter chip styling system
- `/src/styles/BorderlessFilters.css` - High-specificity overrides for removing borders
- `/src/styles/TherapistCardsSystem.css` - Complete therapist card styling system
- `/src/styles/FocusTimerSystem.css` - Complete focus timer styling system

## Component-specific Stylesheets

### Filter Chips System
- `/src/styles/FilterChipsSystem.css` - **PRIMARY** - Consolidated filter chip styling
- `/src/styles/FilterChipsOverflow.css` - Ensures horizontal scrolling behavior
- `/src/styles/FilterChipBorders.css` - **DEPRECATED** - Border styles (use FilterChipsSystem instead)
- `/public/filter-chip-fix.css` - **DEPRECATED** - Quick fixes (use FilterChipsSystem instead)
- `/public/no-borders-filter-chips.css` - High-priority overrides
- `/public/final-filter-chips-no-borders.css` - Final overrides

### Therapist Cards
- `/src/styles/therapySection.css` - Core therapist section styles
- `/src/styles/MobileTherapistsSection.css` - Mobile-specific styles
- `/public/therapist-cards-fix.css` - Fixes for therapist cards
- `/public/final-therapist-cards-fix.css` - Final overrides for therapist cards

### Focus Timer
- `/src/styles/FocusTimer.css` - Base styles for focus timer
- `/src/styles/FocusTimerFix.css` - Fixes for focus timer
- `/src/styles/FocusTimerHeaderFix.css` - Header-specific fixes for focus timer

### Other Components
- `/src/styles/DelightsInputFix.css` - Styles for delights input
- `/src/styles/PracticeToggleButtonFix.css` - Styles for practice toggle button
- `/src/styles/FeelsSectionImproved.css` - Enhanced feels section

## Component Architecture

### Practices Page
- `/src/pages/Practices.tsx` - Main practices page component
- `/src/components/wellbeing/PracticeFilter.tsx` - Logic-only component for filtering practices
- `/src/components/wellbeing/PracticeCard.tsx` - UI component for rendering practice cards

### Reusable Components
- `/src/components/common/FilterChips.tsx` - Reusable filter chips component
- `/src/components/common/SearchBar.tsx` - Reusable search bar component
- `/src/components/common/PageBackground.tsx` - Reusable page background component
- `/src/components/common/PageTitle.tsx` - Reusable page title component
- `/src/components/common/ClickablePortal.tsx` - Reusable portal for modals

### Utilities
- `/src/utils/TypeUtilities.ts` - Shared type definitions
- `/src/utils/ErrorHandling.ts` - Error handling utilities

## Technical Debt Reduction Plan

1. Move all public/*.css files to src/styles with proper naming
2. Consolidate overlapping CSS files:
   - Create FilterChipsSystem.css ✅
   - Create TherapistCardsSystem.css ✅
   - Create FocusTimerSystem.css ✅
   - Create BorderlessFilters.css ✅
   
   Progress: 4/4 consolidation tasks completed ✅
3. Extract reusable components:
   - Create PracticeFilter component ✅
   - Create PracticeCard component ✅ 
   - Create SearchBar component ✅
   - Create FilterChips component ✅
   - Create PageBackground component ✅
   - Create PageTitle component ✅
4. Remove all !important declarations where possible
5. Create a design system with standardized tokens
6. Document all component-specific CSS files ✅
7. Add comprehensive error handling to all components ✅
8. Improve accessibility with proper ARIA attributes ✅

## CSS File Naming Conventions

- Base files: `ComponentName.css`
- Consolidated systems: `ComponentNameSystem.css`
- Temporary fixes: `ComponentNameFix.css` (to be phased out)
