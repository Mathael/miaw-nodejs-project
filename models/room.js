// Class Room
var method = Room.prototype;

function Room(name, commander) {
    this._name = name;
    this._commander = commander;
    this._members = [];
    this._isLocked = false; // TODO: turn to true by default to allow only commander to configure his channel and put 'ON' when is ready
}

method.hasUser = function (user) {
    return this._members.find(function (r) {
        return r.id == user.id;
    }).length == 1;
};

method.isEmpty = function () {
    return this._members.length == 0;
};

method.size = function () {
    return this._members.length + (this._commander ? 1 : 0);
};

module.exports = Room;
