const fs = require('fs');

const responseHandler = (req, res, next) => {
    fs.readFile('my-page.html', 'utf8', (err, data) => {
      res.send(data);
    });
  }

module.exports = responseHandler;