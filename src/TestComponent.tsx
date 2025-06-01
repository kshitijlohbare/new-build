import React from 'react';

const TestComponent: React.FC = () => {
  console.log('TestComponent rendered successfully');
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#ff0000', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 9999,
      fontSize: '24px'
    }}>
      <div>
        <h1>TEST COMPONENT WORKING</h1>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
        <p>Location: {window.location.pathname}</p>
      </div>
    </div>
  );
};

export default TestComponent;
