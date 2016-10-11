var mongoose = require('mongoose');

module.exports = mongoose.model('Sitio', {
	nombre: String,
	subnombre: String,
	categoria: String,
	informacion: [{
		titulo: String,
		detalle: String
	}],
	imagenBackground: String,
	latitud: String,
	longitud: String,
	imagenes: [],
	videos: [],
	rating: Number,
	comentarios: [{
		id_usuario: String,
		usuario: String,
		imagenPerfil: String,
		comentario: String,
		rate: Number,
		fecha: String
	}]
});