// spacing-mutation-fix.js
// Enhanced: Logs all matches and applies styles to all matches on every mutation
(function() {
  const DAILY_SELECTOR = '.daily-practice-todo-list';
  const DELIGHTS_SELECTOR = '#delights-input-container';
  const applySpacing = el => {
    if (!el) return;
    el.style.padding = '16px';
    el.style.margin = '12px 0';
    el.style.gap = '8px';
    el.style.boxSizing = 'border-box';
    el.dataset.spacingFixed = 'true';
    console.log('[Spacing Mutation Fix] Applied to:', el);
  };

  function checkAndFix() {
    const dailyList = Array.from(document.querySelectorAll(DAILY_SELECTOR));
    const delightsList = Array.from(document.querySelectorAll(DELIGHTS_SELECTOR));
    console.log('[Spacing Mutation Fix] Checking DOM. Found:', {
      dailyList: dailyList.map(el => ({tag: el.tagName, class: el.className, id: el.id})),
      delightsList: delightsList.map(el => ({tag: el.tagName, class: el.className, id: el.id}))
    });
    dailyList.forEach(applySpacing);
    delightsList.forEach(applySpacing);
  }

  // Initial check
  checkAndFix();

  // Observe for DOM changes
  const observer = new MutationObserver(checkAndFix);
  observer.observe(document.body, { childList: true, subtree: true });

  // Also run on focus (for DevTools/inspect mode)
  window.addEventListener('focus', checkAndFix);
})();
