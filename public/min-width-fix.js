// Script to directly override min-width in browsing mode
(function() {
  console.log('Applying min-width fix for browsing mode');
  
  function overrideMinWidth() {
    // Target all filter chip buttons
    const filterChipButtons = document.querySelectorAll('#practices-filter-chips-container button, #learn-filter-chips-container button, .filter-chip');
    
    console.log(`Found ${filterChipButtons.length} filter chip buttons to fix`);
    
    filterChipButtons.forEach(button => {
      // Direct style override
      button.style.setProperty('min-width', 'auto', 'important');
      button.style.setProperty('width', 'auto', 'important');
      
      // Add a data attribute to mark this element as fixed
      button.setAttribute('data-min-width-fixed', 'true');
    });
  }
  
  // Apply immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', overrideMinWidth);
  } else {
    overrideMinWidth();
  }
  
  // Also apply after a short delay to catch any dynamic rendering
  setTimeout(overrideMinWidth, 100);
  setTimeout(overrideMinWidth, 500);
  setTimeout(overrideMinWidth, 1000);
  
  // Set up a MutationObserver to watch for new buttons
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        overrideMinWidth();
      }
    });
  });
  
  // Start observing once the DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
