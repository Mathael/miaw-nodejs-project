var APP_EVENTS = require('../utils/events');
var CONSTANTS = require('../utils/constants');
var database = require('../utils/database');
var Response = require('../models/response');

// Services
var roomService = require('../services/room-service');
var questionService = require('../services/question-service');
var answerService = require('../services/answer-service');
var userService = require('../services/user-service');

module.exports = {

    create: function (socket, object) {
        // TODO: switch commander to a normal object User() instead of socket identifier

        // Check if Objet required fields are defined
        if(!object.room_name || !object.questions) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Un ou plusieurs champs requis pour la création ne sont pas valide'));
            return;
        }

        // Trying to create a Room
        var room = roomService.create(object);
        if(!room) {
            socket.emit(APP_EVENTS.COMMONS.FAIL);
            return;
        }

        // The commander is the creator
        room._commander = socket.id;

        // Trying to create questions
        var insertedQuestion = [];

        object.questions.forEach(function(question) {
            if(!question.answers || question.answers.length < 2) return; // minimum 2 choices
            if(question.answers.map(function(e) { return e.good; }).length == 0) return; // Minimum 1 good answer
            if(question.answers.map(function(e) { return !e.good; }).length == 0) return; // Minimum 1 bad answer

            questionService.create(question, function(result) {
                // If question successfully inserted, push to array to send validated question to commander
                if(result.affectedRows) {
                    var answers = [];

                    // Then insert answers
                    question.answers.forEach(function(answer) {
                        answerService.create(question._id, answer, function(result){
                            if(result.affectedRows) {
                                answer._id = result.insertId;
                                answers.push(answer);
                            }
                        });
                        question.answers = answers;
                    });

                    question._id = result.insertId;
                    insertedQuestion.push(question);
                }
            });
        });

        // We consider question insertion wil take less than 5 secondes then we will do some logic.
        setTimeout(function () {
            socket.emit(APP_EVENTS.TO_CLIENT.ROOM.COMMANDER.QUESTION_LIST, new Response('success', insertedQuestion, null));
        }, 5000);

        socket.join(room._nsp);
        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.JOIN_SUCCESS, new Response('success', {room: room, isCommander:true}, 'Vous devez déverouiller le salon pour le rendre accessible'));
    },

    start : function (socket,room_name) {

        var room = roomService.findOne(room_name);

        if(!room) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas'));
            return;
        }

        socket.broadcast.to(room._nsp).emit(APP_EVENTS.TO_CLIENT.PROF.START);
    },

    nextQuestion : function (socket,room_name,question) {

        var room = roomService.findOne(room_name);


        if(!room) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas'));
            return;
        }

        socket.broadcast.to(room._nsp).emit(APP_EVENTS.TO_CLIENT.PROF.NEXT,question,room_name);

    },

    insertAnswer : function (socket,room_name,answers) {

        var user = userService.findClientById(socket.id);
        var room = roomService.findOne(room_name);
        var userSocket = userService.getSocketClient(user._id);
        if(!user) {
            console.log('Non existing user is trying to send answer.');
            return;
        }
        if(!room) {
            userSocket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas'));
            return;
        }

        if(room.hasUser(user._id)){

            for(var i =0; i<answers.length;i++) {
                database.executeQuery('INSERT INTO score (user,answer,room) VALUES ("' + user._username + '","'+answers[i]+'","'+room_name+'")', function (rows, fields) {

                });
            }

            userSocket.emit(APP_EVENTS.TO_CLIENT.STUDENT.WAITNEXT, new Response('success', null, 'Votre vote a été pris en compte'));

        }else{
            console.log("Vous ne pouvez pas répondre si vous n'etes pas dans la room");
        }

    },

    join: function (socket, room_name, username) {

        var room = roomService.findOne(room_name);
        var user = userService.findClientById(socket.id);
        var userSocket = userService.getSocketClient(user._id);

        if(!user) {
            console.log('Non existing user is trying to join a room.');
            return;
        }

        user._username = username;

        if(!room) {
            userSocket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas'));
            return;
        }

        if(room.hasUser(user._id) || room._commander == user._id) {
            userSocket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous êtes déjà présent dans ce salon'));
            return;
        }

        if(!user._username || user._username.length < 3) {
            userSocket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le nom doit avoir une longueur de 4 caractères minimum.'));
            return;
        }

        // Check if its an appropriate username
        if(CONSTANTS.BANNED_NAMES.find(function(name){
                return name == user._username.toLowerCase();
            })) {
            userSocket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le nom n\'est pas approprié pour rejoindre ce salon.'));
            return;
        }

        if(room._isLocked) {
            userSocket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon est verrouillé'));
            return;
        }

        room._members.push(user);

        userSocket.join(room._nsp);
        userSocket.emit(APP_EVENTS.TO_CLIENT.ROOM.JOIN_SUCCESS, new Response('success', {room: room, isCommander:false}, 'Bienvenue dans le salon ' + room_name));
        //client.broadcast.to(room._nsp).emit('event', 'New user joined the current room !');

        // Notify to the commander that a new User has joined the room.
        var commander = userService.getSocketClient(room._commander);
        if(commander) commander.emit(APP_EVENTS.TO_CLIENT.ROOM.UPDATE_DATA, new Response('success', room, null));
    },

    toggleLock: function (socket, room_name, isLockRequest) {
        if(room_name) {
            // TODO: check if the client is the commander of the room
            var room = roomService.findOne(room_name);
            if(!room || room._commander != socket.id) {
                socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action'));
                return;
            }

            var result = isLockRequest ? roomService.toggleLock(room_name, true) : roomService.toggleLock(room_name, false);

            result ?
                socket.emit(APP_EVENTS.TO_CLIENT.ROOM.LOCK_STATE, new Response('success', isLockRequest, null)) :
                socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action'));
        }
    },

    expel: function (socket, memberId) {

        if(!memberId) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action.'));
            return;
        }

        if(memberId === socket.id) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas vous expulser vous même.'));
            return;
        }

        var result = roomService.expelMember(socket.id, memberId);
        if(!result) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action.'));
            return;
        }

        // Notify to the expelled member that it was expelled
        var memberSocket = userService.getSocketClient(memberId);
        var room = roomService.findOneByCommander(socket.id);

        if(memberSocket && room) memberSocket.leave(room._nsp, function () {
            memberSocket.emit(APP_EVENTS.TO_CLIENT.ROOM.LEAVE, new Response('info', roomService.rooms, 'Vous venez d\'être expulsé du salon.'));
        });
    },

    findAll: function (socket) {
        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.GET_ALL, roomService.rooms);
    },

    findRoomByMember : function (socket) {
        var room = roomService.findOneByMemberId(socket.id);

        if(room == null) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne faites partie d\'aucun salon'));
            return;
        }

        var isCommander = room._commander == socket.id;
        var data = {isCommander:isCommander, room:room};
        socket.emit(APP_EVENTS.TO_CLIENT.ROOM.GET_MY_ROOM_INFORMATIONS, new Response('success', data, null));
    },

    remove: function (socket, name) {
        if(!name) return; // Invalid request, don't answer anythings

        var room = roomService.findOne(name);
        if(!room) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Le salon n\'existe pas !'));
            return;
        }

        if(room._commander !== socket.id) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous n\'êtes pas le propriétaire du salon'));
            return;
        }

        // The members will be redirected to the room list that's why we send the current room list !

        // Expelling and notify all members
        room._members.forEach(function (member) {
            var memberSocket = userService.getSocketClient(member._id);

            if(memberSocket) memberSocket.leave(room._nsp, function () {
                memberSocket.emit(APP_EVENTS.TO_CLIENT.ROOM.LEAVE, new Response('info', roomService.rooms, 'Le salon a été supprimé.'));
            });
        });

        // Expelling commander and notify
        socket.leave(room._nsp, function () {
            socket.emit(APP_EVENTS.TO_CLIENT.ROOM.LEAVE, new Response('success', roomService.rooms, 'Le salon a bien été supprimé.'));
        });

        roomService.removeByName(name);
    }
};
