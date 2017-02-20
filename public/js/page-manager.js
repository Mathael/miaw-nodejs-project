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
    },

    displayJoinForm : function (roomName) {
        this.clearBody();

        var form = $('<form>');
        var label = $('<label>').text('Nom d\'utilisateur');
        var input = $('<input>').attr({type: 'text', id:'username'});
        var button = $('<button>')
            .attr({type:'button'})
            .text('Entrer dans le salon')
            .on('click', function () {
                var name = $(input).val();
                if(name && name.length > 1){
                    application.join(roomName);
                }
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

    showQuestion : function (data) {

        var self = this;

        requester('/room/showQuestion', data,
            function (data) {
                self.clearBody();
                $('#content').append(data);

            },
            function() {
                sendAlert('error', {
                    message: 'Le serveur ne répond pas à votre requête'
                });
            });
    },

    profLaunchQCM: function() {
        var self = this;
        application.start(global.room._name);

        var data = this.getMockData();

        self.displayQuestion(data, 0);

        // For the teacher: displays information about question, answers and current scores
        self.displayTeacherInfo(data, 0);
    },

    displayTeacherInfo: function(questions, current){
        this.clearBody();

        if(questions == null) return;

        if(current == null) current = 0;

        if(questions[current].answers == null) return;

        var content = $('#content');

        content.append('<h1>Question ' + (parseInt(current)+1) + '</h1>');
        content.append('<h2>' + questions[current].text + '</h2>');

        var list = $('<ul>');
        for(var index in questions[current].answers) {
            var answer = questions[current].answers[index];
            var li = $('<li>').addClass('good-answer').text(answer.text);
            list.append(li);
        }

        content.append(list);
        $('<a>').attr('href', '#').text('Question suivante').on('click', function(){pageManager.nextQuestion(questions, current);}).appendTo(content);
        content.append("<a href='#'>Afficher le graphique</a>");
        content.append("<a href='#'>Arrêter</a>");

    },

    nextQuestion: function(data, current){
        console.log("next!");
        this.clearBody();

        data = this.getMockData();

        this.displayQuestion(data, (parseInt(current)+1));

        // For the teacher: displays information about question, answers and current scores
        this.displayTeacherInfo(data, (parseInt(current)+1));
    },

    displayQuestion: function (data, current) {
        this.clearBody();

        if(current == null) current = 0;
        data = this.getMockData();

        $('#content').append('<h1>Question ' + parseInt(parseInt(current)+1) + '</h1>');
        $('#content').append('<h2>' + data[current].text + '</h2>');
        var html = "";
        for(var i in data[current].answers){
            var answer = data[current].answers[i];
            html += "<input type='";
            if(data[current].type == "single") html += "radio";
            else if(data[current].type == "multiple") html += "checkbox";

            html += "' name='question-" + (parseInt(current)+1) + "' value='" + answer.text + "' required /> " + answer.text + "<br />";
        }

        html += "<a onclick='pageManager.scoreSave()'>Valider</a>";

        $("#content").append(html);
    },

    scoreSave: function(){
        var answers = [];
        $("input:checked").each(function(){
            answers.push($(this).val());
        });

        this.clearBody();

        $("#content").append("Vous avez répondu : " + answers);
    },

    //TODO: this function has testing purposes ; delete
    getMockData: function(){
        /* MOCK DATA: Room MCQ */
        var mockQCM = [];
        var question1 = new Question();
        var question2 = new Question();
        question1.text = "La question 1 !";
        question2.text = "Une question 2 ?";
        question2.type = "single";
        question1.type = "multiple";

        var answer = new Answer();
        var answer2 = new Answer();
        var answer3 = new Answer();
        var answer4 = new Answer();
        answer.text = "La bonne réponse !"; answer.good = true;
        answer2.text = "Une mauvaise réponse !"; answer.good = false;
        answer4.text = "Une autre mauvaise réponse !"; answer.good = false;
        answer3.text = "Une bonne réponse !"; answer.good = true;

        question1.answers = [answer, answer2, answer4];
        question2.answers = [answer, answer3, answer2, answer4];
        mockQCM.push(question1);
        mockQCM.push(question2);

        return mockQCM;
    }
};
