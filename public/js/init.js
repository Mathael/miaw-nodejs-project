var APP_EVENTS = null;
var socket = io();

var sendAlert = function (type, data) {
    var colors = {
        success: '#27ae60',
        error: '#ae3437',
        warning: '#ae9901',
        info: '#02c0ff'
    };
    $.amaran({
        'position'  :'top right',
        'inEffect'  :'slideRight',
        'outEffect' :'slideRight',
        'delay'     : 6000,
        'theme'     :'colorful',
        'content'   :{
            bgcolor: colors[type] || colors.error,
            color:'#fff',
            message: data.message || 'Aucun message d\'erreur'
        }
    });
};