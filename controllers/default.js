var database = require('../utils/database');
var User = require('../models/user');

module.exports = function (app,io) {

    /**
     * @Controller used to test render in NodeJS
     */
    app.get('/', function (req, res) {
        res.render('default/index.ejs');
    });

    /**
     * @Controller used to test database query in NodeJS
     */
    app.get('/test', function (req, res) {
        database.executeQuery('select * from test', function(rows, fields) {
            console.log('rows', rows.length);
            console.log('fields', fields.length);
            res.render('default/index.ejs', {page: rows.length});
        });
    });

    /**
     * @Controller used to test model in NodeJS
     */
    app.get('/user', function (req, res) {

        var user1 = new User('alpha', 'beta', ['ROLE_ADMIN', 'ROLE_USER']);
        var user2 = new User('alpha2', 'beta2', ['ROLE_USER']);

        console.log(user1);
        console.log(user2);
        console.log('user 1 has role ROLE_ADMIN ? : ', user1.hasRole('ROLE_ADMIN'));
        console.log('user 2 has role ROLE_ADMIN ? : ', user2.hasRole('ROLE_ADMIN'));

        res.render('default/index.ejs', {page: 0});
    });

    app.get('/room/create', function (req, res) {
        res.render('rooms/create.ejs')
    });

    app.get('/room/joinRoom', function (req, res) {
        res.render('rooms/joinRoom.ejs')
    });

    app.get('/room/insideRoom', function (req, res) {
        res.render('rooms/insideRoom.ejs')
    });

    app.get('/room/showQuestion', function (req, res) {
        var id = req.query.id;
        res.render('rooms/question.ejs',{ question : id})
    });

    console.log('Default controller loaded successful');
};
