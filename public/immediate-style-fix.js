// Apply direct DOM style modifications as soon as the script loads
(function() {
  console.log('Immediate style application script running');
  
  // Function to apply styles to practice items
  function stylePracticeItems() {
    const practiceItems = document.querySelectorAll('.practice-item');
    console.log(`Found ${practiceItems.length} practice items to style`);
    
    practiceItems.forEach(item => {
      // Apply container styles
      item.style.setProperty('padding', '10px', 'important');
      item.style.setProperty('gap', '4px', 'important');
      item.style.setProperty('display', 'flex', 'important');
      item.style.setProperty('flex-direction', 'row', 'important');
      item.style.setProperty('align-items', 'center', 'important');
      item.style.setProperty('justify-content', 'space-between', 'important');
      item.style.setProperty('box-sizing', 'border-box', 'important');
      
      // Fix the min-width issue
      item.style.setProperty('min-width', 'auto', 'important');
      
      // Apply styles to direct children
      Array.from(item.children).forEach(child => {
        child.style.setProperty('padding', '0', 'important');
        child.style.setProperty('margin', '0', 'important');
        
        // Apply styles to nested children too
        Array.from(child.querySelectorAll('*')).forEach(nestedChild => {
          nestedChild.style.setProperty('padding', '0', 'important');
          nestedChild.style.setProperty('margin', '0', 'important');
        });
      });
    });
  }
  
  // Function to style delights input container
  function styleDelightsContainer() {
    const container = document.getElementById('delights-input-container');
    if (container) {
      console.log('Styling delights container');
      container.style.setProperty('padding', '10px 20px', 'important');
      container.style.setProperty('gap', '4px', 'important');
      container.style.setProperty('box-sizing', 'border-box', 'important');
      
      // Apply gap to children
      Array.from(container.children).forEach(child => {
        child.style.setProperty('gap', '4px', 'important');
      });
    }
  }
  
  // Try to apply styles immediately
  stylePracticeItems();
  styleDelightsContainer();
  
  // Also apply when DOM content is loaded
  document.addEventListener('DOMContentLoaded', () => {
    stylePracticeItems();
    styleDelightsContainer();
  });
  
  // Apply styles after page load
  window.addEventListener('load', () => {
    stylePracticeItems();
    styleDelightsContainer();
    
    // And again after a short delay
    setTimeout(() => {
      stylePracticeItems();
      styleDelightsContainer();
    }, 500);
  });
  
  // Set up a MutationObserver for dynamic content
  const observer = new MutationObserver((mutations) => {
    let needsUpdate = false;
    
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      stylePracticeItems();
      styleDelightsContainer();
    }
  });
  
  // Start observing the body for changes
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
  
  // Create a global function so it can be called manually
  window.forceStyleUpdate = function() {
    stylePracticeItems();
    styleDelightsContainer();
  };
  
  // Apply styles repeatedly for 5 seconds
  let attemptCount = 0;
  const interval = setInterval(() => {
    stylePracticeItems();
    styleDelightsContainer();
    attemptCount++;
    
    if (attemptCount >= 10) {
      clearInterval(interval);
    }
  }, 500);
})();
