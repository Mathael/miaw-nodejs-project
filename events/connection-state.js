var APP_EVENTS = require('../utils/events');
var Response = require('../models/response');

module.exports = function (io,global) {

    io.on('connection', function (socket) {
        global.clients.push(socket);
        console.log("[IO] Socket reçu : " + socket.id);
        console.log('[IO] Connected clients : ' + global.clients.length);

        var roomController = require('../controllers/room');

        // Send all availables events to front application
        socket.emit(APP_EVENTS.COMMONS.CON_STATE.SUCCESS, new Response('success', {id: socket.id, events: APP_EVENTS}, 'Connection successful'));

        // Handle client disconnect and to keep client list updated and notify everyone of clients count
        socket.on('disconnect', function (data) {
            global.clients.splice(global.clients.indexOf(data), 1);
            console.log('[IO] Client disconnected.');
            io.sockets.emit(APP_EVENTS.TO_CLIENT.GENERAL.NEW_USER_COUNT, global.clients.length);
        });

        //////////////////////////////////////////////////
        ///                 ROOM EVENTS                ///
        //////////////////////////////////////////////////

        socket.on(APP_EVENTS.TO_SERVER.ROOM.GET_ALL, function () {
            roomController.create(socket,"test");
            roomController.findOne(this);
        });

        socket.on(APP_EVENTS.TO_SERVER.ROOM.CREATE, function (data) {
            roomController.create(this, data);
        });

        socket.on(APP_EVENTS.TO_SERVER.ROOM.JOIN, function (room_name) {
            roomController.join(socket, room_name);
        });

        //////////////////////////////////////////////////
        ///                 USER EVENTS                ///
        //////////////////////////////////////////////////

        socket.on(APP_EVENTS.TO_SERVER.PROF.START, function (room_name) {
            roomController.start(this,room_name);
        });

        socket.on(APP_EVENTS.TO_SERVER.PROF.NEXT, function (name,id_question) {
            roomController.nextQuestion(this,name,id_question);
        });

        //////////////////////////////////////////////////
        ///               QUESTION EVENTS              ///
        //////////////////////////////////////////////////

        //////////////////////////////////////////////////
        ///                ANSWER EVENTS               ///
        //////////////////////////////////////////////////

        //////////////////////////////////////////////////
        ///                GLOBAL EVENTS               ///
        //////////////////////////////////////////////////

        // Global broadcast on new client connect
        io.sockets.emit(APP_EVENTS.TO_CLIENT.GENERAL.NEW_USER_COUNT, global.clients.length);
    });
};
