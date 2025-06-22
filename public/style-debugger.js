// Style debugging script
// This script will log the computed styles of practice-item and delights-input-container elements
// and also create a visible overlay showing the current padding and gap values

console.log('Style debugging script loaded');

function createDebugOverlay() {
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.bottom = '100px';
  overlay.style.left = '10px';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
  overlay.style.color = 'white';
  overlay.style.padding = '10px';
  overlay.style.borderRadius = '5px';
  overlay.style.zIndex = '9999';
  overlay.style.fontSize = '12px';
  overlay.style.maxWidth = '80%';
  overlay.style.maxHeight = '50%';
  overlay.style.overflow = 'auto';
  overlay.id = 'style-debug-overlay';
  
  document.body.appendChild(overlay);
  return overlay;
}

function updateDebugInfo() {
  console.log('Updating debug info');
  
  let overlay = document.getElementById('style-debug-overlay');
  if (!overlay) {
    overlay = createDebugOverlay();
  }
  
  let debugInfo = '<h3>Style Debug Info</h3>';
  
  // Check practice items
  const practiceItems = document.querySelectorAll('.practice-item');
  if (practiceItems.length) {
    debugInfo += '<h4>Practice Items (' + practiceItems.length + ' found)</h4>';
    
    practiceItems.forEach((item, index) => {
      if (index < 3) { // Limit to first 3 items
        const styles = window.getComputedStyle(item);
        debugInfo += `<div>Item #${index}:<br>
          padding: ${styles.padding}<br>
          gap: ${styles.gap}<br>
          display: ${styles.display}<br>
          flexDirection: ${styles.flexDirection}</div>`;
          
        // Check first child
        if (item.firstElementChild) {
          const childStyles = window.getComputedStyle(item.firstElementChild);
          debugInfo += `<div>- First child:<br>
            padding: ${childStyles.padding}<br>
            margin: ${childStyles.margin}</div>`;
        }
      }
    });
  } else {
    debugInfo += '<p>No practice items found</p>';
  }
  
  // Check delights container
  const delightsContainer = document.getElementById('delights-input-container');
  if (delightsContainer) {
    const styles = window.getComputedStyle(delightsContainer);
    debugInfo += `<h4>Delights Input Container</h4>
      <div>
        padding: ${styles.padding}<br>
        gap: ${styles.gap}<br>
        display: ${styles.display}
      </div>`;
      
    // Check children
    if (delightsContainer.firstElementChild) {
      const childStyles = window.getComputedStyle(delightsContainer.firstElementChild);
      debugInfo += `<div>- First child:<br>
        padding: ${childStyles.padding}<br>
        margin: ${childStyles.margin}</div>`;
    }
  } else {
    debugInfo += '<p>No delights container found</p>';
  }
  
  overlay.innerHTML = debugInfo;
}

// Run debug on load and periodically
document.addEventListener('DOMContentLoaded', () => {
  updateDebugInfo();
  
  // Update every 2 seconds
  setInterval(updateDebugInfo, 2000);
});

// Add a style block to target min-width specifically
document.addEventListener('DOMContentLoaded', () => {
  // Create a style element
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Target min-width in browsing mode */
    button,
    button[type],
    #practices-filter-chips-container button,
    #learn-filter-chips-container button,
    .filter-chip,
    [style*="min-width: 44px"] {
      min-width: auto !important;
      width: auto !important;
    }
  `;
  
  // Add to document head
  document.head.appendChild(styleElement);
  console.log('Added min-width override style block');
});

// Add a toggle button
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Toggle Debug';
  toggleButton.style.position = 'fixed';
  toggleButton.style.top = '10px';
  toggleButton.style.right = '10px';
  toggleButton.style.zIndex = '10000';
  toggleButton.style.padding = '5px 10px';
  
  toggleButton.addEventListener('click', () => {
    const overlay = document.getElementById('style-debug-overlay');
    if (overlay) {
      overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
    }
  });
  
  document.body.appendChild(toggleButton);
});
