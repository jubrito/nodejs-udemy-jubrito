const path = require('path');

// refers to the main module you started the application (app.js)
// gives the path to the file responsible for running the application
module.exports = path.dirname(require.main.filename);