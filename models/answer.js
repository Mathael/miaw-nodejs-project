// Class answer
var method = Answer.prototype;

function Answer(answer, good) {
    if(answer === undefined) this._text = "Une réponse !";
    if(good === undefined) this._good = false;

    this._text = answer;
    this._good = good;
    this._value = 0;
}

module.exports = Answer;