var express = require('express');
var sockets = require('socket.io');
var app = express();
var constants = require('./utils/constants');

app.engine('html', require('ejs').renderFile);

app
    .use(express.static(__dirname + '/public'));

    /*
     // session support
     app.use(session({
         resave: false, // don't save session if unmodified
         saveUninitialized: false, // don't create session until something stored
         secret: 'some secret here'
     }));
     */



    // Listening
    var server = app.listen(constants.SERVER.PORT, function() {
        console.log('Listening on port 3000...');
    });

    var io = sockets.listen(server);

    io.sockets.on('connection',function (socket) {
        console.log("user co");

    });


    // Load controllers
    require('./controllers/default')(app,io);