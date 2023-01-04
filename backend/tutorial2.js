const express = require("express");
const app = express();
const port = 3000;

app.get("/", function(req, res){
    res.send("Hello world!\n");
})

app.listen(port, function(){
    console.log('Example app listening on port ${port}!');
});

