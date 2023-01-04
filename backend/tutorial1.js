const http = require("http");

const hostname = "127.0.0.1";

const port = 8000;

//Create HTTP Server
const server = http.createServer(function(req, res){
    //Set the response HTTP header with HTTP status and Content type
    res.writeHead(200, { "Content-Type":"text/plain"});

    //Send the response body 
    res.end("Hello world\n");
});

//Prints a log once the server starts listening
server.listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
})