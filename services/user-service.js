var database = require('../utils/database');
var CONST = require('../utils/constants');
var User = require('../models/user');

//
// Connected clients are all stored in this.clients array.
// - We cant store the socket in the User object because it will too long data when we send a list of users
//   that's why we store "stockets" and "clients" in two different arrays
//
module.exports = {

    sockets : [],
    clients : [],

    //
    // DATABASE MANAGEMENT
    //

    create : function (username, password) {
        database.executeQuery('INSERT INTO user(username, password, roles) VALUES(?, ?, ?)', [username, password, ['ROLE_USER']], callback);
    },

    //
    // LOCAL MANAGEMENT
    // Every method for local management must have a name that finish by the prefix : "Client" in reference to "this.clients"
    //      -> Except method "getCount()"
    //

    getCount : function () {
        return this.clients.length;
    },

    getSocketClient : function (socketId) {
        return this.sockets.find(function (socket) {
            return socket.id === socketId;
        }) || null;
    },

    addClient : function (socket) {
        // Anonymous clients aren't stored in database
        // They are wrapped in User object to keep the same logic with logged clients
        this.sockets.push(socket);
        this.clients.push(new User(socket.id, 'Anonymous', null, [CONST.ROLE.ANONYMOUS]));
    },

    findClientById : function (id) {
        return this.clients.find(function (user) {
            return user._id == id;
        }) || null;
    },

    removeClient : function (id) {
        var user = this.findClientById(id);
        if(user) this.clients.splice(this.clients.indexOf(user), 1);
    }
};
