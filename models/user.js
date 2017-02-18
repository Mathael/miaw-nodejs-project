// Class User
var method = User.prototype;

function User(id, username, password, roles) {
    this._id = id;
    this._username = username;
    this._password = password;
    this._roles = roles;
}

method.hasRole = function (role) {
    return this._roles.filter(function (r) {
        return r === role;
    }).length == 1;
};

module.exports = User;
