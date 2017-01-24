var express = require('express'), router = express.Router();

router.get('/tata', function (req, res) {
    res.render('../views/default/index.html', {page: 1});
});

router.get('/toto', function (req, res) {
    res.render('../views/default/index.html', {page: 2});
});

console.log('controller 2 loaded');
module.exports = router;
