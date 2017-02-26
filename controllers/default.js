var database = require('../utils/database');

module.exports = function (app,io) {

    /**
     * Used to send the main HTML page
     */
    app.get('/', function (req, res) {
        res.render('default/index.ejs');
    });

    /**
     * Used to initialize the database
     */
    app.get('/init', function (req, res) {

        //INSERT FIRST QUESTION WITH ANSWER
        database.executeQuery('INSERT INTO question (question,multiple) VALUES ("Aimez vous le NodeJs ?","0")', function(rows, fields) {

        });

        database.executeQuery('INSERT INTO answer (answer,good,id_question) VALUES ("OUI","1","1")', function(rows, fields) {

        });
        database.executeQuery('INSERT INTO answer (answer,good,id_question) VALUES ("NON","0","1")', function(rows, fields) {

        });

        //INSERT SECOND QUESTIONS WITH ANSWER
        database.executeQuery('INSERT INTO question (question,multiple) VALUES ("Aimez vous le PHP ?","0")', function(rows, fields) {

        });
        database.executeQuery('INSERT INTO answer (answer,good,id_question) VALUES ("OUI","1","2")', function(rows, fields) {

        });
        database.executeQuery('INSERT INTO answer (answer,good,id_question) VALUES ("NON","0","2")', function(rows, fields) {

        });
        database.executeQuery('INSERT INTO answer (answer,good,id_question) VALUES ("PEUT ETRE","0","2")', function(rows, fields) {

        });

        //INSERT ADMIN USER
        database.executeQuery('INSERT INTO user VALUES ("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","admin","password","ROLE_ADMIN")', function(rows, fields) {

        });

        res.redirect('/');
    });

    app.get('/room/create', function (req, res) {
        res.render('rooms/create.ejs')
    });

    app.get('/room', function (req, res) {
        // TODO: get socket id as parameter to check access
        res.render('rooms/commander_my_room.ejs');
    });

    app.get('/APropos', function (req, res) {
        res.render('default/APropos.ejs');
    });

    console.log('Default controller loaded successful');
};
