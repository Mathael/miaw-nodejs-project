var APP_EVENTS = require('../utils/events');
var roomService = require('../services/room-service');
var userService = require('../services/user-service');
var Response = require('../models/response');

module.exports = {

    create: function (socket, object) {
        // TODO: switch commander to a normal object User() instead of socket identifier

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

    start : function (socket,room_name) {

        var room = roomService.findOne(room_name);

        if(!room) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas'));
            return;
        }

        socket.broadcast.to(room._nsp).emit(APP_EVENTS.TO_CLIENT.PROF.START);
    },

    nextQuestion : function (socket,room_name,id_question) {

        var room = roomService.findOne(room_name);

        if(!room) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas'));
            return;
        }

        socket.broadcast.to(room._nsp).emit(APP_EVENTS.TO_CLIENT.PROF.NEXT,id_question);

    },

    join: function (socket, room_name, username) {

        // TODO: check username

        var room = roomService.findOne(room_name);
        var user = userService.findClientById(socket.id);
        var userSocket = userService.getSocketClient(user._id);

        if(!user) {
            console.log('Non existing user is trying to join a room.');
            return;
        }

        if(!room) {
            userSocket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas'));
            return;
        }

        if(room.hasUser(user._id) || room._commander == user._id) {
            userSocket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous êtes déjà présent dans ce salon'));
            return;
        }

        if(room._isLocked) {
            userSocket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon est verrouillé'));
            return;
        }

        room._members.push(user);

        userSocket.join(room._nsp);
        userSocket.emit(APP_EVENTS.TO_CLIENT.ROOM.JOIN_SUCCESS, new Response('success', {room: room, isCommander:false}, 'Bienvenue dans le salon ' + room_name));
        //client.broadcast.to(room._nsp).emit('event', 'New user joined the current room !');

        // Notify to the commander that a new User has joined the room.
        var commander = userService.getSocketClient(room._commander);
        if(commander) commander.emit(APP_EVENTS.TO_CLIENT.ROOM.UPDATE_DATA, new Response('success', room, null));
    },

    toggleLock: function (socket, room_name, isLockRequest) {
        if(room_name) {
            // TODO: check if the client is the commander of the room
            var room = roomService.findOne(room_name);
            if(!room || room._commander != socket.id) {
                socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action'));
                return;
            }

            var result = isLockRequest ? roomService.toggleLock(room_name, true) : roomService.toggleLock(room_name, false);

            result ?
                socket.emit(APP_EVENTS.TO_CLIENT.ROOM.LOCK_STATE, new Response('success', isLockRequest, null)) :
                socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action'));
        }
    },

    expel: function (socket, memberId) {

        if(!memberId) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action.'));
            return;
        }

        if(memberId === socket.id) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas vous expulser vous même.'));
            return;
        }

        var result = roomService.expelMember(socket.id, memberId);
        if(!result) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action.'));
            return;
        }

        // Notify to the expelled member that it was expelled
        var memberSocket = userService.getSocketClient(memberId);
        var room = roomService.findOneByCommander(socket.id);

        if(memberSocket && room) memberSocket.leave(room._nsp, function () {
            memberSocket.emit(APP_EVENTS.TO_CLIENT.ROOM.LEAVE, new Response('info', roomService.rooms, 'Vous venez d\'être expulsé du salon.'));
        });
    },

    findAll: function (socket) {
        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.GET_ALL, roomService.rooms);
    },

    findRoomByMember : function (socket) {
        var room = roomService.findOneByMemberId(socket.id);

        if(room == null) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne faites partie d\'aucun salon'));
            return;
        }

        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.GET_MY_ROOM_INFORMATIONS, room);
    },

    remove: function (socket, name) {
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
            var memberSocket = userService.getSocketClient(member._id);

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
