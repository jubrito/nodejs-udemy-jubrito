const http = require('http');

// EVENT DRIVEN ARCHITECTURE (if x happens, do y)
function requestListenerThatWillExecutesForEveryIncomingRequest(request, response) {
    const reqURL = request.url;
    const reqMethod = request.method;
    const reqHeaders = request.headers;

    response.setHeader('Content-Type', 'text/html');
    response.write('<html></html>');
    response.end(); // sends the response to the client
    // process.exit();
}
const server = http.createServer(requestListenerThatWillExecutesForEveryIncomingRequest);
server.listen(8080);

