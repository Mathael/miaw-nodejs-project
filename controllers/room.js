module.exports = function (app,io,global) {

    /**
     * Join a room
     */
    app.post('/room', function (req, res) {
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

        if(client) {
            console.log('client join !');
            client.join('/room');

            // Notify to all members that was already in this room (except the current client)
            client.broadcast.to('/room').emit('event', 'New user joined the current room 2');
        }

        res.render('default/room.ejs');
    });

    console.log('Room controller loaded successful');
};
