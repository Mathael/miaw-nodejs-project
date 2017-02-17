var APP_EVENTS = require('../utils/events');
var roomService = require('../services/room-service');
var Response = require('../models/response');
module.exports = {

    create: function (socket, name) {
        console.log('[ROOM Controller] create rooms.');
        roomService.create(name, null);
        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.GET_ALL, roomService.rooms);
    },

    start : function (socket,room_name) {

        var room = roomService.findOne(room_name);

        if(!room) {
            client.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas'));
            return;
        }

        socket.broadcast.to(room._nsp).emit(APP_EVENTS.TO_CLIENT.PROF.START);

    },

    nextQuestion : function (socket,room_name,id_question) {

        var room = roomService.findOne(room_name);

        if(!room) {
            client.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas'));
            return;
        }

        socket.broadcast.to(room._nsp).emit(APP_EVENTS.TO_CLIENT.PROF.NEXT,id_question);

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


         if(room.hasUser(client.id)) {
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

    remove: function (socket, name) {
        console.log('[ROOM Controller] removing room.');
        roomService.removeByName(name);
    }
};
