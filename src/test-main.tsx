import { createRoot } from 'react-dom/client'

// Super minimal React test
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
      <h1>🎉 React is Working!</h1>
      <p>If you see this, React is rendering correctly.</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <button 
        onClick={() => alert('Button clicked!')}
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
        Test Button
      </button>
    </div>
  );
}

const rootElement = document.getElementById('root')
if (rootElement) {
  const root = createRoot(rootElement)
  root.render(<TestApp />)
}
