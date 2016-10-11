var Sitio = require('../datasets/sitios.js');
var os = require('os');
var fs = require('fs');
var path = require('path');
var randomstring = require("randomstring");
var tmpFolder = os.tmpdir();

module.exports.new = function(req, res, next){
	var sitio = new Sitio(req.body);
	
	sitio.save();
	var nombreSitio = sitio.nombre.replace(' ', '');
	var imgSitioFolder = "public/sitios/"+nombreSitio;

	if(sitio.imagenBackground != ""){
		moveImage(sitio.imagenBackground, imgSitioFolder, nombreSitio+"-background");
		sitio.imagenBackground = imgSitioFolder+"/"+nombreSitio+"-background"+path.extname(sitio.imagenBackground);
	}

	var imagenes = [];
    for (var i = sitio.imagenes.length - 1; i >= 0; i--) {
    	var rnd = randomstring.generate(4);
    	moveImage(sitio.imagenes[i], imgSitioFolder, nombreSitio+"-"+rnd);
    	imagenes.push(imgSitioFolder+"/"+nombreSitio+"-"+rnd+path.extname(sitio.imagenes[i]));
	}
	sitio.imagenes = imagenes;

	res.json({
		status: 200,
		docs: "El sitio " + sitio.nombre + "ha sido creado."
	});
};

module.exports.getAll = function(req, res, next){
	Sitio.find(function(err, doc){
		if(doc){
			res.json({
				status: 200,
				docs: doc
			});
		} else {
			res.json({
				status: 404,
				docs: err
			});
		}
	});
};

module.exports.getOne = function(req, res, next){
	Sitio.findOne({_id:req.params.id}, function(err,doc){
		if(doc){
			res.json({
				status: 200,
				docs: doc
			});
		} else {
			res.json({
				status: 404,
				docs: err
			})
		}
	});
};

module.exports.editSitio = function(req, res, next){
	var sitio = req.body.sitio;
	var sitio_id = sitio._id;
	var imagenes = req.body.imagenes;
	var nombreSitio = sitio.nombre.replace(' ', '');
	var imgSitioFolder = "public/sitios/"+nombreSitio;
	var newImages = [];

	if(sitio.imagenBackground != ""){
		Sitio.findOne({_id:sitio_id}, function(err,doc){
			if(doc){
				if(sitio.imagenBackground != doc.imagenBackground){
					moveImage(sitio.imagenBackground, imgSitioFolder, nombreSitio+"-background");
				}
			}
		});		
	}

	for (var i = imagenes.length - 1; i >= 0; i--) {
		var rnd = randomstring.generate(4);
		moveImage(imagenes[i], imgSitioFolder, nombreSitio+"-"+rnd);
		newImages.push(imgSitioFolder+"/"+nombreSitio+"-"+rnd+path.extname(imagenes[i]));
	}

	Sitio.findOneAndUpdate({_id:sitio_id}, 
		{
			$set:{
				nombre: sitio.nombre,
				subnombre: sitio.subnombre,
				categoria: sitio.categoria,
				informacion: sitio.informacion,
				latitud: sitio.latitud,
				longitud: sitio.longitud
			},
			$pushAll:{imagenes: newImages}
		},
		function(err, doc){
			if(doc){
				res.json({
					status: 200,
					docs: doc
				});
			} else {
				res.json({
					status: 404,
					docs: err
				});
			}
		}
	);
}

module.exports.getComments = function(req, res, next){
	var sitio_id = req.params.id;
	Sitio.findOne({_id:req.params.id}, 'comentarios', function(err,doc){
		if(doc){
			res.json({
				status: 200,
				docs: doc
			});
		} else {
			res.json({
				status: 404,
				docs: err
			});
		}
	});
};

module.exports.newComment = function(req, res, next){
	var sitio_id = req.params.id;
	var comentario = req.body;
	var userid = comentario.id_usuario;
	Sitio.findOneAndUpdate({_id:sitio_id},
		{
			$push:{
				comentarios: comentario
			}
		},
		function(err, doc){
			if(!doc){
				res.json({
					status: 404,
					docs: err
				});
			}
		}
	);
	Sitio.findOne({_id:req.params.id}, 'comentarios', function(err,doc){
		if(doc){
			var suma = 0;
			var avg = 0;
			for (var i = doc.comentarios.length - 1; i >= 0; i--) {
				suma = suma + doc.comentarios[i].rate;
			}
			avg = suma / doc.comentarios.length;
			console.log(avg);
			Sitio.findOneAndUpdate({_id:sitio_id},
				{
					$set:{
						rating: avg
					}
				},
				function(err, doc){
					if(doc){
						res.json({
							status: 200,
							docs: doc
						});
					} else {
						res.json({
							status: 404,
							docs: err
						});
					}
				}
			);
		} else {
			res.json({
				status: 404,
				docs: err
			});
		}
	});
};

module.exports.deleteSitio = function(req, res, next){
	var sitio_id = req.body.sitio_id;
	var sitio_nombre = req.body.sitio_nombre;
	var sitioPath = "public/sitios/"+sitio_nombre;
	Sitio.remove({_id:sitio_id}, 
		function(err, doc){
			if(err){
				res.json({
					status: 404,
					docs: err
				});
			} else {
				res.json({
					status: 200,
					docs: doc
				});
			}
		}
	);
}

module.exports.deleteImage = function(req, res, next){
	var sitio_id = req.body.sitio;
	var imgPath = req.body.imgPath;
	var newImagenes = [];
	Sitio.findOneAndUpdate({_id:sitio_id}, 
		{$pull: {imagenes: imgPath}}, 
		function(err, doc){
        	if(doc) {
          		fs.unlinkSync(imgPath);
          		res.json({
					status: 200,
					docs: doc
				});
        	} else {
        		res.json({
					status: 404,
					docs: err
				});
        	}        	
      	}
  	);
};

var moveImage = function(oldName, newFolder, newName){
	if (!fs.existsSync(newFolder)){
    	fs.mkdirSync(newFolder);
    }
    var ext = path.extname(oldName);
    fs.rename(tmpFolder+"/"+oldName, newFolder+"/"+newName+ext);
}