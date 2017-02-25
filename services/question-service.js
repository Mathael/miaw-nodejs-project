var database = require('../utils/database');

//
// Question Service
//
module.exports = {

    create : function (question, callback) {
        database.executeQuery('INSERT INTO question(text, ismultiple) VALUES(?, ?)', [question._text, question._isMultiple], callback);
    },

    getCount : function (callback) {
        database.executeQuery('SELECT count(*) as count FROM question', null, callback);
    },

    findById : function (id, callback) {
        database.executeQuery('SELECT * FROM question WHERE id = ? LIMIT 1', [id], callback);
    },

    findAll : function (callback) {
        database.executeQuery('SELECT * FROM question', null, callback);
    }
};
