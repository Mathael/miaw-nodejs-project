function handleRequest(choice) {
    console.log('[Client] handle request for :', choice);
    switch(choice) {
        case 'rooms': getAllRooms(); break;
        case 'login': index(); break;
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

function getAllRooms() {
    $.ajax({
        url : '/room',
        type : 'GET',
        success : function(data, status){
            showRoomPage(data);
        },
        error : function(result, status, error){
            console.log(status, error);
        }
    });
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

function clearBody() {
    $('#content').empty();
}

//////////////////////////////////////
////////    PAGE BUILDER    //////////
//////////////////////////////////////

function showRoomPage(data) {
    clearBody();
    $.each(data, function (k,v) {
        var container = $('<article>');
        var room_name = $('<p>');
        var commander_name = $('<p>');
        var size = $('<span>');

        room_name.text(v._name);

        if(v._commander)
            commander_name.text(v._commander._username);
        else
            (commander_name.text('Salon créé par : Inconnu'));

        size.text(' ('+(v._members.length + (v._commander ? 1 : 0)) +')');
        room_name.append(size);

        container.on('click', function(){
            joinRoom(v._name);
        });
        container.append(room_name);
        container.append(commander_name);
        container.appendTo('#content');
    })
}
