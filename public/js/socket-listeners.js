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

    socket.on(APP_EVENTS.TO_CLIENT.PROF.START, function (data) {
        pageManager.startQCM(data);
    });

    socket.on(APP_EVENTS.TO_CLIENT.PROF.NEXT, function (data) {
        var id = "id="+data;
        pageManager.showQuestion(id);
    });

    socket.on(APP_EVENTS.TO_CLIENT.GENERAL.NEW_USER_COUNT, function (data) {
        $('#client-count-value').text(data);
    });

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.JOIN_SUCCESS, function (response) {
        if(response.message) sendAlert('success', response);
        console.log(response);
    });

    socket.on(APP_EVENTS.COMMONS.FAIL, function (response) {
        if(response.status === 'error' && response.message) sendAlert('error', response);
    });
});

socket.on('disconnect', function(){
    sendAlert('info', {message:'Server is shutting down ! You are now disconnected !'});
    socket.disconnect();
});
