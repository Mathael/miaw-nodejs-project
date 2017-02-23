var constants = require('./constants');
var mysql = require('mysql');

module.exports = {
    executeQuery : function(query, parameters, callback) {
        var connector = mysql.createConnection({
            host: constants.DATABASE.HOST,
            user: constants.DATABASE.USERNAME,
            password: constants.DATABASE.PASSWORD,
            database: constants.DATABASE.DATABASE_NAME,
            debug: false
        });

        connector.connect(function (err) {
            if (err) console.log('erreur de connexion : ', err.message);
            else
            {
                connector.query(query, parameters, function (err, rows) {
                    if (err) throw err;
                    if(callback) callback(rows);
                    connector.end();
                });
            }
        });
    }
};