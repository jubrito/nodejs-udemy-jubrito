import fs from 'fs';
// const fs = require('fs');

export const responseHandlerExportedDirectly = (req, res, next) => {
    fs.readFile('my-page.html', 'utf8', (err, data) => {
      res.send(data);
    });
  }

// module.exports = responseHandler;