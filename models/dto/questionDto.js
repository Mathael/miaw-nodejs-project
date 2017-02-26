var AnswerDto = require('./answerDto');

var method = QuestionDto.prototype;

function QuestionDto(question) {
    this._id = question._id;
    this._text = question._text;
    this._isMultiple = question._isMultiple;
    this._answers = question._answers.map(function(answer){return new AnswerDto(answer);});
}

module.exports = QuestionDto;
