module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('default/index.ejs', {page: 1});
    });

    app.get('/test', function (req, res) {
        res.render('default/index.ejs', {page: 2});
    });

    console.log('controller 1 loaded');
};
