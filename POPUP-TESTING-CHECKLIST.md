# Popup Interaction Testing Checklist

Use this checklist to verify all popup interactions are working correctly before cleaning up the debugging code.

## Basic Popup Functionality
- [ ] Popup opens when clicking on a practice card
- [ ] Popup background overlay is visible
- [ ] Popup content is centered on screen
- [ ] Popup appears above all other page content

## Close Button
- [ ] Close button (X) in top-right corner is visible
- [ ] Close button responds to click/tap
- [ ] Popup closes when close button is clicked
- [ ] No unexpected behavior after closing

## Overlay Interaction
- [ ] Clicking outside the popup (on overlay) closes the popup
- [ ] Clicking inside the popup content does NOT close the popup
- [ ] Scrolling works properly inside the popup when content is long

## Step Navigation
- [ ] "Steps to Follow" shows all available steps
- [ ] Clicking on a step shows the step detail view
- [ ] Back button from step detail returns to steps list
- [ ] Next/Previous buttons work in step detail view
- [ ] Step indicator (e.g., "Step 2 of 5") is accurate

## Daily Practice Toggle
- [ ] "Add to daily practices" button works
- [ ] "Remove from daily practices" button works
- [ ] The button state changes visually after clicking
- [ ] Toast notification appears when adding/removing

## Mobile Device Testing
- [ ] All buttons and interactions work on touch devices
- [ ] Tap targets are large enough (at least 44px)
- [ ] No accidental closing when tapping inside popup
- [ ] Scrolling works smoothly on mobile

## Accessibility
- [ ] Can navigate popup with keyboard (Tab key)
- [ ] Focus is trapped within popup while open
- [ ] Screen reader can access popup content
- [ ] Contrast ratios meet accessibility standards

## Edge Cases
- [ ] Works when multiple popups are opened in sequence
- [ ] Works when switching rapidly between different practices
- [ ] No memory leaks (check browser performance tools)
- [ ] No console errors related to popup interaction

---

Once all items are checked and working properly, you can run the cleanup script to remove debugging code:

```bash
./cleanup-debug-code.sh
```
