// Class RoomDto
// this class is used to map the real Room class without specifics arguments
var method = RoomDto.prototype;

function RoomDto(room) {
    this._nsp = room._nsp;
    this._name = room._name;
    this._description = room._description;
    this._commander = room._commander;
    this._isLocked = room._isLocked;
}

module.exports = RoomDto;
