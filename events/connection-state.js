module.exports = function (io,global) {
    io.on('connection',function (socket) {
        console.log("[IO] Socket reçu : " + socket.id);
        global.clients.push(socket);
        console.log('[IO] Connected clients : ' + global.clients.length);
        socket.emit('connection-successful', socket.id);
    });

    io.on('disconnect',function (socket) {
        global.clients.splice(global.clients.indexOf(socket), 1);
        console.log('[IO] Connected clients : ' + global.clients.length);
    });
};
