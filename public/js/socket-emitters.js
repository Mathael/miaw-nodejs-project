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
    },

    start : function (name) {
        console.log('emitting in start() with event name ' + APP_EVENTS.TO_SERVER.PROF.START);
        socket.emit(APP_EVENTS.TO_SERVER.PROF.START,name);
    },

    nextQuestion : function (name,id_question) {
        console.log('emitting in nextQuestion() with event name ' + APP_EVENTS.TO_SERVER.PROF.NEXT);
        socket.emit(APP_EVENTS.TO_SERVER.PROF.NEXT,name,id_question);
    }
};
