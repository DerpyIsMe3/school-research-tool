const http = require('http');
const https = require('https');
const URL = require('url');

const server = http.createServer((clientReq, clientRes) => {
    const parsedUrl = URL.parse(clientReq.url);
    const targetHost = parsedUrl.pathname.slice(1) || 'www.google.com';
    
    const options = {
        hostname: targetHost,
        port: 443,
        path: parsedUrl.search || '/',
        method: clientReq.method,
        headers: {
            ...clientReq.headers,
            host: targetHost
        }
    };

    const proxy = https.request(options, (res) => {
        clientRes.writeHead(res.statusCode, res.headers);
        res.pipe(clientRes, { end: true });
    });

    clientReq.pipe(proxy, { end: true });
    proxy.on('error', (e) => {
        clientRes.end('Proxy error: ' + e.message);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
    console.log('Use Codespaces port forwarding to access it');
});