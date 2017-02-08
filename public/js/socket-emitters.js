var application = {
    showRooms : function () {
        console.log('emitting in showRooms() with event name ' + APP_EVENTS.TO_SERVER.ROOM.GET_ALL);
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.GET_ALL);
    },

    createRooms : function (name) {
        console.log('emitting in createRoom() with event name ' + APP_EVENTS.TO_SERVER.ROOM.CREATE);
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.CREATE, name);
    }
};
