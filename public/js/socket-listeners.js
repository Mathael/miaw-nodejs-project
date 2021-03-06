socket.on('CON_STATE_SUCCESS', function(data) {
    sessionStorage.setItem('socketId', data.payload.id);
    APP_EVENTS = data.payload.events;

    // Add all listeners here

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.GET_ALL, function (data) {
        pageManager.displayRooms(data);
    });

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.UPDATE_DATA, function (data) {
        if(data.message) sendAlert(data.status, data.message);
        if(data.payload && global.room) {
            global.room = data.payload;
            console.log('update event received', global.room);
            pageManager.updateRoomData(global.room);
        }
    });

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.GET_MY_ROOM_INFORMATIONS, function (data) {
        if(!data) sendAlert('error', 'Réponse inattendue de la part du serveur.');
        data.payload.isCommander ? pageManager.displayRoomForTeacher(data.payload) : pageManager.insideRoom();
    });

    socket.on(APP_EVENTS.TO_CLIENT.QUESTION.SHOW, function (response) {
        if(response.message) sendAlert(response.status, response.message);
        pageManager.displayTeacherInfo(response.payload);
        pageManager.showQuestion(response.payload);
    });

    socket.on(APP_EVENTS.TO_CLIENT.GENERAL.NEW_USER_COUNT, function (data) {
        $('#client-count-value').text(data);
    });

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.JOIN_SUCCESS, function (response) {
        if(response.payload != null) {
            // Display join success
            if (response.status && response.message) sendAlert(response.status, response.message);
            global.room = response.payload;

            // Notify commander to unlock the room to enable "join room" button
            if(response.payload.isCommander === true) {
                global.room = response.payload.room;
                pageManager.displayRoomForTeacher(response.payload.room);
            }else {
                pageManager.insideRoom();
            }
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
        global.room = null;
        pageManager.displayRooms(response.payload);
    });

    socket.on(APP_EVENTS.TO_CLIENT.STUDENT.WAIT, function (response) {
        sendAlert(response.status, response.message);
        pageManager.waitNextQuestion();
    });

    socket.on(APP_EVENTS.TO_CLIENT.ROOM.COMMANDER.QUESTION_LIST, function (response) {
        global.questions = response.payload;
        console.log(global.questions);
        // TODO update teacher UI with list of questions availables
        // TODO: enable "start button"
    });

    socket.on(APP_EVENTS.TO_CLIENT.TEACHER.NEW_ANSWER_PUSHED, function(response) {
        if (response.status != 'success' && response.message) sendAlert(response.status, response.message);
        console.log(response.payload);
        pageManager.displayChart(response.payload);
    });

    socket.on(APP_EVENTS.COMMONS.FAIL, function (response) {
        if(response && response.message) sendAlert('error', response.message);
    });

    socket.on(APP_EVENTS.COMMONS.APROPOS, function (response) {
        pageManager.displayAPropos();
    });
});

socket.on('disconnect', function(){
    sendAlert('info', 'Server is shutting down ! You are now disconnected !');
    socket.disconnect();
});
