import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/tailwind-utilities.css'; // Import Tailwind and custom utilities first
import './index.css'; // CSS with timestamp will be handled in the build
import './styles/GlobalTypographyFix.css'; // Ensure typography fix is always applied
import './styles/EssentialSpacingFix.css'; // Simple, lightweight spacing fix
import './styles/homeHeader.css'; // Ensure home header has the correct background color
import './styles/sidebar.css'; // Add blur effect to sidebar

// Simple favicon injector (acts as a fallback if public/favicon.ico is missing or not picked up)
const injectFavicon = () => {
  const faviconUrl = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🌵</text></svg>';
  let link = document.querySelector('link[rel="icon"]');
  
  if (link && link.getAttribute('href') === '/favicon.ico') {
    // If index.html already specifies /favicon.ico, let the browser handle it.
    // The physical file in public/ should be served.
    // This JS injection will only override if the href is different or link is missing.
    const currentHref = link.getAttribute('href');
    if (currentHref !== faviconUrl && currentHref === '/favicon.ico' && !document.querySelector('[href="/favicon.ico"]')) {
        // This case is unlikely if index.html is correct.
        // We only intervene if the default /favicon.ico is not being found or needs override.
    } else if (!link) {
        const newLink = document.createElement('link');
        newLink.setAttribute('rel', 'icon');
        document.head.appendChild(newLink);
        newLink.setAttribute('href', faviconUrl);
    } else if (link.getAttribute('href') !== faviconUrl) {
        // If an icon link exists but is not our desired one (and not the default /favicon.ico)
        // This part is more aggressive and might not be needed if public/favicon.ico is working.
        // For now, let's simplify: if a link exists, assume it's handled or will be by public/favicon.ico
    }
  } else if (!link) { // If no link tag for icon at all
    const newLink = document.createElement('link');
    newLink.setAttribute('rel', 'icon');
    newLink.setAttribute('href', faviconUrl); // Default to data URI if nothing else
    document.head.appendChild(newLink);
  }
};

// Error handlers
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Inject favicon (best effort)
injectFavicon();

// Add inspector-changes script to fix alignment
const scriptTag = document.createElement('script');
scriptTag.src = '/inspector-changes.js';
scriptTag.defer = true;
document.head.appendChild(scriptTag);

// More efficient script loading - combine into a single load function
// This avoids creating multiple script elements simultaneously
interface ScriptInfo {
  src: string;
}

const loadScripts = (scripts: ScriptInfo[]) => {
  let index = 0;
  
  const loadNextScript = () => {
    if (index >= scripts.length) return;
    
    const scriptInfo = scripts[index++];
    const scriptTag = document.createElement('script');
    scriptTag.src = scriptInfo.src;
    scriptTag.defer = true;
    
    // Load scripts sequentially to prevent performance issues
    scriptTag.onload = loadNextScript;
    scriptTag.onerror = loadNextScript; // Continue even if one fails
    
    document.head.appendChild(scriptTag);
  };
  
  // Start loading scripts sequentially
  loadNextScript();
};

// All header and container background styles are now handled by CSS - no scripts needed
loadScripts([
  // Removed '/public/remove-welcome-header-bg.js' - handled by CSS
  // Removed '/header-gradient-update.js' - handled by CSS
  // Removed '/enforce-home-header-color.js' - handled by CSS
  // Removed '/remove-input-container-bg.js' - handled by CSS
]);

// Simple render with error handling
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1 style="color: #FF5A5A;">Something went wrong</h1>
      <p>${String(error)}</p>
      <button onclick="location.reload()">Reload Application</button>
    </div>
  `;
}
