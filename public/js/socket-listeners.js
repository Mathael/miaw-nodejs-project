socket.on('event', function(data) {
    console.log('Event received :', data);
});

socket.on('CON_STATE_SUCCESS', function(data) {
    console.log(data);
    sessionStorage.setItem('socketId', data.id);
    APP_EVENTS = data.payload;

    // Add all listeners here

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.GET_ALL, function (data) {
        pageManager.displayRooms(data);
    });

});

socket.on('disconnect', function(){
    console.log('Server is shutting down ! You are now disconnected !');
    socket.disconnect();
});
