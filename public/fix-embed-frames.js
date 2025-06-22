/**
 * Fix Embed Frames Interactivity
 * This script ensures the 3D backgrounds in the Practices and Learn pages remain interactive
 */

(function() {
  function fixEmbedFrames() {
    // Find all embed iframes in the Learn pages (Practices page iframe removed to reduce server load)
    const embeds = document.querySelectorAll('[src*="spline.design"] iframe');
    
    embeds.forEach(iframe => {
      // Make sure iframe container has pointer-events-auto
      if (iframe.parentElement) {
        iframe.parentElement.style.pointerEvents = 'auto';
      }
      
      // Make sure iframe itself has pointer events
      iframe.style.pointerEvents = 'auto';
    });
  }
  
  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixEmbedFrames);
  } else {
    fixEmbedFrames();
  }
  
  // Run again when route changes (for SPAs)
  window.addEventListener('popstate', fixEmbedFrames);
  
  // Also run periodically to catch any delayed renders
  setInterval(fixEmbedFrames, 2000);
})();
