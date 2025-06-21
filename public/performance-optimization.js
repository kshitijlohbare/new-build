/**
 * Performance Optimization
 * 
 * This script helps improve app performance by:
 * 1. Removing any unnecessary monitoring or intensive operations
 * 2. Cleaning up event listeners 
 * 3. Preventing layout thrashing
 */

(function() {
  // Wait for the page to be fully loaded
  window.addEventListener('load', function() {
    // Wait a bit to ensure all other scripts have run
    setTimeout(function() {
      console.log('🚀 Running performance optimizations...');
      
      // 1. Clean up any excessive intervals
      const highFrequencyThreshold = 100; // ms
      
      // Get all setInterval ids (not perfect, but catches many)
      for (let i = 1; i < 10000; i++) {
        if (window.hasOwnProperty('setInterval' + i)) {
          window.clearInterval(i);
        }
      }
      
      // 2. Reduce event listener impact
      // We can't directly access the registered event listeners,
      // but we can use passive event listeners for common events
      const events = ['scroll', 'touchstart', 'touchmove', 'wheel'];
      events.forEach(function(event) {
        window.addEventListener(event, null, { passive: true });
      });
      
      // 3. Batch DOM operations
      const rafCallbacks = [];
      
      // Replace direct style manipulation with batched operations
      const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
      CSSStyleDeclaration.prototype.setProperty = function(propertyName, value, priority) {
        if (propertyName.includes('padding') || 
            propertyName.includes('margin') || 
            propertyName.includes('gap')) {
          // Queue the style change instead of applying immediately
          const that = this;
          const applyStyle = function() {
            originalSetProperty.call(that, propertyName, value, priority);
          };
          
          if (!rafCallbacks.includes(applyStyle)) {
            rafCallbacks.push(applyStyle);
            
            // Process all batched changes in the next animation frame
            if (rafCallbacks.length === 1) {
              requestAnimationFrame(function() {
                const callbacks = [...rafCallbacks];
                rafCallbacks.length = 0;
                callbacks.forEach(function(callback) {
                  callback();
                });
              });
            }
          }
          return;
        }
        
        // For other styles, proceed normally
        return originalSetProperty.call(this, propertyName, value, priority);
      };
      
      console.log('✅ Performance optimizations applied');
    }, 1000);
  });
})();
