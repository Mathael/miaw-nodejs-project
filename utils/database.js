var constants = require('./constants');
var mysql = require('mysql');

module.exports = {
    executeQuery : function(query, callback) {
        var connector = mysql.createConnection({
            host: constants.DATABASE.HOST,
            user: constants.DATABASE.USERNAME,
            password: constants.DATABASE.PASSWORD,
            database: constants.DATABASE.DATABASE_NAME,
            debug: false
        });

        connector.connect(function (err) {
            if (err) console.log('erreur de connexion : ', err.message);
            else {
                connector.query(query, function (err, rows, fields) {
                    if (err) throw err;
                    callback(rows, fields);
                    connector.end();
                });
            }
        });
    }
};