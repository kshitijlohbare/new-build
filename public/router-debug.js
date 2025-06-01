// To inject this in browser console for debugging React Router
console.log('Debugging React Router...');

// Find React Router instances
const findReactRouter = () => {
  // Check global history object
  if (window.__REACT_ROUTER_GLOBAL_HISTORY__) {
    console.log('Found React Router global history:', window.__REACT_ROUTER_GLOBAL_HISTORY__);
  } else {
    console.log('No global React Router history found');
  }
  
  // Check React DevTools
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('React DevTools hook found, may be able to inspect routers');
  }
  
  // Check current route
  console.log('Current location:', window.location.pathname);
  
  // Try to find React instances
  const rootNode = document.getElementById('root');
  if (!rootNode) {
    console.error('No root node found!');
    return;
  }
  
  console.log('Root node:', rootNode);
  console.log('Root children count:', rootNode.childNodes.length);
  
  // Check if there's any content in the root
  if (rootNode.innerHTML.trim() === '') {
    console.error('Root is empty! React may not be rendering');
  }
};

// Test navigation with fallbacks
const testNavigation = (route) => {
  const routePath = route || '/practitioner/1';
  console.log(`Testing navigation to ${routePath}...`);
  
  // Try different navigation methods
  try {
    console.log('Method 1: window.location.href');
    window.location.href = routePath;
  } catch (e) {
    console.error('Error with window.location.href:', e);
    
    try {
      console.log('Method 2: window.location.assign');
      window.location.assign(routePath);
    } catch (e2) {
      console.error('Error with window.location.assign:', e2);
      
      try {
        console.log('Method 3: creating and clicking anchor');
        const a = document.createElement('a');
        a.href = routePath;
        a.click();
      } catch (e3) {
        console.error('All navigation methods failed');
      }
    }
  }
};

// Test if router is working
findReactRouter();

// Expose debugging functions
window.debugRouter = {
  testNavigation,
  findReactRouter
};
