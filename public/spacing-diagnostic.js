// spacing-diagnostic.js
// Enhanced: Logs all computed styles, class names, and parent info for .daily-practice-todo-list and #delights-input-container
(function() {
  function logAllStyles(context) {
    const daily = document.querySelector('.daily-practice-todo-list');
    const delights = document.querySelector('#delights-input-container');
    function dump(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const allStyles = {};
      for (let i = 0; i < cs.length; i++) {
        const prop = cs[i];
        allStyles[prop] = cs.getPropertyValue(prop);
      }
      return {
        tag: el.tagName,
        id: el.id,
        className: el.className,
        data: el.dataset,
        parent: el.parentElement ? {
          tag: el.parentElement.tagName,
          id: el.parentElement.id,
          className: el.parentElement.className
        } : null,
        allStyles
      };
    }
    console.log(`[Spacing Diagnostic - FULL] ${context}`);
    console.log('  .daily-practice-todo-list:', dump(daily));
    console.log('  #delights-input-container:', dump(delights));
  }

  // Log on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => logAllStyles('DOMContentLoaded + 100ms'), 100);
    setTimeout(() => logAllStyles('DOMContentLoaded + 1000ms'), 1000);
  });

  // Log on window load
  window.addEventListener('load', function() {
    setTimeout(() => logAllStyles('window.load + 100ms'), 100);
    setTimeout(() => logAllStyles('window.load + 1000ms'), 1000);
  });

  // Log on resize (DevTools open/close)
  window.addEventListener('resize', function() {
    logAllStyles('window.resize');
  });

  // Log on focus (when switching to inspect mode)
  window.addEventListener('focus', function() {
    logAllStyles('window.focus');
  });

  // Expose for manual debugging
  window.logAllSpacingNow = () => logAllStyles('manual');
})();
