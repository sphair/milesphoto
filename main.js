var fs = require('fs');

var express = require('express');
var app = express();
var server = require('http').createServer(app);


app.configure('all', function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.static(__dirname));

});

server.listen(1339);
console.log('Listening on port' + 1339);

