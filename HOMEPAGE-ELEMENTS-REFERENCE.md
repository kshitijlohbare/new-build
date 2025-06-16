# Homepage Elements Reference

This document provides a reference of all named elements in the homepage, including their IDs, data-testids, and ARIA attributes for easier reference during development and testing.

## Home Header Component

The header component used in both desktop and mobile versions:

- **Container**: `id="home-header"` | `data-testid="home-header"` | `aria-label="Application header with navigation and user stats"`

### Header Elements:

- **Menu Button**: `id="header-menu-btn"` | `data-testid="header-menu-button"` | `aria-label="Toggle sidebar menu"`
- **Logo Container**: `id="header-logo-container"` | `data-testid="header-logo-container"`
- **Logo Image**: `id="header-logo"` | `data-testid="header-logo"`
- **User Stats Container**: `id="user-stats-container"` | `data-testid="user-stats-container"` | `aria-label="User statistics"`
- **Level Badge**: `id="user-level-badge"` | `data-testid="user-level-badge"` | `aria-label="User level: X"`
- **Streak Badge**: `id="user-streak-badge"` | `data-testid="user-streak-badge"` | `aria-label="Current streak: X days"`
- **Points Badge**: `id="user-points-badge"` | `data-testid="user-points-badge"` | `aria-label="Total points: X"`

## Desktop Homepage (Index.tsx)

The main desktop version of the homepage:

- **Main Content**: `id="homepage-content"` | `data-testid="homepage-content"` | `aria-label="Homepage content"`

### Homepage Sections:

- **Daily Delights Section**: `id="daily-delights-section"` | `data-testid="daily-delights-section"` | `aria-labelledby="daily-delights-heading"`
  - **Heading**: `id="daily-delights-heading"` | `data-testid="daily-delights-heading"`

- **Wellbeing Tips Section**: `id="wellbeing-tips-section"` | `data-testid="wellbeing-tips-section"` | `aria-labelledby="wellbeing-tips-heading"`
  - **Heading**: `id="wellbeing-tips-heading"` | `data-testid="wellbeing-tips-heading"`

- **Daily Practices Section**: `id="daily-practices-section"` | `data-testid="daily-practices-section"` | `aria-labelledby="daily-practices-heading"`
  - **Heading**: `id="daily-practices-heading"` | `data-testid="daily-practices-heading"`

- **Book Session Section**: `id="book-session-section"` | `data-testid="book-session-section"` | `aria-labelledby="book-session-heading"`
  - **Heading**: `id="book-session-heading"` | `data-testid="book-session-heading"`

## Mobile Homepage (MobileHome.tsx)

The mobile version of the homepage:

- **Container**: `id="mobile-home-root"` | `data-testid="mobile-home-container"` | `aria-label="Mobile home page"`

### Mobile Hero Section:

- **Hero Section**: `id="mobile-hero-section"` | `data-testid="mobile-hero-section"` | `aria-labelledby="welcome-title-text"`
- **Welcome Header**: `id="mobile-welcome-header"` | `data-testid="mobile-welcome-header"`
- **Welcome Title**: `id="welcome-title-text"` | `data-testid="welcome-title"`

### Mobile Delights Section:

- **Delights Wrapper**: `id="mobile-delights-wrapper"` | `data-testid="mobile-delights-wrapper"` | `aria-labelledby="delights-section-title"`
- **Delights Title**: `id="delights-section-title"` | `data-testid="delights-section-title"`
- **Delights Container**: `id="delights-scrollable-container"` | `data-testid="delights-scrollable-container"` | `aria-label="Scrollable list of delights"`

#### For each delight item (dynamic):
- **Delight Column**: `data-testid="delight-column-${index}"`
- **Delight Item**: `id="delight-item-${index}"` | `data-testid="delight-item-${index}"` | `aria-label="Delight entry: ${text}"`
- **Delete Button**: `id="delight-delete-btn-${index}"` | `data-testid="delight-delete-btn-${index}"` | `aria-label="Delete this delight"`

#### Add Delight Section:
- **Add Column**: `id="add-delight-column"` | `data-testid="add-delight-column"`
- **Add Bubble**: `id="add-delight-bubble"` | `data-testid="add-delight-bubble"` | `aria-label="Add a new delight"`

### Main Content Sections:

- **Daily Practices Section**: `id="daily-practices-section"` | `data-testid="daily-practices-section"` | `aria-labelledby="daily-practices-heading"`
  - **Heading**: `id="daily-practices-heading"` | `data-testid="daily-practices-heading"`

- **Wellbeing Tips Section**: `id="wellbeing-tips-section"` | `data-testid="wellbeing-tips-section"` | `aria-labelledby="wellbeing-tips-heading"`
  - **Heading**: `id="wellbeing-tips-heading"` | `data-testid="wellbeing-tips-heading"`

- **Book Session Section**: `id="book-session-section"` | `data-testid="book-session-section"` | `aria-labelledby="book-session-heading"`
  - **Heading**: `id="book-session-heading"` | `data-testid="book-session-heading"`

### Input Components:

- **Input Bar**: `id="delights-input-container"` | `data-testid="delights-input-container"` | `aria-label="Enter a new delight"`
- **Emoji Picker**: `id="emoji-picker-dropdown"` | `data-testid="emoji-picker-dropdown"` | `aria-label="Emoji picker"`
- **Emoji Grid**: `id="emoji-grid"` | `data-testid="emoji-grid"`
- **Emoji Buttons**: `id="emoji-btn-${index}"` | `data-testid="emoji-btn-${index}"` | `aria-label="Insert emoji ${emoji}"`
- **Swipe Indicator**: `id="swipe-indicator"` | `data-testid="swipe-indicator"`
- **Swipe Hint Text**: `id="swipe-hint-text"` | `data-testid="swipe-hint-text"`
- **Submit Form**: `id="delight-submit-form"` | `data-testid="delight-submit-form"`
- **Input Field**: `id="delight-input-field"` | `data-testid="delight-input-field"`
- **Emoji Toggle Button**: `id="emoji-toggle-button"` | `data-testid="emoji-toggle-button"` | `aria-label="Open emoji picker"`
- **Emoji Button Icon**: `id="emoji-button-icon"` | `data-testid="emoji-button-icon"`
- **Post Button**: `id="delight-post-button"` | `data-testid="delight-post-button"` | `aria-label="Post your delight"`

### Floating Button:
- **Floating Add Button**: `id="add-delight-floating-button"` | `data-testid="add-delight-floating-button"` | `aria-label="Add new delight"`
- **Plus Icon**: `id="plus-icon"` | `data-testid="plus-icon"`

## Benefits of Named Elements

1. **Development Benefits**:
   - Easier to target specific elements in CSS
   - Clear structure for component hierarchy 
   - Unambiguous element selection for JavaScript manipulation

2. **Testing Benefits**:
   - Reliable test selectors with data-testids
   - Component-based testing possible
   - Stable identifiers for automated testing

3. **Accessibility Benefits**:
   - ARIA attributes improve screen reader navigation
   - Clear labeling of interactive elements
   - Proper semantic structure with aria-labelledby relationships
