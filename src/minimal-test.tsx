import { createRoot } from 'react-dom/client'

console.log('=== MINIMAL TEST START ===')

function SimpleApp() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '50px',
      textAlign: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎉 React is Working!</h1>
      <p>This is a minimal test app</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
} else {
  console.log('Root found, rendering simple app...')
  const root = createRoot(rootElement)
  root.render(<SimpleApp />)
  console.log('Simple app rendered!')
}
