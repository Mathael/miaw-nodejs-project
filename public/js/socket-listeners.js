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

    socket.on(APP_EVENTS.TO_CLIENT.GENERAL.NEW_USER_COUNT, function (data) {
        $('#client-count-value').text(data);
    });

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.JOIN_SUCCESS, function (data) {
        console.log(data);
    });

    socket.on(APP_EVENTS.COMMONS.CON_STATE.FAIL, function () {
        console.log('Server return fail during process.');
    });
});

socket.on('disconnect', function(){
    console.log('Server is shutting down ! You are now disconnected !');
    socket.disconnect();
});
