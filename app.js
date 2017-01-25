var express = require('express');
var sockets = require('socket.io');
var app = express();
var constants = require('./utils/constants');

app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public'));

// Listening
var server = app.listen(constants.SERVER.PORT, function() {
    console.log('Listening on port *:'+constants.SERVER.PORT+'...');
});

var io = sockets.listen(server);

io.on('connection',function (socket) {
    console.log("Socket reçu : " + socket.id);
});

// Load controllers
require('./controllers/default')(app,io);