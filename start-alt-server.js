// Start server on alternate port (5174)
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting server on port 5174...');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Installing dependencies first...');
  const install = spawn('npm', ['install'], { stdio: 'inherit' });
  
  install.on('close', (code) => {
    if (code !== 0) {
      console.error('Failed to install dependencies');
      process.exit(1);
    }
    startServer();
  });
} else {
  startServer();
}

function startServer() {
  // Set environment variable for the port
  const env = Object.assign({}, process.env);
  env.PORT = '5174';
  
  // Start vite
  const server = spawn('npx', ['vite', '--port', '5174', '--host'], { 
    stdio: 'inherit',
    env
  });
  
  server.on('error', (err) => {
    console.error('Failed to start server:', err);
  });
  
  console.log('Server should be available at http://localhost:5174');
}
