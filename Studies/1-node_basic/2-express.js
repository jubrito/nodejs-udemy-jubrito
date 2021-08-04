const express = require('express');

const app = express();

/*  PARSE REQUEST BODY MIDDLEWARE
    You need to call it before the others middlewares because the parsing of
    the body should be done no matter where your request ends up.
    registers a middleware, calls nexts and parses the request body */
app.use(express.urlencoded({ extended: true }));

app.use('/add-product', (req, resp, next) => {
    return resp.send('<form action="/product" method="POST"><input type="text" name="title"/><button type="submit">Add project</button></form>'); // sets text/HTML as default
});

app.post('/product', (req, resp, next) => {
    console.log(req.body);
    return resp.redirect('/');
});

app.use('/', (req, resp, next) => {
    resp.send('<h1>Home :) <a href="/add-product">Add a product</a></h1>');
});

app.listen(8080); // short version of: const server = http.createServer(app); && server.listen(8080);