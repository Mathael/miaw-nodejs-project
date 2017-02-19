var Room = require('../models/room');

module.exports = {

    rooms : [],

    create : function (object) {
        if(!object) return null;

        if(this.rooms.find(function (room) {
            return room.name == object.room_name;
        }) != null) return null;

        var room = new Room(object.room_name, null);

        // If current commander is the commander of another room, it will not able to create another one
        /*
        var one = this.rooms.find(function (room) {
            return room._commander && room._commander._id == commander._id;
        });

        if(one != null) {
            return false;
        }*/

        this.rooms.push(room);
        console.log('[RoomService] new Room created with name :', object.room_name);
        return room;
    },

    remove : function (room) {
        if(room) this.rooms.splice(this.rooms.indexOf(room), 1);
    },

    removeByName : function (name) {
        var room = this.findOne(name);
        this.remove(room);
    },

    findOne: function (name) {
        return this.rooms.find(function (room) {
            return room._name == name
        });
    },

    findOneByMemberId: function (socketId) {
        return this.rooms.find(function (room) {
            return room._members.find(function (member) {
                return member._id == socketId;
            }) || room._commander == socketId;
        });
    },

    findOneByCommander : function (commanderId) {
        return this.rooms.find(function (room) {
            return room._commander == commanderId;
        });
    },

    expelMember: function (commanderId, memberId) {
        var room = this.findOneByCommander(commanderId);
        if(!room) return false;

        return room.removeMember(memberId);
    },

    toggleLock: function (room_name, isLockRequest) {
        var room = this.findOne(room_name);
        if(!room) return false;
        room._isLocked = isLockRequest;
        return true; // Notify success to controller
    }
};
