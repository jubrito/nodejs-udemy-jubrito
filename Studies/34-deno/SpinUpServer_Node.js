const http = require('http');

function callback (req, res) {
    const responseBody = "Hello World, Spinning up a server in Nodejs"
    res.end(responseBody);
}

const server = http.createServer(callback);

server.listen(3000);