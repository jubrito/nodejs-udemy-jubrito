import fs from 'fs/promises';
// const fs = require('fs').promises;

const responseHandlerWithExportDefault_WithPromises = (req, res, next) => {
    fs.readFile('my-page.html', 'utf8')
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log(err)
      });
  }

export default responseHandlerWithExportDefault_WithPromises;
// module.exports = responseHandler;