var express = require('express');
// var path = require('path');
var serveStatic = require('serve-static');
var app = express();
app.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 5000;
app.listen(port);
/*eslint no-console: "error"*/
console.log('http://localhost:5000 server started.');