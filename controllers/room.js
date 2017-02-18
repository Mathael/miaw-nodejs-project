var APP_EVENTS = require('../utils/events');
var roomService = require('../services/room-service');
var Response = require('../models/response');
var User = require('../models/user');
module.exports = {

    create: function (socket, object) {
        console.log('[RoomController] creating rooms.');

        // Check if Objet required fields are defined
        if(!object.room_name || !object.questions) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Un ou plusieurs champs requis pour la création ne sont pas valide'));
            return;
        }

        // Trying to create a Room
        var room = roomService.create(object);
        if(room){
            room._commander = socket.id;
            socket.join(room._nsp);
            socket.emit(APP_EVENTS.TO_CLIENT.ROOM.JOIN_SUCCESS, new Response('success', {room: room, isCommander:true}, 'Vous devez déverouiller le salon pour le rendre accessible'));
            return;
        }

        socket.emit(APP_EVENTS.COMMONS.FAIL);
    },

    join: function (client, room_name, username) {

        // TODO: check username

        var room = roomService.findOne(room_name);

        if(!room) {
            client.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas'));
            return;
        }

        if(room._isLocked) {
            client.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon est verrouillé'));
            return;
        }

        if(room.hasUser(client.id) || room._commander == client.id) {
            client.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous êtes déjà présent dans ce salon'));
            return;
        }

        room._members.push(new User(client.id, username, null, ['ANONYMOUS']));

        client.join(room._nsp);
        client.emit(APP_EVENTS.TO_CLIENT.ROOM.JOIN_SUCCESS, new Response('success', {room: room, isCommander:false}, 'Bienvenue dans le salon ' + room_name));
        client.broadcast.to(room._nsp).emit('event', 'New user joined the current room !');
    },

    toggleLock: function (client, room_name, isLockRequest) {
        if(room_name) {
            // TODO: check if the client is the commander of the room

            var result = isLockRequest ? roomService.toggleLock(room_name, true) : roomService.toggleLock(room_name, false);

            result ?
                client.emit(APP_EVENTS.TO_CLIENT.ROOM.LOCK_STATE, new Response('success', isLockRequest, null)) :
                client.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action'));
        }
    },

    findAll: function (socket) {
        console.log('[ROOM Controller] retrieve all rooms.');
        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.GET_ALL, roomService.rooms);
    },

    findRoomByMember : function (socket) {
        var room = roomService.rooms.find(function (room) {
            return room._members.find(function (member) {
                return member._id == socket.id;
            }) || room._commander == socket.id;
        });

        if(room == null) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne faites partie d\'aucun salon'));
            return;
        }

        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.INFORMATIONS, room);
    },

    remove: function (socket, name, global) {
        if(!name) return; // Invalid request, don't answer anythings

        var room = roomService.findOne(name);
        if(!room) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas !'));
            return;
        }

        if(room._commander !== socket.id) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous n\'êtes pas le propriétaire du salon'));
            return;
        }

        // The members will be redirected to the room list that's why we send the current room list !

        // Expelling and notify all members
        room._members.forEach(function (member) {
            var memberSocket = global.clients.find(function (client) {
                return client.id === member._id;
            });

            if(memberSocket) memberSocket.leave(room._nsp, function () {
                memberSocket.emit(APP_EVENTS.TO_CLIENT.ROOM.LEAVE, new Response('warning', roomService.rooms, 'Le salon a été supprimé.'));
            });
        });

        // Expelling commander and notify
        socket.leave(room._nsp, function () {
            socket.emit(APP_EVENTS.TO_CLIENT.ROOM.LEAVE, new Response('success', roomService.rooms, 'Le salon a bien été supprimé.'));
        });

        roomService.removeByName(name);
    }
};
