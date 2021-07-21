const fs = require('fs');

function writeAFileToTheHardDrive(fileName, fileContent) {
    fs.writeFileSync(fileName, fileContent); 
}

writeAFileToTheHardDrive('hello.txt', 'Hello Node.js')