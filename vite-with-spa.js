// Vite dev server with proper SPA support
import { createServer } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const server = await createServer({
    // Vite options are read from vite.config.js
    configFile: path.resolve(__dirname, 'vite.config.js'),
    root: process.cwd(),
    server: {
      port: 5173,
      middlewareMode: false,
      fs: {
        strict: true,
      }
    }
  });
  
  // Add custom middleware to handle SPA routing
  server.middlewares.use((req, res, next) => {
    // Check if the request is for a static file
    const isStaticFile = /\.(?:css|js|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(req.url);
    
    // If it's a static file, let Vite handle it
    if (isStaticFile) {
      next();
      return;
    }
    
    // If it's an API request, let it pass through
    if (req.url.startsWith('/api')) {
      next();
      return;
    }
    
    // Handle HTML requests with the index.html file for SPA routing
    if (req.method === 'GET' && !req.url.includes('.')) {
      console.log(`SPA route requested: ${req.url}`);
      // Send the index.html file for all non-file routes to enable client-side routing
      const indexPath = path.join(__dirname, 'index.html');
      
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf8');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(html);
        return;
      }
    }
    
    next();
  });
  
  await server.listen();
  
  const info = server.config.logger.info;
  
  info(`\n  SPA-enabled Vite server running at:\n`);
  server.printUrls();
  info(`  All routes will be handled by the React Router\n`);
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
