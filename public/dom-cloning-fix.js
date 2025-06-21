
(function() {
    const TARGET_SELECTOR_1 = '.daily-practice-todo-list';
    const TARGET_SELECTOR_2 = '#delights-input-container';
    const STYLES_TO_APPLY = {
        'padding': '20px !important',
        'margin': '15px !important',
        'gap': '10px !important'
    };

    let fixApplied = false;
    let attempts = 0;
    const maxAttempts = 100; // Try for 10 seconds

    function applyStyles(element, selector) {
        if (!element || element.getAttribute('data-style-fixed')) {
            return;
        }

        console.log(`Attempting to clone and replace ${selector}`);
        const clone = element.cloneNode(true);

        let styleString = '';
        for (const property in STYLES_TO_APPLY) {
            styleString += `${property}: ${STYLES_TO_APPLY[property]}; `;
        }

        clone.setAttribute('style', styleString);
        clone.setAttribute('data-style-fixed', 'true');

        if (element.parentNode) {
            element.parentNode.replaceChild(clone, element);
            console.log(`Successfully cloned and replaced ${selector}`);
            return true;
        } else {
            console.log(`Failed to replace ${selector} because it has no parentNode.`);
            return false;
        }
    }

    const intervalId = setInterval(() => {
        attempts++;
        const element1 = document.querySelector(TARGET_SELECTOR_1);
        const element2 = document.querySelector(TARGET_SELECTOR_2);

        let allFixed = true;

        if (element1) {
            if (!element1.getAttribute('data-style-fixed')) {
                if (!applyStyles(element1, TARGET_SELECTOR_1)) {
                    allFixed = false;
                }
            }
        } else {
            allFixed = false;
        }

        if (element2) {
            if (!element2.getAttribute('data-style-fixed')) {
                if (!applyStyles(element2, TARGET_SELECTOR_2)) {
                    allFixed = false;
                }
            }
        } else {
            allFixed = false;
        }

        if (allFixed) {
            console.log('Both elements have been fixed. Stopping checks.');
            fixApplied = true;
            clearInterval(intervalId);
        }

        if (attempts >= maxAttempts && !fixApplied) {
            console.log('Could not fix elements after 10 seconds. Stopping checks.');
            clearInterval(intervalId);
        }
    }, 100);
})();
