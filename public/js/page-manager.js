var pageManager = {

    clearBody : function() {
        $('#content').empty();
    },

    waitNextQuestion : function () {
        this.clearBody();
        $('<div>').text('En attente de la question suivante...').appendTo('#content');
    },

    displayRoomForTeacher : function (room) {
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
            var join = $('<button>');

            join.text("join room");
            join.on('click',function () {
                pageManager.displayJoinForm(v._name);
            });

            container.addClass('room');

            room_name.text(v._name);
            room_name.css('text-align', 'center');

            v._commander ? commander_name.text(v._commander._username) : commander_name.text('Le créateur du salon est anonyme.');

            size.text(' ('+(v._members.length + (v._commander ? 1 : 0)) +')');

            room_name.append(size);
            container.append(room_name);
            container.append(commander_name);
            container.append(join);

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

    displayRoomCreation : function () {
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
        question._text = $(fieldsetElement).find('input[name="question-text"]').val();
        question._isMultiple = $(fieldsetElement).find('input[type="radio"][name="answer-type"]:checked').val() == 'multiple';
        question._answers = [];

        $(fieldsetElement).find('.selector-question-true').each(function(ke, input){
            var inputValue = $(input).val();
            if(inputValue != null && inputValue != '')
            {
                var answer = new Answer();
                answer._text = inputValue;
                answer._good = true;
                question._answers.push(answer);
            }
        });

        $(fieldsetElement).find('.selector-question-false').each(function(ke, input){
            var inputValue = $(input).val();
            if(inputValue != null && inputValue != '')
            {
                var answer = new Answer();
                answer._text = inputValue;
                answer._good = false;
                question._answers.push(answer);
            }

        });

        global.questions.push(question);

        var li = $('<li>').text(question._text);
        $('#selector-questions-previsualisation').append(li);
    },

    addGoodAnswer : function() {
        $('#selector-answer-good').append('<input type="text" class="selector-question-true display-block" />');
    },

    addBadAnswer : function() {
        $('#selector-answer-bad').append('<input type="text" class="selector-question-false display-block" />');
    },

    validateRoomCreation: function () {
        if(global.questions.length == 0) {
            sendAlert('error', 'Vous devez spécifier au moins une question et la valider pour qu\'elle soit prise en compte');
            return;
        }

        var myRoom = new Room();
        myRoom.room_name = $('input[name="room-name"]').val();
        myRoom.room_username = $('input[name="room-username"]').val();
        myRoom.room_description = $('input[name="room-descr"]').val();
        myRoom.room_password = $('input[name="room-password"]').val();
        myRoom.questions = global.questions;

        application.createRoom(myRoom);
    },

    displayJoinForm : function (roomName) {
        if(global.room !== null) {
            sendAlert('error', 'Vous faites déjà partie d\'un salon');
            return;
        }

        this.clearBody();

        var form = $('<form>');
        var label = $('<label>').text('Nom d\'utilisateur');
        var input = $('<input>').attr({type: 'text', id:'username'});
        var button = $('<button>')
            .attr({type:'button'})
            .text('Entrer dans le salon')
            .on('click', function () {
                var username = $(input).val();
                if(username && username.length > 3)
                    application.join(roomName, username);
                else sendAlert('error', 'Le nom doit avoir une longueur de 4 caractères minimum.');
            });

        form
            .append(label)
            .append(input)
            .append(button)
            .appendTo('#content');
    },

    insideRoom : function () {
        this.clearBody();

        $('#content').append(
            $('<p>').text('Bienvenue dans le salon. Veuillez patienter...')
        );
    },

    showQuestion : function (question) {
        if(!question) {
            console.error('page-manager.js', 'displayQuestion(question)', 'Question is undefined', question);
            return;
        }

        this.clearBody();

        var content = $('#content');

        $('<h2>').text('Question en cours').css('text-align', 'center').appendTo(content);
        $('<h3>').text(question._text).appendTo(content);

        var inputType = question._isMultiple ? 'checkbox' : 'radio';

        $('<h3>').text('Réponse(s)').appendTo(content);

        var form =  $('<form>').attr('id','answers');
        var listAnswers = $('<ul>');

        question._answers.forEach(function(answer){
            var li = $('<li>').appendTo(listAnswers);
            var input = $('<input>').attr({type:inputType,name:'answerRadio',id:answer._id}).val(answer._text).appendTo(li);
            var span = $('<span>').text(answer._text).appendTo(li);
        });

        listAnswers.appendTo(form);
        form.appendTo(content);

        $('<button>')
            .attr({type:'button'})
            .text('Valider ma réponse')
            .on('click', function () {
                var answers = [];
                if(inputType == 'radio') {
                    var radioCheck = $('input[name=answerRadio]:checked', '#answers');
                    if(radioCheck != null) answers.push(radioCheck.attr('id'));
                }else{
                    var tabCheckBox = $('input[name=answerRadio]:checked');
                    tabCheckBox.each(function(index,check){
                        answers.push(check.attr('id'));
                    });
                }

                answers.length > 0 ? application.sendAnswers(answers) : sendAlert('error', 'Vous sélectionner au moins une réponse.');
            })
            .appendTo(content);
    },

    launchQCM: function() {
        // Commander will request to the server to emit the first question to the room.
        application.start();

        // For the teacher: displays information about question, answers and current scores
        this.displayTeacherInfo(global.questions[0]);
    },

    // Display the current question to teacher
    displayTeacherInfo: function(question){
        if(question == null) return;

        var content = $('#content');
        $('#current_question').text(question._text);

        var answers = $('<ul>');
        question._answers.forEach(function(answer){
            var li = $('<li>').text(answer._text).appendTo(answers);
        });

        var current_answers = $('#current_answers');
        current_answers.empty();
        answers.appendTo(current_answers);

        $('#question-start').removeClass('disabled');
        $('#question-next').addClass('disabled');
        $('#question-chart').removeClass('disabled');

        setTimeout(function() {
            $('#question-next').removeClass('disabled');
        }, 5000);
    },

    displayChart: function(current){
        this.clearBody();

        var data = this.getMockData();
        var content = $("#content");

        content.append("<h1>" + data[current].text + "</h1>");
        content.append("<select name='chart_type' id='chart_type'><option value='bar'>Graphique en barres</option><option value='pie'>Graphique en secteurs</option></select><br />");
        content.append("<div id='chart-container'><canvas id='myChart' width='100' height='300'></canvas></div>");

        var cData = [];
        var cLabels = [];

        for(var i in data[current].answers){
            cLabels.push(data[current].answers[i].text);
            //TODO : Real scole for this answer instead of i
            // score.getScoreOfAnswer(data[current].answers[i])
            cData.push(i);
        }
    },

    scoreSave: function(){
        var answers = [];
        $("input:checked").each(function(){
            answers.push($(this).val());
        });

        this.clearBody();

        $("#content").append("Vous avez répondu : " + answers);
    }
};
