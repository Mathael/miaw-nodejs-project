var Room = require('../models/room');

module.exports = {

    rooms : [],

    create : function (name, commander) {
        var room = new Room(name, commander);

        // If current commander is the commander of another room, it will not able to create another one
        var one = this.rooms.find(function (room) {
            return room._commander && room._commander._id == commander._id;
        });

        if(one != null) {
            return false;
        }

        this.rooms.push(room);
        console.log('[RoomService] new Room created with name :', name);
        return true;
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
