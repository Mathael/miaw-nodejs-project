var APP_EVENTS = require('../utils/events');
var CONSTANTS = require('../utils/constants');
var questionService = require('../services/question-service');
var roomService = require('../services/room-service');
var userService = require('../services/user-service');
var Response = require('../models/response');

module.exports = {

    findAll: function (socket) {
        var room = roomService.findOneByCommander(socket.id);
        if(!room) {
            socket.emit(APP_EVENTS.COMMONS.FAIL, new Response('error', null, 'Vous ne pouvez pas effectuer cette action'));
            return;
        }

        questionService.findAll(function(rows){
            socket.emit(APP_EVENTS.TO_CLIENT.QUESTION.LIST, new Response('success', rows, null));
        });
    }
};
