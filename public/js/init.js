var APP_EVENTS = null;
var socket = io();

/**
 * Permet d'afficher des alerte en haut à droite de l'écran.
 * @param type string => définit la couleur d'affichage
 * @param data Object => données reçues
 */
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

/**
 * Permet d'effectuer des requête GET vers le serveur.
 * L'utilisation actuelle à pour but de récuperer les pages HTML plutôt que de les construire avec JQuery (gain de temps de dev)
 * @param route string      => l'url à appeler
 * @param data Object       => les paramètres à envoyer si besoin
 * @param success Function  => fonction de callback en fonction de la réponse du serveur.
 * @param error Function    => fonction de callback en fonction de la réponse du serveur.
 */
var requester = function (route, data, success, error) {
    $.ajax({
        method: 'GET',
        url: route,
        data: data,
        success: function (e) {
            if(success != undefined && success != null) success(e); else {console.log('success == null')}
        },
        error: function () {
            if(error != undefined && error != null) error();
        }
    })
};