import { createRoot } from 'react-dom/client'
import App from './App-simplified'
import './index.css'

console.log('Starting main.tsx - simple and direct...')

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = '<div style="background: red; color: white; padding: 20px; font-size: 24px;">ROOT ELEMENT NOT FOUND</div>'
} else {
  console.log('Root found, creating and rendering App...')
  
  try {
    const root = createRoot(rootElement)
    root.render(<App />)
    console.log('App rendered successfully!')
  } catch (error) {
    console.error('Error rendering App:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    document.body.innerHTML = `
      <div style="background: #ff6b6b; color: white; padding: 50px; font-family: Arial;">
        <h1>🚨 Render Error</h1>
        <pre style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 5px; margin-top: 20px;">
          ${errorMessage}
          
          ${errorStack}
        </pre>
        <button onclick="location.reload()" style="background: white; color: #ff6b6b; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 20px;">
          Reload Page
        </button>
      </div>
    `
  }
}
