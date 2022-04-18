
// const fs = require('fs');
const fs = require('fs').promises;

const fileName = 'node-message.txt';
const message = "This is a test with Node and should be stored in a file!";

// fs.writeFile(fileName, message, () => {
//     console.log("One crucial difference between Deno and Node is that in Node, write file does now not return a promise, but that instead we pass in this callback here to have some code that executes once this completes or that tells us about a potential error that could have occurred.")
//     console.log("If we added 'const fs = require('fs').promises' we would have the promise based version of the write file")
// })

fs
    .writeFile(fileName, message)
    .then(() => {
        console.log('Wrote file with Node using Promises');
        console.log("We now don't need to specify any permissions we wanna assign to that execution process (like we did with Deno). Instead by default as I mentioned before, node scripts, scripts executed with node by default, have full read and write access.")
    })

// Run this with node writeFile_node.js