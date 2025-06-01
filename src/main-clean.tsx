import { createRoot } from 'react-dom/client'

// Simple test to verify React is working
function TestApp() {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      color: 'white', 
      padding: '50px', 
      textAlign: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎉 React Test - {new Date().toLocaleTimeString()}</h1>
      <p>If you see this, React is working correctly.</p>
      <p>Server running on port 5178</p>
      <button 
        onClick={() => alert('Button works!')}
        style={{
          background: 'white',
          color: '#764ba2',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        Test Click
      </button>
    </div>
  );
}

console.log('Starting React test...')
const rootElement = document.getElementById('root')
if (rootElement) {
  console.log('Root found, rendering test app...')
  const root = createRoot(rootElement)
  root.render(<TestApp />)
  console.log('Test app rendered!')
} else {
  console.error('No root element found!')
  document.body.innerHTML = '<div style="background: red; color: white; padding: 20px;">ROOT ELEMENT MISSING</div>'
}
