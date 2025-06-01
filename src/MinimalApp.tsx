function MinimalApp() {
  console.log('MinimalApp rendering...');
  
  return (
    <div style={{ 
      padding: '50px', 
      backgroundColor: '#f0f0f0', 
      color: '#333', 
      fontSize: '24px' 
    }}>
      <h1>Minimal App Working!</h1>
      <p>React is rendering correctly.</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}

export default MinimalApp;
