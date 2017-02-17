var application = {
    showRooms : function () {
        console.log('emitting in showRooms() with event name ' + APP_EVENTS.TO_SERVER.ROOM.GET_ALL);
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.GET_ALL);
    },

    createRooms : function (name) {
        console.log('emitting in createRoom() with event name ' + APP_EVENTS.TO_SERVER.ROOM.CREATE);
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.CREATE, name);
    },

    joinRoom : function (name) {
        console.log('emitting in joinRoom() with event name ' + APP_EVENTS.TO_SERVER.ROOM.JOIN);
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.JOIN, name);
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
