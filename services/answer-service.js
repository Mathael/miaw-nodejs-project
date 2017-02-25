var database = require('../utils/database');

//
// Answer Service
//
module.exports = {

    create : function (questionId, answer, callback) {
        database.executeQuery('INSERT INTO answer(text, good, question_id) VALUES(?, ?, ?)', [answer.text, answer.good, questionId], callback);
    },

    getCount : function (callback) {
        database.executeQuery('SELECT count(*) as count FROM answer', null, callback);
    },

    findById : function (id, callback) {
        database.executeQuery('SELECT * FROM answer WHERE id = ? LIMIT 1', [id], callback);
    },

    findByQuestion : function (questionId, callback) {
        database.executeQuery('SELECT * FROM answer WHERE question_id = ?', [questionId], callback);
    },

    findAll : function (callback) {
        database.executeQuery('SELECT * FROM answer', null, callback);
    }
};
