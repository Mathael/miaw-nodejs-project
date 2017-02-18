var application = {
    showRooms : function () {
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.GET_ALL);
    },

    showMyRoom : function () {
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.GET_MY_ROOM_INFORMATIONS);
    },

    createRoom : function (room) {
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.CREATE, room);
    },

    deleteRoom : function () {
        if(global.room) {
            if(socket.id === global.room._commander) {
                socket.emit(APP_EVENTS.TO_SERVER.ROOM.DELETE, global.room._name);
            } else sendAlert('error', 'Vous n\'avez pas les droits pour effectuer cette action');
        } else sendAlert('error', 'Vous ne faites partie d\'aucun salon');
    },

    joinRoom : function (name) {
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.JOIN, name);
    },

    toggleRoomLock : function() {
        if(global.room) {
            var data = {room_name: global.room._name};
            global.room._isLocked ? socket.emit(APP_EVENTS.TO_SERVER.ROOM.UNLOCK, data) : socket.emit(APP_EVENTS.TO_SERVER.ROOM.LOCK, data);
        }
    }
};
