// simple-server.js
// Ultra simple Express server to serve static files with no fancy routes
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5181;

// Serve static files from various directories
app.use(express.static(__dirname)); // Root directory
app.use(express.static(path.join(__dirname, 'public'))); // public directory
app.use(express.static(path.join(__dirname, 'dist'))); // dist directory

// Basic index route handler
app.get('/', (req, res) => {
  // Try to find an index.html file
  const possibleIndexFiles = [
    path.join(__dirname, 'dist', 'index.html'),
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'public', 'index.html')
  ];
  
  for (const file of possibleIndexFiles) {
    if (fs.existsSync(file)) {
      return res.sendFile(file);
    }
  }
  
  // If no index.html found, send a basic response
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Simple Server</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; }
        .btn { display: inline-block; background: #4285f4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <h1>Simple Server Running</h1>
      <p>This server is running at <a href="http://localhost:${PORT}">http://localhost:${PORT}</a></p>
      <div>
        <a href="/static-test.html" class="btn">Static Test</a>
        <a href="/react-test.html" class="btn">React Test</a>
        <a href="/fallback-index.html" class="btn">Fallback Index</a>
        <a href="/demo-menu.html" class="btn">Demo Menu</a>
      </div>
    </body>
    </html>
  `);
});

// Special route for practitioner onboarding
app.get('/practitioner-onboarding', (req, res) => {
  // Try to send the practitioner onboarding demo first
  const demoPath = path.join(__dirname, 'public', 'practitioner-onboarding-demo.html');
  if (fs.existsSync(demoPath)) {
    return res.sendFile(demoPath);
  }
  
  // Otherwise redirect to index
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Simple server running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log(`  - http://localhost:${PORT}/`);
  console.log(`  - http://localhost:${PORT}/practitioner-onboarding`);
  console.log(`  - http://localhost:${PORT}/static-test.html`);
  console.log(`  - http://localhost:${PORT}/react-test.html`);
});
