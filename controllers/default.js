var express = require('express'), router = express.Router();

router.get('/', function (req, res) {
    res.render('../views/default/index.html', {page: 1});
});

router.get('/test', function (req, res) {
    res.render('../views/default/index.html', {page: 2});
});

console.log('controller 1 loaded');

module.exports = router;