import fs from 'fs';
// const fs = require('fs');
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';


export const responseHandlerExportedDirectly_WithCallback = (req, res, next) => {
  fs.readFile('my-page.html', 'utf8', (err, data) => {
    res.send(data);
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const responseUsingGlobalVariables = (req, res, next) => {
  // res.sendFile('my-page.html') // triggers an error because path must be absolute
  res.sendFile(path.join(__dirname, 'my-page.html')) // It only work with commonJs, not with ES Modules (unless you create the __filename and __dirname consts on the top)
}

// module.exports = responseHandler;