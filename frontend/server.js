var express = require('express');
var path = require('path');
var app = express();
var port = 9000;

app.use(express.static(__dirname));

app.get('/js/index.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/js/index.js'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, console.log('App listening on port ' + port));