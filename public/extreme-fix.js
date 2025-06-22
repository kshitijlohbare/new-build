/**
 * EXTREME MEASURE: Direct DOM Structure Override
 * 
 * This script completely bypasses React, CSS inheritance, and other issues
 * by directly injecting fixed HTML structures with inline styles.
 */

// Wait until the page is loaded
window.addEventListener('load', function() {
  console.log('[ExtremeFix] Initializing direct DOM override');
  
  // Run first attempt immediately
  setTimeout(applyExtremeOverride, 500);
  
  // Then try again after main content should be loaded
  setTimeout(applyExtremeOverride, 1500);
  
  // And one more time after any dynamic content
  setTimeout(applyExtremeOverride, 3000);
});

function applyExtremeOverride() {
  console.log('[ExtremeFix] Applying direct DOM override');
  
  // Fix for daily-practice-todo-list
  fixDailyPracticesList();
  
  // Fix for delights-input-container
  fixDelightsInputContainer();
}

function fixDailyPracticesList() {
  // Find the container
  const container = document.querySelector('.daily-practices-container');
  if (!container) {
    console.log('[ExtremeFix] Daily practices container not found');
    return;
  }
  
  // Get the original list and its content
  const originalList = container.querySelector('.daily-practice-todo-list');
  if (!originalList) {
    console.log('[ExtremeFix] Daily practice list not found');
    return;
  }
  
  // Check if already fixed
  if (originalList.hasAttribute('data-extreme-fixed')) {
    console.log('[ExtremeFix] Daily practice list already fixed');
    return;
  }
  
  console.log('[ExtremeFix] Fixing daily practice list');
  
  // Clone the inner content
  const innerContent = originalList.innerHTML;
  
  // Create the fixed version with explicit inline styles
  const fixedHTML = `
    <div class="daily-practice-todo-list" data-extreme-fixed="true" style="
      width: 100% !important;
      padding: 20px 10px !important;
      background: #FAF8EC !important;
      overflow: hidden !important;
      border-radius: 20px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-start !important;
      align-items: flex-start !important;
      gap: 10px !important;
      box-sizing: border-box !important;
      margin: 0 !important;
    ">
      ${innerContent}
    </div>
  `;
  
  // Replace the original with the fixed version
  originalList.outerHTML = fixedHTML;
  console.log('[ExtremeFix] Daily practice list fixed');
}

function fixDelightsInputContainer() {
  // Find the container
  const originalContainer = document.getElementById('delights-input-container');
  if (!originalContainer) {
    console.log('[ExtremeFix] Delights container not found');
    return;
  }
  
  // Check if already fixed
  if (originalContainer.hasAttribute('data-extreme-fixed')) {
    console.log('[ExtremeFix] Delights container already fixed');
    return;
  }
  
  console.log('[ExtremeFix] Fixing delights input container');
  
  // Clone the inner content
  const innerContent = originalContainer.innerHTML;
  const originalClasses = originalContainer.className;
  
  // Create fixed version with explicit inline styles
  const fixedHTML = `
    <div 
      id="delights-input-container" 
      class="${originalClasses}"
      data-testid="delights-input-container"
      aria-label="Enter a new delight"
      data-extreme-fixed="true"
      style="
        padding: 0 16px !important;
        background-color: #FFD400 !important;
        border: 2px solid white !important;
        box-sizing: border-box !important;
        position: fixed !important;
        bottom: 20px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: calc(100% - 40px) !important;
        max-width: 500px !important;
        border-radius: 50px !important;
        z-index: 1000 !important;
      "
    >
      ${innerContent}
    </div>
  `;
  
  // Replace the original with the fixed version
  originalContainer.outerHTML = fixedHTML;
  console.log('[ExtremeFix] Delights container fixed');
  
  // Reattach event listeners if needed (React should handle this via event delegation)
}

// Make it globally accessible
window.applyExtremeOverride = applyExtremeOverride;
