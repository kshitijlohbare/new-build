
(function() {
    const TARGET_SELECTORS = ['.daily-practice-todo-list', '#delights-input-container'];
    const STYLES_TO_ENFORCE = {
        'padding': '20px',
        'margin': '10px 0',
        'gap': '15px'
    };

    let styleObserver;

    function applyStyles(element) {
        for (const property in STYLES_TO_ENFORCE) {
            element.style.setProperty(property, STYLES_TO_ENFORCE[property], 'important');
        }
    }

    function observeMutations() {
        const elements = document.querySelectorAll(TARGET_SELECTORS.join(', '));
        if (elements.length === 0) {
            // If elements are not found, try again after a short delay.
            setTimeout(observeMutations, 100);
            return;
        }

        if (styleObserver) {
            styleObserver.disconnect();
        }

        styleObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const element = mutation.target;
                    console.log('Style attribute changed on:', element, 'Re-applying styles.');
                    applyStyles(element);
                }
            }
        });

        elements.forEach(element => {
            applyStyles(element);
            styleObserver.observe(element, { attributes: true, attributeFilter: ['style'] });
        });
    }

    // Start observing as soon as the DOM is interactive.
    document.addEventListener('DOMContentLoaded', observeMutations);

    // Also, re-apply on window resize, as a fallback.
    window.addEventListener('resize', observeMutations);
})();
