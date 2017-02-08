var pageManager = {

    displayRooms: function(data) {

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
                //application(v._name);
            });
            container.append(room_name);
            container.append(commander_name);
            container.appendTo('#content');
        });

        if(data == undefined || data.length == 0) {
            $('<p>').text("Il n'y a aucun salon pour le moment").appendTo('#content');
        }

        var createButton = $('<button>');
        var newRoomInputName = $('<input>');

        createButton.text("Créer un nouveau salon");
        createButton.on('click', function () {
            application.createRooms(newRoomInputName.val());
        });

        newRoomInputName.appendTo('#content');
        createButton.appendTo('#content');
    }
};