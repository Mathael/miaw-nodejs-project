var database = require('../utils/database');

module.exports = function (app) {

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

    console.log('controller 1 loaded');
};
