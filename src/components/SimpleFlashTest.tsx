// Simple test version of the app that only shows flash screen
const SimpleFlashTest = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#3b5998',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      🌵 Flash Screen is Working! 🌵
      <div style={{
        position: 'absolute',
        bottom: '20px',
        fontSize: '16px',
        opacity: 0.8
      }}>
        This confirms the component can render properly
      </div>
    </div>
  );
};

export default SimpleFlashTest;
