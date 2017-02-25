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

    join : function (name, username) {
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.JOIN, {name: name, username:username});
    },

    start : function () {
        console.log('emitting start() with event name ' + APP_EVENTS.TO_SERVER.TEACHER.START);
        global.room.current_question = 0;
        socket.emit(APP_EVENTS.TO_SERVER.TEACHER.START);
    },

    toggleRoomLock : function() {
        if(global.room) {
            var data = {room_name: global.room._name};
            global.room._isLocked ? socket.emit(APP_EVENTS.TO_SERVER.ROOM.UNLOCK, data) : socket.emit(APP_EVENTS.TO_SERVER.ROOM.LOCK, data);
        }
    },

    expelMember : function (id) {
        if(!id) return;
        socket.emit(APP_EVENTS.TO_SERVER.ROOM.EXPEL, id);
    },

    nextQuestion : function () {
        global.room.current_question++;
        console.log('emitting next() with event name ' + APP_EVENTS.TO_SERVER.TEACHER.NEXT, global.room.current_question);
        socket.emit(APP_EVENTS.TO_SERVER.TEACHER.NEXT, global.room.current_question);
    },

    sendAnswer : function (room_name,answer) {
        socket.emit(APP_EVENTS.TO_SERVER.STUDENT.SENDANSWER,room_name,answer);
    }
};
