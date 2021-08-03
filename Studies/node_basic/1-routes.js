const fileSystemCoreModule = require('fs');

const requestHandler = (request, response) => {
    const URL = request.url;
    const method = request.method;

    if (URL === '/') {
        response.write('<html>');
        response.write('<head><title>Enter Message</title></head>');
        response.write('<body><form action="/message" method="POST"><input type="text"/ name="message"><button type="submit">Send</button></body>');
        response.write('</html>');
        return response.end(); 
    }
    if (URL === '/message' && method == 'POST') {
        const requestBody = [];
        request.on('data', chunkOfData => { 
            console.log(chunkOfData);
            requestBody.push(chunkOfData);
        }); 
        return request.on('end', () => { 
            const parsedBodyFormDataAsString = Buffer.concat(requestBody).toString();
            console.log(parsedBodyFormDataAsString);
            const formContentTypedByUser = parsedBodyFormDataAsString.split('=')[1]; 
            fileSystemCoreModule.writeFile('message.txt', formContentTypedByUser, () => function callbackCalledAfterWeFinishedWorkingWithTheFile(error){
                console.log(error);
                response.statusCode = 302;
                response.setHeader('Location', '/');
            });
            return response.end();
            
        });
    }
    response.setHeader('Content-Type', 'text/html');
    response.write('<html>');
    response.write('<head><title>Enter Message</title></head>');
    response.write('<body><h1>Message</h1></body>');
    response.write('</html>');
    response.end();
}

module.exports = requestHandler;