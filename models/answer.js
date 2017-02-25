// Class answer
var method = Answer.prototype;

function Answer(answer, good) {
    if(answer === undefined) this.answer = "Une réponse !";
    this.answer = answer;
    if(good === undefined) this.good = false;
    this.good = good;
}

module.exports = Answer;