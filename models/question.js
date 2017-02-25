// Class question
var method = Question.prototype;

function Question(text, multiple) {
    this._text = text;
    multiple == undefined ? this._isMultiple = false : this._isMultiple = multiple;
    this._answers = [];
    this._committed = []; // Users answers for the current question are stored here
}

method.addAnswer = function(answer) {
    this._answers.push(answer);
    return answer;
};


module.exports = Question;