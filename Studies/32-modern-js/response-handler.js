import fs from 'fs';
// const fs = require('fs');

const responseHandlerWithExportDefault = (req, res, next) => {
    fs.readFile('my-page.html', 'utf8', (err, data) => {
      res.send(data);
    });
  }

export default responseHandlerWithExportDefault;
// module.exports = responseHandler;