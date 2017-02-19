// Main application
var express = require('express');
var sockets = require('socket.io');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var app = express();
var constants = require('./utils/constants');

// Use EJS template engine
app.engine('html', require('ejs').renderFile);

// Deliver all static files under /public
app.use('/public', express.static(__dirname + '/public'));

// Security management by Helmet.js
// Prevent some of NodeJS issues
app.use(helmet());

// to support JSON-encoded bodies
app.use( bodyParser.json() );

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

// HTTP Listening
var server = app.listen(constants.SERVER.PORT, function() {
    console.log('Listening on port *:'+constants.SERVER.PORT);
});

// Socket listening
var io = sockets.listen(server);

// Loading events catchers
require('./events/connection-state')(io);
//require('./events/room')(io);

// Loading middlewares
app.use(require('./middlewares/index'));

// Loading controllers
require('./controllers/default')(app,io);
