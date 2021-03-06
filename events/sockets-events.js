var APP_EVENTS = require('../utils/events');
var Response = require('../models/response');
var roomController = require('../controllers/room');
var userService = require('../services/user-service');

module.exports = function (io) {

    io.on('connection', function (socket) {
        userService.addClient(socket);
        console.log('[IO] Connected clients : ' + userService.getCount());

        // Send all available events to front application
        socket.emit(APP_EVENTS.COMMONS.CON_STATE.SUCCESS, new Response('success', {id: socket.id, events: APP_EVENTS}, 'Connection successful'));

        // Handle client disconnect and to keep client list updated and notify everyone of clients count
        socket.on('disconnect', function () {
            userService.removeClient(socket.id);
            io.sockets.emit(APP_EVENTS.TO_CLIENT.GENERAL.NEW_USER_COUNT, userService.getCount());
            console.log('[IO] Client disconnected.');
        });

        //////////////////////////////////////////////////
        ///                 ROOM EVENTS                ///
        //////////////////////////////////////////////////

        socket.on(APP_EVENTS.TO_SERVER.ROOM.GET_ALL, function () {
            roomController.findAll(socket);
        });

        socket.on(APP_EVENTS.TO_SERVER.ROOM.GET_MY_ROOM_INFORMATIONS, function () {
            roomController.findRoomByMember(socket);
        });

        socket.on(APP_EVENTS.TO_SERVER.ROOM.CREATE, function (data) {
            roomController.create(this, data);
        });

        socket.on(APP_EVENTS.TO_SERVER.ROOM.DELETE, function (room_name) {
            roomController.remove(socket, room_name);
        });

        socket.on(APP_EVENTS.TO_SERVER.ROOM.JOIN, function (data) {
            roomController.join(socket, data.name, data.username);
        });

        socket.on(APP_EVENTS.TO_SERVER.ROOM.UNLOCK, function (data) {
            roomController.toggleLock(socket, data.room_name, false);
        });

        socket.on(APP_EVENTS.TO_SERVER.ROOM.LOCK, function (data) {
            roomController.toggleLock(socket, data.room_name, true);
        });

        socket.on(APP_EVENTS.TO_SERVER.ROOM.EXPEL, function (memberId) {
            roomController.expel(socket, memberId);
        });

        //////////////////////////////////////////////////
        ///               TEACHER EVENTS               ///
        //////////////////////////////////////////////////

        socket.on(APP_EVENTS.TO_SERVER.TEACHER.START, function () {
            roomController.start(this);
        });

        socket.on(APP_EVENTS.TO_SERVER.TEACHER.NEXT, function (position) {
            roomController.nextQuestion(this, position);
        });

        //////////////////////////////////////////////////
        ///                ANSWER EVENTS               ///
        //////////////////////////////////////////////////

        socket.on(APP_EVENTS.TO_SERVER.STUDENT.SEND_ANSWER, function (answers) {
            roomController.insertAnswer(socket, answers);
        });

        //////////////////////////////////////////////////
        ///                GLOBAL EVENTS               ///
        //////////////////////////////////////////////////

        socket.on(APP_EVENTS.COMMONS.APROPOS, function (answers) {
            socket.emit(APP_EVENTS.COMMONS.APROPOS);
        });

        // Global broadcast on new client connect
        io.sockets.emit(APP_EVENTS.TO_CLIENT.GENERAL.NEW_USER_COUNT, userService.getCount());
    });
};
