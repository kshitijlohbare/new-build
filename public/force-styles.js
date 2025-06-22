// Force styling for practice-item, delights-input-container, and tribe-section
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content loaded - forcing styles');
  
  // Force practice-item styles
  const practiceItems = document.querySelectorAll('.practice-item');
  practiceItems.forEach(item => {
    // Set container styles
    item.style.padding = '10px';
    item.style.gap = '4px';
    item.style.boxSizing = 'border-box';
    item.style.display = 'flex';
    item.style.flexDirection = 'row';
    item.style.alignItems = 'center';
    item.style.justifyContent = 'space-between';
    
    // Set child styles
    Array.from(item.children).forEach(child => {
      child.style.padding = '0';
      child.style.margin = '0';
    });
  });
  
  // Force delights-input-container styles
  const delightsContainer = document.getElementById('delights-input-container');
  if (delightsContainer) {
    delightsContainer.style.padding = '14px 20px';
    delightsContainer.style.gap = '8px';
    delightsContainer.style.boxSizing = 'border-box';
    delightsContainer.style.display = 'flex';
    delightsContainer.style.alignItems = 'center';
  }
  
  // Force tribe-section styles
  const tribeSection = document.querySelector('.tribe-section');
  if (tribeSection) {
    tribeSection.style.setProperty('display', 'flex', 'important');
    tribeSection.style.setProperty('flex-direction', 'column', 'important');
    tribeSection.style.setProperty('width', '100%', 'important');
    tribeSection.style.setProperty('align-items', 'center', 'important');
    tribeSection.style.setProperty('position', 'relative', 'important');
    tribeSection.style.setProperty('z-index', '1', 'important');
    tribeSection.style.setProperty('overflow', 'visible', 'important');
  }
  
  // Force tribe-content styles
  const tribeContent = document.querySelector('.tribe-content');
  if (tribeContent) {
    tribeContent.style.setProperty('display', 'flex', 'important');
    tribeContent.style.setProperty('flex-direction', 'column', 'important');
    tribeContent.style.setProperty('width', '100%', 'important');
    tribeContent.style.setProperty('align-items', 'center', 'important');
    tribeContent.style.setProperty('position', 'relative', 'important');
    tribeContent.style.setProperty('z-index', '1', 'important');
    tribeContent.style.setProperty('overflow', 'visible', 'important');
  }
  
  // Force tribe-cards-container styles
  const tribeCardsContainer = document.querySelector('.tribe-cards-container');
  if (tribeCardsContainer) {
    tribeCardsContainer.style.setProperty('display', 'flex', 'important');
    tribeCardsContainer.style.setProperty('flex-direction', 'column', 'important');
    tribeCardsContainer.style.setProperty('width', '100%', 'important');
    tribeCardsContainer.style.setProperty('align-items', 'center', 'important');
    tribeCardsContainer.style.setProperty('position', 'relative', 'important');
    tribeCardsContainer.style.setProperty('z-index', '1', 'important');
    tribeCardsContainer.style.setProperty('overflow', 'visible', 'important');
  }
  
  // Force styles on all Frame13 and fitness-group-card elements
  const groupCards = document.querySelectorAll('.Frame13, .fitness-group-card');
  groupCards.forEach(card => {
    card.style.setProperty('position', 'relative', 'important');
    card.style.setProperty('z-index', '1', 'important');
    card.style.setProperty('overflow', 'visible', 'important');
  });
  
  console.log('Forced styles applied');
});

// Also set up a MutationObserver to apply styles to newly added elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // Check for practice-items and other elements
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Practice item styles
          if (node.classList && node.classList.contains('practice-item')) {
            node.style.padding = '10px';
            node.style.gap = '4px';
            Array.from(node.children).forEach(child => {
              child.style.padding = '0';
              child.style.margin = '0';
            });
          }
          
          // Delights input container styles
          if (node.id === 'delights-input-container') {
            node.style.padding = '10px 20px';
            node.style.gap = '4px';
          }
          
          // Tribe section styles
          if (node.classList && node.classList.contains('tribe-section')) {
            node.style.setProperty('display', 'flex', 'important');
            node.style.setProperty('flex-direction', 'column', 'important');
            node.style.setProperty('width', '100%', 'important');
            node.style.setProperty('align-items', 'center', 'important');
            node.style.setProperty('position', 'relative', 'important');
            node.style.setProperty('z-index', '1', 'important');
            node.style.setProperty('overflow', 'visible', 'important');
          }
          
          // Tribe content styles
          if (node.classList && node.classList.contains('tribe-content')) {
            node.style.setProperty('display', 'flex', 'important');
            node.style.setProperty('flex-direction', 'column', 'important');
            node.style.setProperty('width', '100%', 'important');
            node.style.setProperty('align-items', 'center', 'important');
            node.style.setProperty('position', 'relative', 'important');
            node.style.setProperty('z-index', '1', 'important');
            node.style.setProperty('overflow', 'visible', 'important');
          }
          
          // Frame13 or fitness-group-card styles
          if (node.classList && (node.classList.contains('Frame13') || node.classList.contains('fitness-group-card'))) {
            node.style.setProperty('position', 'relative', 'important');
            node.style.setProperty('z-index', '1', 'important');
            node.style.setProperty('overflow', 'visible', 'important');
          }
          
          // Check within added nodes for other elements
          const practiceItems = node.querySelectorAll('.practice-item');
          if (practiceItems.length) {
            practiceItems.forEach(item => {
              item.style.padding = '10px';
              item.style.gap = '4px';
              Array.from(item.children).forEach(child => {
                child.style.padding = '0';
                child.style.margin = '0';
              });
            });
          }
          
          const delightsContainer = node.querySelector('#delights-input-container');
          if (delightsContainer) {
            delightsContainer.style.padding = '10px 20px';
            delightsContainer.style.gap = '4px';
          }
          
          // Check for tribe section elements
          const tribeSection = node.querySelector('.tribe-section');
          if (tribeSection) {
            tribeSection.style.setProperty('display', 'flex', 'important');
            tribeSection.style.setProperty('flex-direction', 'column', 'important');
            tribeSection.style.setProperty('width', '100%', 'important');
            tribeSection.style.setProperty('align-items', 'center', 'important');
            tribeSection.style.setProperty('position', 'relative', 'important');
            tribeSection.style.setProperty('z-index', '1', 'important');
            tribeSection.style.setProperty('overflow', 'visible', 'important');
          }
          
          const tribeContent = node.querySelector('.tribe-content');
          if (tribeContent) {
            tribeContent.style.setProperty('display', 'flex', 'important');
            tribeContent.style.setProperty('flex-direction', 'column', 'important');
            tribeContent.style.setProperty('width', '100%', 'important');
            tribeContent.style.setProperty('align-items', 'center', 'important');
            tribeContent.style.setProperty('position', 'relative', 'important');
            tribeContent.style.setProperty('z-index', '1', 'important');
            tribeContent.style.setProperty('overflow', 'visible', 'important');
          }
          
          const groupCards = node.querySelectorAll('.Frame13, .fitness-group-card');
          groupCards.forEach(card => {
            card.style.setProperty('position', 'relative', 'important');
            card.style.setProperty('z-index', '1', 'important');
            card.style.setProperty('overflow', 'visible', 'important');
          });
        }
      });
    }
  });
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('Style enforcement script loaded and ready');
