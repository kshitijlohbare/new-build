/**
 * Simple development server script for React SPA with proper routing
 * Fallback to static file serving if Vite server fails
 */
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 5174;

// Start the express server
const app = express();

// Serve static files
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes for SPA
app.get('*', (req, res) => {
  // Don't rewrite requests for static files
  if (req.path.includes('.')) {
    return res.status(404).send('File not found');
  }
  
  // Send index.html for all routes
  const indexPath = path.join(__dirname, 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading index.html:', err);
      return res.status(500).send('Error reading index.html');
    }
    res.send(data);
  });
});

// Start express server
const server = app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});

// Try to start Vite dev server as well
console.log('Starting Vite dev server...');
const vite = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  server.close();
  vite.kill();
  process.exit(0);
});
