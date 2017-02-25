// Class Room
var method = Room.prototype;

function Room(name, commander) {
    this._nsp = '/'+name;
    this._name = name;
    this._description = '';
    this._commander = commander; // TODO: currently its a SOCKET ID. It must be an User Object
    this._members = [];
    this._isLocked = true;
    this._questions = [];
    this.current_question = 0; // First question by default;
}

method.hasUser = function (id) {
    return this._members.length > 0 ? this._members.filter(function (user) {
        return user._id == id;
    }).length == 1 : false;
};

method.getMember = function (memberId) {
    return this._members.find(function (member) {
        return member._id == memberId;
    }) || null;
};

method.removeMember = function (memberId) {
    var member = this.getMember(memberId);
    if(member) {
        this._members.splice(this._members.indexOf(member), 1);
        return true;
    }
    return false;
};

method.isCommander = function (id) {
    return this._commander == id;
};

method.isEmpty = function () {
    return this._members.length == 0;
};

method.size = function () {
    return this._members.length + (this._commander ? 1 : 0);
};

module.exports = Room;
