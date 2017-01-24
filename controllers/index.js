/**
 * Class d'export globale des controllers
 */

module.exports = function () {
    console.log('loading controllers');
    module.exports.default = require('./default');
    module.exports.default2 = require('./default2');
};
