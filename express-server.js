// express-server.js
// Super simple Express server to serve static files
const express = require('express');
const path = require('path');
const app = express();

// Port to listen on
const PORT = 5175;

// Serve static files from project root
app.use(express.static(path.join(__dirname)));

// Also serve from public directory if it exists
app.use(express.static(path.join(__dirname, 'public')));

// Also serve from dist directory if it exists
app.use(express.static(path.join(__dirname, 'dist')));

// For client-side routing, send index.html for all other routes
app.get('*', (req, res) => {
  // Don't handle requests for files with extensions (like .js, .css, etc.)
  if (req.path.includes('.')) {
    return res.status(404).send('File not found');
  }
  
  // Try to send index.html from different possible locations
  const possibleLocations = [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'dist', 'index.html')
  ];
  
  // Try each location
  for (const location of possibleLocations) {
    try {
      if (require('fs').existsSync(location)) {
        return res.sendFile(location);
      }
    } catch (e) {}
  }
  
  // If no index.html was found, send a basic HTML response
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Website Access</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px; 
          line-height: 1.6;
        }
        .card {
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        h1 { color: #333; }
        a { color: #0066cc; }
        .btn {
          display: inline-block;
          background: #4a6bc8;
          color: white;
          padding: 10px 15px;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 5px 10px 0;
        }
      </style>
    </head>
    <body>
      <h1>Website Navigation</h1>
      <div class="card">
        <h2>Available Pages</h2>
        <p>Click one of the links below to access the website:</p>
        <p>
          <a href="/static-test.html" class="btn">Static Test Page</a>
          <a href="/react-test.html" class="btn">React Test Page</a>
          <a href="/demo-menu.html" class="btn">Demo Menu</a>
          <a href="/practitioner-onboarding-demo.html" class="btn">Practitioner Onboarding Demo</a>
        </p>
      </div>
      <div class="card">
        <h2>Server Info</h2>
        <p>This page is being served by a simple Express server on port ${PORT}.</p>
        <p>If you're still having trouble accessing your website, this server provides an alternative way to view your content.</p>
      </div>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Try accessing the following URLs:');
  console.log(`  - http://localhost:${PORT}/static-test.html`);
  console.log(`  - http://localhost:${PORT}/demo-menu.html`);
  console.log(`  - http://localhost:${PORT}/practitioner-onboarding-demo.html`);
});
