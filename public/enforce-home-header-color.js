/**
 * Enforce Home Header Color
 * This script ensures the home-header always has the correct background color
 */

(function() {
  // The color to enforce for home-header
  const HOME_HEADER_COLOR = '#FCDF4D';
  
  // Function to apply the color
  function enforceHomeHeaderColor() {
    const homeHeader = document.getElementById('home-header');
    if (homeHeader) {
      homeHeader.style.backgroundColor = HOME_HEADER_COLOR;
    }
  }
  
  // Apply only once at page load and once after a short delay
  // This covers most cases without the overhead of constant observation
  
  // Initial application
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      enforceHomeHeaderColor();
      // Apply once more after a delay to catch dynamically added elements
      setTimeout(enforceHomeHeaderColor, 1000);
    });
  } else {
    enforceHomeHeaderColor();
    // Apply once more after a delay to catch dynamically added elements
    setTimeout(enforceHomeHeaderColor, 1000);
  }
})();
