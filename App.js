import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import TherapistListing from './src/pages/TherapistListing_New';
import { BrowserRouter as Router } from 'react-router-dom';
import './src/styles/GlobalTypographyFix.css'; // Import global typography fix

// Error boundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    console.log('Error caught in ErrorBoundary:', error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorContainer}>
          <h2 style={styles.errorText}>Something went wrong</h2>
          <p>{this.state.error?.toString()}</p>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Main app content
const MainAppContent = () => (
  <Router>
    <TherapistListing />
  </Router>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log('App mounted, splash screen visible');
    
    const timer = setTimeout(() => {
      console.log('Timer expired, hiding splash screen');
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  console.log('App rendering, isLoading:', isLoading);
  
  return (
    <ErrorBoundary>
      {isLoading ? <SplashScreen /> : <MainAppContent />}
    </ErrorBoundary>
  );
};

const styles = {
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#FAF8EC',
    padding: '20px'
  },
  mainText: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  subText: {
    fontSize: '16px',
    color: '#333'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#ffdddd',
    padding: '20px'
  },
  errorText: {
    fontSize: '20px',
    color: 'red',
    marginBottom: '10px'
  }
};

export default App;
