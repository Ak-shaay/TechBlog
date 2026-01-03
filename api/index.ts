import { createServer } from '../server/index';
import serverless from 'serverless-http';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = createServer();

// Path to the built static files (relative to current file in api folder)
const distPath = resolve(__dirname, '../dist/spa');

// Serve static files
app.use(express.static(distPath));

// Fallback to index.html for SPA (client-side routing)
// But let API requests fall through or return 404 if not matched by createServer routes
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
        return next();
    }
    res.sendFile(join(distPath, 'index.html'));
});

export default serverless(app);
