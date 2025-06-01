import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

console.log('Starting main.tsx - loading original App...')

// Initialize the app
try {
  const root = document.getElementById('root');
  
  if (!root) {
    throw new Error('Root element not found');
  }
  
  // Hide the fallback immediately
  const fallback = document.getElementById('fallback');
  if (fallback) {
    fallback.style.display = 'none';
  }
  
  // Render the main app
  const reactRoot = createRoot(root);
  reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('App rendered successfully!');
} catch (error) {
  console.error('Error rendering App:', error);
  
  // Display error in the DOM
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : '';
  
  document.body.innerHTML = `
    <div style="background: #f56565; color: white; padding: 50px; font-family: Arial, sans-serif; text-align: center;">
      <h1>Something went wrong</h1>
      <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 5px; margin: 20px auto; max-width: 800px; text-align: left; overflow: auto;">
        <p><strong>Error:</strong> ${errorMessage}</p>
        <pre style="margin-top: 20px; white-space: pre-wrap;">${errorStack}</pre>
      </div>
      <button onclick="location.reload()" style="background: white; color: #f56565; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 20px;">
        Reload Page
      </button>
    </div>
  `;
}
