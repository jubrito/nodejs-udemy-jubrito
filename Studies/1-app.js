const http = require('http');
const requestHandler = require('./1-routes');

const server = http.createServer(requestHandler);

server.listen(8080);
