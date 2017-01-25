var database = require('../utils/database');

module.exports = function (app,io) {

    app.get('/', function (req, res) {
        res.render('default/index.ejs', {page: 1});
    });

    app.get('/test', function (req, res) {
        var a = null;
        database.executeQuery('select * from article', function(rows, fields) {
            console.log('rows', rows.length);
            console.log('fields', fields.length);
            a = rows.length;
        });

        console.log(a);
        res.render('default/index.ejs', {page: a});
    });


    io.sockets.on('connection',function (request) {


        console.log('Un utilisateur s\'est connecté avec la session  #' + request.id);
        request.emit('info', {'text' : 'Vous êtes connecté !', 'sessionId' : request.id});




    });

    console.log('controller 1 loaded');
};
