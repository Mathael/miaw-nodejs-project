var APP_EVENTS = require('../utils/events');
module.exports = function (io,global) {

    io.on('connection', function (socket) {
        global.clients.push(socket);
        console.log("[IO] Socket reçu : " + socket.id);
        console.log('[IO] Connected clients : ' + global.clients.length);

        var roomController = require('../controllers/room');

        // Send all availables events to front application
        socket.emit(APP_EVENTS.COMMONS.CON_STATE.SUCCESS, {
            id: socket.id,
            message: 'Connection successful',
            payload: require('../utils/events')
        });

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
            roomController.findOne(this);
        });

        socket.on(APP_EVENTS.TO_SERVER.ROOM.CREATE, function (data) {
            console.log(data);
            roomController.create(this, data);
        });

        socket.on(APP_EVENTS.TO_SERVER.ROOM.JOIN, function (data) {
            console.log('Not implemented yet.', data);
            var room = roomService.findOne(data.roomName);

            if(!room) {
                socket.emit(APP_EVENTS.COMMONS.CON_STATE.FAIL);
                return;
            }

            if(room._isLocked) {
                socket.emit(APP_EVENTS.COMMONS.CON_STATE.FAIL);
                return;
            }

            /*
             if(room.hasUser(client)) {
             res.send({
             status: 'fail',
             message: 'User already in this room'
             });
             return;
             }*/

            room._members.push(client.id);

            client.join(room._nsp);

            console.log({
                status: 'success',
                room: room
            });

            // TODO: remove me : Notify to all members that was already in this room (except the current client)
            client.broadcast.to(room._nsp).emit('event', 'New user joined the current room !');
        });

        //////////////////////////////////////////////////
        ///                 USER EVENTS                ///
        //////////////////////////////////////////////////

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
