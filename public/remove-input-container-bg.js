/**
 * Remove Delights Input Container Background
 * This script ensures the delights-input-container always has no background
 */

(function() {
  // Function to remove background from the input container
  function removeInputContainerBg() {
    const inputContainer = document.getElementById('delights-input-container');
    if (inputContainer) {
      inputContainer.style.backgroundColor = 'transparent';
      inputContainer.style.background = 'none';
    }
  }
  
  // Apply only once when the element appears
  const observer = new MutationObserver((mutations) => {
    const inputContainer = document.getElementById('delights-input-container');
    if (inputContainer) {
      removeInputContainerBg();
      // Once found and fixed, disconnect observer
      observer.disconnect();
    }
  });
  
  // Only observe the body for changes to reduce overhead
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial application
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeInputContainerBg);
  } else {
    removeInputContainerBg();
  }
})();
