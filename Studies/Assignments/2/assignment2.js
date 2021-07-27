const express = require('express');

const app = express();

// app.use('/', (req, resp, next) => {
//     console.log('first middleware');
//     next();
// });

// app.use('/', (req, resp, next) => {
//     console.log('second middleware');
//     next();
// });

// app.use('/', (req, resp, next) => {
//     resp.send('<h1>Response sent!</h1>');
// });

app.use('/users', (req, resp, next) => {
    resp.send('Dummy user response if you access users (/users), now check <a href="/">home</a>')
})

app.use('/', (req, resp, next) => {
    resp.send('Dummy user response if you access home (/), now check <a href="/users">/users</a>')
})


app.listen(8080);