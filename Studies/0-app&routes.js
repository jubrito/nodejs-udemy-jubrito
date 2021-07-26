// this file could also be named server.js
// file before separating the responsabilities into app.js and routes.js

const http = require('http');
const requestHandler = require('../routes');

// EVENT DRIVEN ARCHITECTURE (if x happens, do y)
function requestListenerThatWillExecutesForEveryIncomingRequest(request, response) {
    const reqURL = request.url;
    if (reqURL === '/') {
        response.write('<html>');
        response.write('<head><title>Enter Message</title></head>');
        response.write('<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">Send</button></body>');
        response.write('</html>');
        return response.end(); // sends the response to the client, in this case it is returning only to stop the execution but the return is not required
    }
    if (URL === '/message' && method == 'POST') {
        const requestBody = [];
        request.on('data', chunkOfData => { 
            console.log(chunkOfData);
            requestBody.push(chunkOfData);
        }); 
        return request.on('end', () => { 
            const parsedBodyFormDataAsString = Buffer.concat(requestBody).toString();
            console.log(parsedBodyFormDataAsString);
            const formContentTypedByUser = parsedBodyFormDataAsString.split('=')[1]; 
            fileSystemCoreModule.writeFile('message.txt', formContentTypedByUser, () => function callbackCalledAfterWeFinishedWorkingWithTheFile(error){
                console.log(error);
                response.statusCode = 302;
                response.setHeader('Location', '/');
            });
            return response.end();
        });
    }
    response.setHeader('Content-Type', 'text/html');
    const reqMethod = request.method;
    const reqHeaders = request.headers;
    response.write('<html>');
    response.write('<head><title>Enter Message</title></head>');
    response.write('<body><h1>Message</h1></body>');
    response.write('</html>');
    
    // process.exit();
}
const server = http.createServer(requestListenerThatWillExecutesForEveryIncomingRequest);
server.listen(8080);

/* You can export in multiple ways
module.exports = requestHandler;
// or
module.exports = {
    handler: requestHandler,
    someText: 'some text'
}
// or 
exports.handler = requestHandler; 
exports.someText = 'some text';
// exports is a shortcut for module.exports */