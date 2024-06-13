const { createServer } = require('http');
const url = require('url');
const https = require('https'); // Use https module for making requests to SerpApi
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;
const API_KEY = '6fb7584ed415667820243bc0fca647ce1365dd67151f9681a585f152c455b66c'; // Replace with your actual SerpApi API key

const server = createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'GET' && parsedUrl.pathname === '/search') {
    // Handle CORS headers for the search endpoint
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow GET, POST requests
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow relevant headers

    // Extract query parameters
    const { q, location } = parsedUrl.query;

    // Construct SerpApi request URL
    const apiUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&location=${encodeURIComponent(location)}&google_domain=google.com&gl=us&hl=en&api_key=${API_KEY}`;

    // Make a request to SerpApi
    https.get(apiUrl, (apiRes) => {
      let data = '';

      // A chunk of data has been received.
      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      apiRes.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    }).on('error', (error) => {
      console.error('Error making request to SerpApi:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    });

  } else if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
    serveFile(res, 'index.html', 'text/html');
  } else if (parsedUrl.pathname === '/assets/script.js') {
    serveFile(res, 'assets/script.js', 'application/javascript');
  } else if (parsedUrl.pathname.startsWith('/assets/') && parsedUrl.pathname.endsWith('.css')) {
    serveFile(res, parsedUrl.pathname.substring(1), 'text/css');
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

function serveFile(res, filename, contentType) {
  const filePath = path.join(__dirname, filename);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});