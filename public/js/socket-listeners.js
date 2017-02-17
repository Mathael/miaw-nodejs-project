socket.on('event', function(data) {
    console.log('Event received :', data);
});

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
        console.log(response);

        // Front application must known the Room information
        if(response.payload) global.room = response.payload.room;

        if(response == 'success' && response.payload == null && response.message) sendAlert('success', response);
        if(response.payload && response.payload.isCommander === true) {
            sendAlert('warning', response);
            console.log('TODO: afficher la page professeur');
        }
    });

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.LOCK_STATE, function (response) {
        if(global.room) {
            global.room._isLocked = response.payload;
            console.log('The room is now locked ? '+global.room._isLocked);
            console.log('TODO: apply result to the UI');
        }
    });

    socket.on(APP_EVENTS.COMMONS.FAIL, function (response) {
        if(response.status === 'error' && response.message) sendAlert('error', response);
    });
});

socket.on('disconnect', function(){
    sendAlert('info', {message:'Server is shutting down ! You are now disconnected !'});
    socket.disconnect();
});
