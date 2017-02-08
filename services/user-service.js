var database = require('../utils/database');

module.exports = {

    create : function (username, password) {
        database.executeQuery('INSERT INTO user(username, password, roles) VALUES(?, ?, ?)', [username, password, ['ROLE_USER']], callback);
    },

    update : function (user) {

    },

    findById : function (id, callback) {
        database.executeQuery('SELECT * FROM user WHERE id = ?', [id], callback);
    },

    remove : function (user) {

    },

    count: function (callback) {
        database.executeQuery('SELECT count(*) FROM user', null, callback);
    }
};
