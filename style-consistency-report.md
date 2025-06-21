# Style Consistency Report
Generated on: 2025-06-21T15:05:07.215Z

## Files with Mixed Styling Approaches

| File | Tailwind | Inline Styles | CSS Imports | Recommendation |
|------|----------|---------------|------------|----------------|
| src/App.tsx | ✅ | ✅ | ✅ | Consolidate approaches: Tailwind for layout, component CSS for complex styling |
| src/components/community/EnhancedNavBar.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/components/layout/AppNavbar.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/components/layout/GlobalSidebar.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/components/layout/HeaderBar.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/components/layout/HomeHeader.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/components/layout/Sidebar.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/components/wellbeing/BadgeCarousel.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/components/wellbeing/DailyPractices.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/components/wellbeing/DailyPracticesSimple.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/components/wellbeing/MobileBookSessionSection.tsx | ❌ | ✅ | ✅ | Adopt Tailwind for layout, move complex styles to CSS file |
| src/components/wellbeing/MobileDailyPractices.tsx | ❌ | ✅ | ✅ | Adopt Tailwind for layout, move complex styles to CSS file |
| src/components/wellbeing/PracticeDetailPopupFixed.tsx | ✅ | ✅ | ✅ | Consolidate approaches: Tailwind for layout, component CSS for complex styling |
| src/components/wellbeing/WeeklyPointsChart.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/Booking.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/Community.new.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/Community.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/CommunityClean.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/Community_Complete.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/Community_Messages.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/Community_New.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/FitnessGroups.new.tsx | ✅ | ❌ | ✅ | Consider component-specific CSS for complex styling, Tailwind for layout |
| src/pages/FlashScreen.tsx | ❌ | ✅ | ✅ | Adopt Tailwind for layout, move complex styles to CSS file |
| src/pages/FocusTimer.tsx | ✅ | ✅ | ✅ | Consolidate approaches: Tailwind for layout, component CSS for complex styling |
| src/pages/LandingPage.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/Learn.tsx | ✅ | ✅ | ✅ | Consolidate approaches: Tailwind for layout, component CSS for complex styling |
| src/pages/Meditation.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/MobileHome.tsx | ✅ | ❌ | ✅ | Consider component-specific CSS for complex styling, Tailwind for layout |
| src/pages/Practices.tsx | ✅ | ✅ | ✅ | Consolidate approaches: Tailwind for layout, component CSS for complex styling |
| src/pages/PractitionerOnboarding.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/Progress.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/SocialFeed.tsx | ❌ | ✅ | ✅ | Adopt Tailwind for layout, move complex styles to CSS file |
| src/pages/TherapistListing.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/TherapistRegistration.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |
| src/pages/TherapyBooking.tsx | ✅ | ✅ | ❌ | Convert inline styles to Tailwind classes |

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
