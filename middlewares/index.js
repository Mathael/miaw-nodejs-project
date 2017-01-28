// Log des routes demandées
// Il s'agit uniquement d'un fichier d'exemple d'utilisation des middlewares
module.exports = function(req, res, next) {
    console.log('[Route]['+ req.method +'] ' + req.originalUrl + ' requested.');
    next();
};
