var pageManager = {

    clearBody : function() {
        $('#content').empty();
    },

    displayMyRoom : function (room) {
        if(!room) return;

        this.clearBody();
        var self = this;

        requester('/room', null,
            function (data) {
                data = data.replace("{{room-name}}", room._name);
                $('#content').append(data);

                self.toggleRoomLockEvent(room._isLocked);
            }
        );
    },

    updateRoomData : function (room) {
        console.log('updateRoomData', room);
        if(!room) return;

        // Update Room members list
        var userList = $('#room-client-list');
        userList.empty(); // clear all and draw again
        room._members.forEach(function (member) {
            var icon = $('<i>')
                .addClass('fa fa-trash-o link')
                .css('margin-right', '6px')
                .on('click', function(){
                    $('.room-member[data-id = "'+member._id+'"]').remove();
                    application.expelMember(member._id);
                });
            $('<div>')
                .attr('data-id', member._id)
                .addClass('display-block room-member')
                .append(icon)
                .append(member._username)
                .appendTo(userList);
        });
    },

    toggleRoomLockEvent: function(isLocked) {
        var btnLock = $('#toggleRoomLock');
        isLocked ? btnLock.text('Déverrouiller le salon') : btnLock.text('Verrouiller le salon');
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
                application.join(v._name);
            });

            room_list.append(container);
        });

        room_list.appendTo('#content');

        if(data == undefined || data.length == 0) {
            $('<p>').text("Il n'y a aucun salon pour le moment").appendTo('#content');
        }

        var createButton = $('<button>');
        createButton.text("Créer un nouveau salon");
        createButton.on('click', function () {
            pageManager.displayRoomCreation();
        });

        new_room_form.append(createButton);
        new_room_form.appendTo('#content');
    },

    displayRoomCreation : function (data) {
        console.log('displayRoomCreation()', data);
        var self = this;

        requester('/room/create', null,
            function (data) {
                self.clearBody();
                $('#content').append(data);
            }
        );
    },

    nextQuestionBuilder: function () {
        var fieldsetElement = $('#selector-question');

        var question = new Question();
        question.text = $(fieldsetElement).find('input[name="question-text"]').val();
        question.type = $(fieldsetElement).find('input[type="radio"][name="answer-type"]:checked').val();
        question.answers = [];

        $(fieldsetElement).find('.selector-question-true').each(function(ke, input){
            var inputValue = $(input).val();
            if(inputValue != null && inputValue != '')
            {
                var answer = new Answer();
                answer.text = inputValue;
                answer.good = true;
                question.answers.push(answer);
            }
        });

        $(fieldsetElement).find('.selector-question-false').each(function(ke, input){
            var inputValue = $(input).val();
            if(inputValue != null && inputValue != '')
            {
                var answer = new Answer();
                answer.text = inputValue;
                answer.good = false;
                question.answers.push(answer);
            }

        });

        global.questions.push(question);

        var li = $('<li>').text(question.text);
        $('#selector-questions-previsualisation').append(li);
    },

    addGoodAnswer : function() {
        $('#selector-answer-good').append('<input type="text" class="selector-question-true display-block" />');
    },

    addBadAnswer : function() {
        $('#selector-answer-bad').append('<input type="text" class="selector-question-false display-block" />');
    },

    validateRoomCreation: function () {
        //TODO: check global.questions.length

        var myRoom = new Room();
        myRoom.room_name = $('input[name="room-name"]').val();
        myRoom.room_username = $('input[name="room-username"]').val();
        myRoom.room_descr = $('input[name="room-descr"]').val();
        myRoom.room_password = $('input[name="room-password"]').val();
        myRoom.questions = global.questions;

        global.questions = [];
        application.createRoom(myRoom);
    }
};
