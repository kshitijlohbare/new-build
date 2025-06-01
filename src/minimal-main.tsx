// Super minimal React app - no dependencies
// @ts-ignore - React is needed for JSX
import React from 'react'
import { createRoot } from 'react-dom/client'

// The simplest possible app
function MinimalApp() {
  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#333' }}>Minimal React App</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ marginTop: '2rem' }}>
        <button 
          onClick={() => alert('React events are working!')}
          style={{
            background: '#4b6cb7',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Click Me
        </button>
      </div>
    </div>
  )
}

// Direct rendering with minimal code
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found')
} else {
  try {
    // Hide the fallback immediately to prevent flicker
    const fallbackEl = document.getElementById('fallback')
    if (fallbackEl) {
      fallbackEl.style.display = 'none'
    }
    
    // Render directly without any dependencies or complex logic
    const root = createRoot(rootElement)
    root.render(<MinimalApp />)
    console.log('MinimalApp rendered successfully')
  } catch (error) {
    console.error('Error rendering minimal app:', error)
    // Show fallback if render fails
    const fallbackEl = document.getElementById('fallback')
    if (fallbackEl) {
      fallbackEl.style.display = 'flex'
    }
  }
}
