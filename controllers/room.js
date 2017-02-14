var APP_EVENTS = require('../utils/events');
var roomService = require('../services/room-service');
var Response = require('../models/response');
module.exports = {

    create: function (socket, object) {
        console.log('[RoomController] creating rooms.');

        // Trying to create a Room
        var room = roomService.create(object);
        if(room){
            room._commander = socket.id;
            socket.join(room._nsp);
            socket.emit(APP_EVENTS.TO_CLIENT.ROOM.JOIN_SUCCESS, new Response('success', {isCommander:true}, 'Vous devez déverouiller le salon pour le rendre accessible'));
            return;
        }

        socket.emit(APP_EVENTS.COMMONS.FAIL);
    },

    join: function (client, room_name) {
        var room = roomService.findOne(room_name);

        if(!room) {
            client.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas'));
            return;
        }

        if(room._isLocked) {
            client.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon est fermé'));
            return;
        }

        if(room.hasUser(client.id) || room._commander == client.id) {
            client.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous êtes déjà présent dans ce salon'));
            return;
        }

        room._members.push(client.id);

        client.join(room._nsp);
        client.emit(APP_EVENTS.TO_CLIENT.ROOM.JOIN_SUCCESS, new Response('success', null, 'Bienvenue dans le salon ' + room_name));
        client.broadcast.to(room._nsp).emit('event', 'New user joined the current room !');
    },

    findAll: function (socket) {
        console.log('[ROOM Controller] retrieve all rooms.');
        socket.emit(roomService.rooms);
    },

    findOne: function (socket) {
        console.log('[ROOM Controller] retrieve all rooms.');
        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.GET_ALL, roomService.rooms);
    },

    findRoomByMember : function (socket) {
        var room = roomService.rooms.find(function (room) {
            return room._members.find(function (member) {
                return member == socket.id;
            }) || room._commander == socket.id;
        });

        if(room == null) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne faites partie d\'aucun salon'));
            return;
        }

        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.INFORMATIONS, room);
    },

    remove: function (socket, name) {
        console.log('[ROOM Controller] removing room.');
        roomService.removeByName(name);
    }
};
