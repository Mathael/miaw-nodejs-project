var express = require('express');
var app = express();

app
    .use(express.static(__dirname + '/public'))

    .use(express.static(__dirname + '/public'))

    /*
     // session support
     app.use(session({
     resave: false, // don't save session if unmodified
     saveUninitialized: false, // don't create session until something stored
     secret: 'some secret here'
     }));
     */

    .use(require('./middlewares/index'))

    .use(require('./controllers/index'))

    .listen(3000, function() {
        console.log('Listening on port 3000...')
    })
