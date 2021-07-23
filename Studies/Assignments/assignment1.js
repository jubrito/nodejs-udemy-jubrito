
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, resp) => {
    const url = req.url;
    const method = req.method;

    if (url == '/') {
        resp.write('<html>');
        resp.write('<head><title>Assignment 1</title></head>');
        resp.write('<body><h1>Home</h1><form action="/create-user" method="POST"><input type="text" name="username"/><button type="submit">Create user</button></body>');
        resp.write('</html>');
        return resp.end();
    }
    if (url == '/create-user' && method == 'POST') {
        const body = [];
        req.on('data', chunk => {
            body.push(chunk);
        }) 
        return req.on('end', () => {
            const parsedBodyAsString = Buffer.concat(body).toString();
            const username = parsedBodyAsString.split('=')[1];
            console.log(username)
            resp.statusCode = 302;
            resp.setHeader('Location', '/users');
            return resp.end();
        })
    }
    if (url == '/users') {
        console.log(users);
        resp.write('<html>');
        resp.write('<head><title>Assignment 1</title></head>');
        resp.write('<body><h1>Users</h1><ul>');
        resp.write('<li>User 1</li>');
        resp.write('</ul><body></body>');
        resp.write('</html>');
        return resp.end();
    }
})
server.listen(3000);
