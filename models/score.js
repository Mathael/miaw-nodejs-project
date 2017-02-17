// Class score
var method = Score.prototype;

function Score(question) {
    if(question === undefined) this.question = null; else this.question = question;
    this.scores = [];
}

method.setScore = function(answer, score) {
    this.scores.push({answer: answer, score: score});
};

method.getScoreOfAnswer = function (answer) {
    for(var i in this.scores){
        if (this.scores[i].answer == answer) return this.scores[i].score;
    }

    return 0;
};


module.exports = Score;