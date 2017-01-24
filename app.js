var express = require('express');
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

    // Load controllers
    require('./controllers/default')(app);

    // Listening
    var server = app.listen(constants.BASE_PORT, function() {
        console.log('Listening on port 3000...');
    });

    var io = require('socket.io').listen(server);

