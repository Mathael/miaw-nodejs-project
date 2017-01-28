module.exports = function (io) {

    io.of('/room').on('connection', function (socket) {
        // ici socket.broadcast.emit() enverra un socket à tous les clients
        // connectés à la chambre "/chat"
        console.log('Someone connected to the room :', '/room');
        socket.emit('event', 'Vous entrez dans room !');
    });

    io.of('/room/32').on('connection', function (socket) {
        // ici socket.broadcast.emit() enverra un socket à tous les clients
        // connectés à la chambre "/chat"
        socket.emit('event', 'Vous entrez dans room 32 !');
    });
};
