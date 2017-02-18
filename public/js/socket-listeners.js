socket.on('CON_STATE_SUCCESS', function(data) {
    sessionStorage.setItem('socketId', data.payload.id);
    APP_EVENTS = data.payload.events;

    // Add all listeners here

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.GET_ALL, function (data) {
        pageManager.displayRooms(data);
    });

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.INFORMATIONS, function (data) {
        console.log(data);
        pageManager.displayMyRoom(data);
    });

    socket.on(APP_EVENTS.TO_CLIENT.GENERAL.NEW_USER_COUNT, function (data) {
        $('#client-count-value').text(data);
    });

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.JOIN_SUCCESS, function (response) {
        if(response.payload != null) {
            // Display join success
            if(response.status && response.message) sendAlert(response.status, response.message);

            // Notify commander to unlock the room to enable "join room" button
            if(response.payload.isCommander === true) {
                sendAlert('warning', response.message);
            }

            global.room = response.payload.room;
            pageManager.displayMyRoom(response.payload.room);
        }
    });

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.LOCK_STATE, function (response) {
        if(global.room) {
            global.room._isLocked = response.payload;
            pageManager.toggleRoomLockEvent(global.room._isLocked);
        }
    });

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.LEAVE, function (response) {
        sendAlert(response.status, response.message);
        pageManager.displayRooms(response.payload);
    });

    socket.on(APP_EVENTS.COMMONS.FAIL, function (response) {
        if(response.status === 'error' && response.message) sendAlert('error', response.message);
    });
});

socket.on('disconnect', function(){
    sendAlert('info', 'Server is shutting down ! You are now disconnected !');
    socket.disconnect();
});
