// Class question
var method = Question.prototype;

function Question(text, multiple) {
    this._text = text;
    multiple == undefined ? this._isMultiple = false : this._isMultiple = multiple;
    this._answers = [];
}

module.exports = Question;