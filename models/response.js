// Class Room
var method = Response.prototype;

function Response(status, payload, message) {
    if(status === undefined) status = 'success';
    if(message === undefined) message = '';
    if(payload === undefined) payload = null;

    this.status = status;
    this.payload = payload;
    this.message = message;
}

module.exports = Response;
