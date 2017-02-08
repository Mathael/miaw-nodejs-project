function handleRequest(choice) {
    console.log('[Client] handle request for :', choice);
    switch(choice) {
        case 'rooms': getAllRooms(); break;
        case 'login':
        {
            //socket.emit('check', 'jaque');
            break;
        }
        case 'about': index(); break;
        default: index();
    }
}

function index() {
    clearBody();
    var title = $('<h1/>');
    title.text('WORKS !');
    title.appendTo('#content');
}

function joinRoom(name) {
    $.ajax({
        url : '/room/join',
        type : 'POST',
        data: {
            socketId: sessionStorage.getItem('socketId'),
            room : name
        },
        success : function(data, status){
            console.log(data);
        },
        error : function(result, status, error){
            console.log('Error', error);
        }
    });
}

function createRoom(name) {
    $.ajax({
        url : '/room/create',
        type : 'POST',
        data: {
            socketId: sessionStorage.getItem('socketId'),
            room : name
        },
        success : function(data, status){
            console.log(data);
        },
        error : function(result, status, error){
            console.log('Error', error);
        }
    });
}

function clearBody() {
    $('#content').empty();
}

//////////////////////////////////////
////////    PAGE BUILDER    //////////
//////////////////////////////////////

function showRoomPage(data) {


}
