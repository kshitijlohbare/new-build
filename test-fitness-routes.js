// This script will check if all our fitness group routes are accessible
// We'll use a GET request to check response codes
// Run this in the browser console

async function checkFitnessGroupRoutes() {
  const baseURL = window.location.origin;
  const routes = [
    '/fitness-groups',
    '/fitness',
    '/fitness-new',
    '/fitness-updated'
  ];
  
  console.log('Testing Fitness Group Routes:');
  
  for (const route of routes) {
    try {
      const response = await fetch(`${baseURL}${route}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html'
        },
        redirect: 'follow'
      });
      
      console.log(`Route ${route}: ${response.status} ${response.ok ? '✅' : '❌'}`);
    } catch (error) {
      console.error(`Error checking route ${route}:`, error);
    }
  }
  
  console.log('Test complete. Check browser navigation directly.');
  console.log('You can also manually navigate to each route to verify:');
  routes.forEach(route => console.log(`${baseURL}${route}`));
}

// Execute the test
checkFitnessGroupRoutes();
