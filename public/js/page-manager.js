var pageManager = {

    clearBody : function() {
        $('#content').empty();
    },


    displayRooms: function(data) {

        this.clearBody();

        var room_list = $('<section>');
        var new_room_form = $('<section>');

        $.each(data, function (k,v) {
            var container = $('<article>');
            var room_name = $('<h3>');
            var commander_name = $('<p>');
            var size = $('<span>');

            container.addClass('room');

            room_name.text(v._name);
            room_name.css('text-align', 'center');

            v._commander ? commander_name.text(v._commander._username) : commander_name.text('Le créateur du salon est anonyme.');

            size.text(' ('+(v._members.length + (v._commander ? 1 : 0)) +')');
            room_name.append(size);

            container.append(room_name);
            container.append(commander_name);

            container.on('click', function(){
                application.joinRoom(v._name);
            });

            room_list.append(container);
        });

        room_list.appendTo('#content');

        if(data == undefined || data.length == 0) {
            $('<p>').text("Il n'y a aucun salon pour le moment").appendTo('#content');
        }

        var createButton = $('<button>');
        var newRoomInputName = $('<input>');

        createButton.text("Créer un nouveau salon");
        createButton.on('click', function () {
            //application.createRooms(newRoomInputName.val());
            pageManager.displayRoomCreation(newRoomInputName.val());
        });

        new_room_form.append(newRoomInputName);
        new_room_form.append(createButton);
        new_room_form.appendTo('#content');
    },

    displayRoomCreation : function (data) {
        console.log('displayRoomCreation()');


    }
};