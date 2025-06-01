// Console Monitor Script for TherapistListing Debug
// This script automatically captures and displays console output

(function() {
    console.log('=== THERAPIST LISTING DEBUG MONITOR STARTED ===');
    
    // Create a debug output container
    const debugContainer = document.createElement('div');
    debugContainer.id = 'debug-output';
    debugContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 600px;
        max-height: 400px;
        background: #000;
        color: #00ff00;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border: 2px solid #00ff00;
        z-index: 9999;
        overflow-y: auto;
        white-space: pre-wrap;
    `;
    
    let logCount = 0;
    
    // Store original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    function addToDebug(message, type = 'log') {
        logCount++;
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${logCount}] [${timestamp}] ${type.toUpperCase()}: `;
        
        const logLine = prefix + (typeof message === 'object' ? JSON.stringify(message, null, 2) : message);
        debugContainer.textContent += logLine + '\n';
        debugContainer.scrollTop = debugContainer.scrollHeight;
        
        // Keep only last 50 messages
        const lines = debugContainer.textContent.split('\n');
        if (lines.length > 50) {
            debugContainer.textContent = lines.slice(-50).join('\n');
        }
    }
    
    // Override console methods
    console.log = function(...args) {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        addToDebug(message, 'log');
        originalLog.apply(console, args);
    };
    
    console.error = function(...args) {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        addToDebug(message, 'error');
        originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        addToDebug(message, 'warn');
        originalWarn.apply(console, args);
    };
    
    // Add container to page
    document.body.appendChild(debugContainer);
    
    // Add control buttons
    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
        position: fixed;
        top: 420px;
        right: 10px;
        background: #333;
        padding: 5px;
        z-index: 10000;
    `;
    
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.style.cssText = 'margin-right: 5px; background: #ff4444; color: white; border: none; padding: 5px;';
    clearBtn.onclick = () => {
        debugContainer.textContent = '';
        logCount = 0;
    };
    
    const hideBtn = document.createElement('button');
    hideBtn.textContent = 'Hide';
    hideBtn.style.cssText = 'margin-right: 5px; background: #4444ff; color: white; border: none; padding: 5px;';
    hideBtn.onclick = () => {
        debugContainer.style.display = debugContainer.style.display === 'none' ? 'block' : 'none';
        hideBtn.textContent = debugContainer.style.display === 'none' ? 'Show' : 'Hide';
    };
    
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Refresh';
    refreshBtn.style.cssText = 'background: #44ff44; color: black; border: none; padding: 5px;';
    refreshBtn.onclick = () => window.location.reload();
    
    controlPanel.appendChild(clearBtn);
    controlPanel.appendChild(hideBtn);
    controlPanel.appendChild(refreshBtn);
    document.body.appendChild(controlPanel);
    
    addToDebug('Debug monitor initialized. Watching console output...', 'system');
    
    // Capture any existing errors
    window.addEventListener('error', (e) => {
        addToDebug(`JavaScript Error: ${e.message} at ${e.filename}:${e.lineno}`, 'error');
    });
    
    // Try to trigger component re-render by dispatching a custom event
    setTimeout(() => {
        addToDebug('Attempting to trigger component debug...', 'system');
        const event = new CustomEvent('debug-trigger', { detail: { source: 'debug-monitor' } });
        window.dispatchEvent(event);
    }, 1000);
    
})();
