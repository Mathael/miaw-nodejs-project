var express = require('express');
var server = express() ;

server.
	// Page d'accueil
	get('/', function(req, res) {
		res.setHeader('Content-Type', "text/html; charset=utf-8"); 
		res.end('Hello World !'); 
	})

	// Utilisation d'un resource dans le projet:
	// Exemple : j'ai besoin d'inclure un fichier CSS => .use(req, res, express.static('css/mon_fichier.css'));
	.use(function(req, res, next){
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		res.status(404).send('Vous êtes sur une page inconnue.');
	}); 

server.listen(8080);
