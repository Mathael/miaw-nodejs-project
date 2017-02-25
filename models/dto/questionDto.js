// Class RoomDto
// this class is used to map the real Room class without specifics arguments
var method = QuestionDto.prototype;

function QuestionDto(question) {
    this._id = question._id;
    this._text = question._text;
    this._isMultiple = question._isMultiple;
    this._answers = question._answers;
}

module.exports = QuestionDto;
