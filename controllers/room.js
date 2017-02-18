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

    join: function (client, room_name, username, global) {

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
        //client.broadcast.to(room._nsp).emit('event', 'New user joined the current room !');

        // Notify to the commander that a new User has joined the room.
        var commander = global.clients.find(function (clientSocket) {
            return clientSocket.id == room._commander;
        });

        if(commander) commander.emit(APP_EVENTS.TO_CLIENT.ROOM.UPDATE_DATA, new Response('success', room, null));
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

    expel: function (socket, memberId, global) {
        if(!memberId) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action.'));
            return;
        }

        var result = roomService.expelMember(socket.id, memberId);
        if(!result) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action.'));
            return;
        }

        // Notify to the expelled member that it was expelled
        var memberSocket = global.clients.find(function (client) {
            return client.id === memberId;
        });

        var room = roomService.findOneByCommander(socket.id);
        if(memberSocket) memberSocket.leave(room._nsp, function () {
            memberSocket.emit(APP_EVENTS.TO_CLIENT.ROOM.LEAVE, new Response('info', roomService.rooms, 'Vous venez d\'être expulsé du salon.'));
        });
    },

    findAll: function (socket) {
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

        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.GET_MY_ROOM_INFORMATIONS, room);
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
                memberSocket.emit(APP_EVENTS.TO_CLIENT.ROOM.LEAVE, new Response('info', roomService.rooms, 'Le salon a été supprimé.'));
            });
        });

        // Expelling commander and notify
        socket.leave(room._nsp, function () {
            socket.emit(APP_EVENTS.TO_CLIENT.ROOM.LEAVE, new Response('success', roomService.rooms, 'Le salon a bien été supprimé.'));
        });

        roomService.removeByName(name);
    }
};
