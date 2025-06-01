import { createRoot } from 'react-dom/client'
import './index.css'

// Error display component
function ShowError({ error }: { error: string }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      color: 'white',
      padding: '50px',
      textAlign: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🚨 App Error</h1>
      <pre style={{ 
        background: 'rgba(0,0,0,0.2)', 
        padding: '20px', 
        borderRadius: '5px', 
        marginTop: '20px',
        textAlign: 'left',
        overflow: 'auto'
      }}>
        {error}
      </pre>
      <button 
        onClick={() => window.location.reload()}
        style={{
          background: 'white',
          color: '#ee5a24',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        Reload Page
      </button>
    </div>
  )
}

console.log('Starting main.tsx - loading App with error handling...')

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = '<div style="background: red; color: white; padding: 20px;">ROOT ELEMENT NOT FOUND</div>'
} else {
  console.log('Root found, attempting to load App...')
  
  // Try to load and render the App
  import('./App.tsx')
    .then((AppModule) => {
      console.log('App module loaded successfully')
      const App = AppModule.default
      const root = createRoot(rootElement)
      
      try {
        root.render(<App />)
        console.log('App rendered successfully!')
      } catch (renderError) {
        console.error('Error rendering App:', renderError)
        const root2 = createRoot(rootElement)
        root2.render(<ShowError error={`Render Error: ${renderError}`} />)
      }
    })
    .catch((importError) => {
      console.error('Failed to import App:', importError)
      const root = createRoot(rootElement)
      root.render(<ShowError error={`Import Error: ${importError.message}\n\nStack: ${importError.stack}`} />)
    })
}
