var method = AnswerDto.prototype;

function AnswerDto(answer) {
    this._id = answer._id;
    this._text = answer._text;
}

module.exports = AnswerDto;
