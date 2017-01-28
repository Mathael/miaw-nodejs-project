function handleRequest(choice) {
    console.log('[Client] handle request for :', choice);
    switch(choice) {
        case 'rooms': rooms(); break;
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

function rooms() {
    $.ajax({
        url : '/room',
        type : 'POST',
        data: { socketId: sessionStorage.getItem('socketId')},
        success : function(code_html, status){
            console.log(status);
        },
        error : function(result, status, error){
            console.log('Error', error);
        }
    });
}

function clearBody() {
    $('#content').empty();
}
