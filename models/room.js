// Class Room
var method = Room.prototype;

function Room(name, commander) {
    this._nsp = '/'+name;
    this._name = name;
    this._commander = commander; // TODO: currently its a SOCKET ID. It must be an User Object
    this._members = [];
    this._isLocked = true;
}

method.hasUser = function (id) {
    return this._members.length > 0 ? this._members.filter(function (user) {
        return user._id == id;
    }).length == 1 : false;
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
