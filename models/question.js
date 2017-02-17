// Class question
var method = Question.prototype;

function Question(question, multiple) {
    if(question === undefined) this.question = "Posez votre question aux étudiants"; else this.question = question;
    if(multiple === undefined) this.multiple = false; else this.multiple = multiple;
    this.answers = [];
}

method.addAnswer = function(answer) {
    this.answers.push(answer);

    return answer;
};


module.exports = Question;