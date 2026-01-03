export default async function handler(req: any, res: any) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Simple health check
    if (req.url === '/api/ping' || req.url === '/ping') {
        res.status(200).json({
            message: 'pong',
            timestamp: new Date().toISOString()
        });
        return;
    }

    // Default response
    res.status(200).json({
        message: 'TechBlog API is running',
        path: req.url,
        method: req.method
    });
}
