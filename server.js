// server.js - Simple express server for handling client-side routing
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5180;

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// For all other routes, serve index.html (client-side routing)
app.get('/*', (req, res) => {
  // Don't rewrite requests for static files
  if (req.url.includes('.')) {
    res.sendStatus(404);
    return;
  }
  
  // Try to send index.html from different possible locations
  const possibleLocations = [
    path.join(__dirname, 'dist', 'index.html'),
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'public', 'index.html')
  ];
  
  // Try each location
  for (const location of possibleLocations) {
    try {
      // Check if file exists before sending
      if (fs.existsSync(location)) {
        return res.sendFile(location);
      }
    } catch (e) {
      console.error(`Error checking ${location}:`, e);
    }
  }
  
  // Send index.html for all routes
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('All routes will now work, including direct access to /practitioner-onboarding');
});
