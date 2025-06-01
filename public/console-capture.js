// Console log capture script
(function() {
    console.log('=== CONSOLE CAPTURE STARTED ===');
    
    // Capture all console logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    let logs = [];
    
    console.log = function(...args) {
        logs.push({ type: 'log', args: args, timestamp: new Date().toISOString() });
        originalLog.apply(console, args);
        
        // Display logs in the DOM
        updateLogDisplay();
    };
    
    console.error = function(...args) {
        logs.push({ type: 'error', args: args, timestamp: new Date().toISOString() });
        originalError.apply(console, args);
        updateLogDisplay();
    };
    
    console.warn = function(...args) {
        logs.push({ type: 'warn', args: args, timestamp: new Date().toISOString() });
        originalWarn.apply(console, args);
        updateLogDisplay();
    };
    
    function updateLogDisplay() {
        let logDiv = document.getElementById('console-logs');
        if (!logDiv) {
            logDiv = document.createElement('div');
            logDiv.id = 'console-logs';
            logDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                width: 400px;
                max-height: 600px;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                overflow-y: auto;
                z-index: 10000;
                font-family: monospace;
            `;
            document.body.appendChild(logDiv);
            
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'X';
            closeBtn.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                background: red;
                color: white;
                border: none;
                width: 20px;
                height: 20px;
                border-radius: 3px;
                cursor: pointer;
            `;
            closeBtn.onclick = () => logDiv.remove();
            logDiv.appendChild(closeBtn);
        }
        
        // Show last 20 logs
        const recentLogs = logs.slice(-20);
        logDiv.innerHTML = '<button style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; width: 20px; height: 20px; border-radius: 3px; cursor: pointer;" onclick="this.parentElement.remove()">X</button>' +
            '<h4 style="margin: 0 0 10px 0; color: #4CAF50;">Console Logs</h4>' +
            recentLogs.map(log => {
                const color = log.type === 'error' ? '#ff6b6b' : log.type === 'warn' ? '#ffa726' : '#fff';
                const content = log.args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                return `<div style="color: ${color}; margin-bottom: 5px; word-break: break-all;">
                    <small>[${log.timestamp.split('T')[1].split('.')[0]}]</small> ${content}
                </div>`;
            }).join('');
    }
    
    // Initial display
    setTimeout(() => {
        updateLogDisplay();
        console.log('Console capture is active. Logs will appear in the overlay.');
    }, 1000);
})();
