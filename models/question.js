// Class question
var method = Question.prototype;

function Question(question, multiple) {
    if(question === undefined) this.text = "Posez votre question aux étudiants"; else this.text = question;
    if(multiple === undefined) this.isMultiple = false; else this.isMultiple = multiple;
    this.answers = [];
}

method.addAnswer = function(answer) {
    this.answers.push(answer);
    return answer;
};


module.exports = Question;