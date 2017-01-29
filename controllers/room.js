var roomService = require('../services/room-service');

module.exports = function (app,io,global) {

    /**
     * Create a room
     */
    app.get('/room/create', function (req, res) {
        var name = req.param('name');
        roomService.create(name, null);
        res.send(true);
    });

    /**
     * Show list of rooms
     */
    app.get('/room', function (req, res) {
        res.send(roomService.rooms);
    });

    /**
     * Show list of rooms
     */
    app.delete('/room', function (req, res) {
        var name = req.params['name'];
        if(name) roomService.removeByName(name);
        res.send(false);
    });

    /**
     * Join a room
     * POST because node can resolve json object data in GET
     */
    app.post('/room/join', function (req, res) {
        var roomName = req.body.room;
        var socketId = req.body.socketId;
        var client = null;

        var index = 0;
        var found = false;
        while(!found && index < global.clients.length) {
            if(global.clients[index].id == socketId) {
                client = global.clients[index];
            }
            index++;
        }

        if(client)
        {
            var room = roomService.findOne(roomName);

            if(!room) {
                res.status = 404;
                res.send(false);
                return;
            }

            if(room._isLocked) {
                res.status = 403;
                res.send(false);
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

            room._members.push(client);

            client.join(room._name);

            // Notify to all members that was already in this room (except the current client)
            client.broadcast.to('/room').emit('event', 'New user joined the current room !');
            res.send({
                status: 'success',
                room: room
            });
        }
        else
        {
            res.send(false);
        }
    });

    console.log('Room controller loaded successful');
};
