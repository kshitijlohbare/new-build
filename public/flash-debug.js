// Flash Screen Debug Script
console.log('🔍 Flash Screen Debug Script Loading...');

// Check if React is available
console.log('React available:', typeof React !== 'undefined');

// Check if the flash screen container exists
const checkFlashScreen = () => {
    const flashContainer = document.querySelector('.flash-screen__container');
    console.log('Flash screen container found:', !!flashContainer);
    
    if (flashContainer) {
        const styles = window.getComputedStyle(flashContainer);
        console.log('Flash screen styles:', {
            position: styles.position,
            zIndex: styles.zIndex,
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            backgroundColor: styles.backgroundColor
        });
    }
    
    // Check for any error messages
    const errorElements = document.querySelectorAll('[class*="error"], [id*="error"]');
    if (errorElements.length > 0) {
        console.log('Error elements found:', errorElements);
    }
    
    // Check console for errors
    const originalError = console.error;
    console.error = function(...args) {
        console.log('🚨 Console Error detected:', args);
        originalError.apply(console, args);
    };
};

// Check immediately and after a delay
checkFlashScreen();
setTimeout(checkFlashScreen, 1000);
setTimeout(checkFlashScreen, 3000);

// Monitor for DOM changes
const observer = new MutationObserver(() => {
    console.log('🔄 DOM changed, checking flash screen...');
    checkFlashScreen();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('🔍 Flash Screen Debug Script Loaded');
