// Class question
var method = Question.prototype;

function Question(question, multiple) {
    if(question === undefined) this._text = "Posez votre question aux étudiants"; else this._text = question;
    if(multiple === undefined) this._isMultiple = false; else this._isMultiple = multiple;
    this._answers = [];
}

method.addAnswer = function(answer) {
    this._answers.push(answer);
    return answer;
};


module.exports = Question;