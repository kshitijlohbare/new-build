import React, { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [animationState, setAnimationState] = useState({
    logoOpacity: 0,
    logoScale: 0.8,
    textOpacity: 0,
    progressWidth: 0
  });

  useEffect(() => {
    // Logo animation
    setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        logoOpacity: 1,
        logoScale: 1
      }));
    }, 100);

    // Text fade in
    setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        textOpacity: 1
      }));
    }, 1000);

    // Progress bar
    setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        progressWidth: '100%'
      }));
    }, 1500);

    console.log('SplashScreen component mounted');
    return () => console.log('SplashScreen component unmounting');
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <img 
          src="/assets/logo.png"
          alt="Logo"
          style={{
            ...styles.logo,
            opacity: animationState.logoOpacity,
            transform: `scale(${animationState.logoScale})`
          }}
        />
        <div 
          style={{
            ...styles.loadingText,
            opacity: animationState.textOpacity
          }}
        >
          Loading...
        </div>
        <div style={styles.progressBarContainer}>
          <div 
            style={{
              ...styles.progressBar,
              width: animationState.progressWidth
            }}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    zIndex: 9999,
    transition: 'opacity 0.5s ease'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '150px',
    height: '150px',
    marginBottom: '30px',
    transition: 'opacity 1s ease, transform 1s ease'
  },
  loadingText: {
    fontSize: '24px',
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: '20px',
    transition: 'opacity 1s ease'
  },
  progressBarContainer: {
    width: '250px',
    height: '6px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '10px'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    transition: 'width 2s ease-in-out'
  }
};

export default SplashScreen;
