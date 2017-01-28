var socket = socket = io.connect('/');

socket.on('event', function(data) {
    console.log('Event received :', data);
});

socket.on('connection-successful', function(data) {
    console.log('Connected with socket id :', data);
    sessionStorage.setItem('socketId', data);
});

socket.on('disconnect', function(){
    console.log('Server is shutting down ! You are now disconnected !');
    socket.disconnect();
});
