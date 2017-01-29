var Room = require('../models/room');

module.exports = {

    rooms : [],

    create : function (name, commander) {
        var room = new Room(name, commander);

        // TODO: check if commander is already a commander of another room
        this.rooms.push(room);
        console.log('[RoomService] new Room created with name :', name);
    },

    remove : function (room) {
        this.room.splice(this.rooms.indexOf(room), 1);
    },

    removeByName : function (name) {
        var room = this.findOne(name);
        if(room) this.remove(room);
    },

    findOne: function (name) {
        return this.rooms.find(function (r) {
            return r._name == name
        });
    }
};
