var application = {
    showRooms : function () {
        console.log('emitting in showRooms() with event name ' + APP_EVENTS.TO_SERVER.ROOM.GET_ALL);
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.GET_ALL);
    },

    showMyRoom : function () {
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.GET_MY_ROOM_INFORMATIONS);
    },

    createRoom : function (room) {
        console.log('emitting in validateRoomCreation() with event name ' + APP_EVENTS.TO_SERVER.ROOM.CREATE);
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.CREATE, room);
    },

    joinRoom : function (name) {
        console.log('emitting in joinRoom() with event name ' + APP_EVENTS.TO_SERVER.ROOM.JOIN);
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.JOIN, name);
    },

    toggleRoomLock : function() {
        if(global.room) {
            var data = {room_name: global.room._name};
            global.room._isLocked ? socket.emit(APP_EVENTS.TO_SERVER.ROOM.UNLOCK, data) : socket.emit(APP_EVENTS.TO_SERVER.ROOM.LOCK, data);
        }
    }
};
