var database = require('../utils/database');

module.exports = function (app,io) {

    app.get('/', function (req, res) {
        res.render('default/index.ejs', {page: 1});
    });

    app.get('/test', function (req, res) {
        database.executeQuery('select * from test', function(rows, fields) {
            console.log('rows', rows.length);
            console.log('fields', fields.length);
            res.render('default/index.ejs', {page: rows.length});
        });
    });

    console.log('controller 1 loaded');
};
