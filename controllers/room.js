var APP_EVENTS = require('../utils/events');
var roomService = require('../services/room-service');
module.exports = {

    create: function (socket, name) {
        console.log('[ROOM Controller] create rooms.');
        roomService.create(name, null);
    },

    findAll: function (socket) {
        console.log('[ROOM Controller] retrieve all rooms.');
        socket.emit(roomService.rooms);
    },

    findOne: function (socket) {
        console.log('[ROOM Controller] retrieve all rooms.');
        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.GET_ALL, roomService.rooms);
    },

    remove: function (socket, name) {
        console.log('[ROOM Controller] removing room.');
        roomService.removeByName(name);
    }
};
