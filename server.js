process.env.TMPDIR = 'tmp';
var port = process.env.PORT||80;

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

mongoose.connect('mongodb://localhost:27017/vivetampico');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});


app.use('/app', express.static(__dirname + '/app'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.get('/', function(req, res){
	res.sendFile('index.html', {"root": __dirname});
});

var sitiosController = require('./server/controllers/SitiosController.js');
app.get('/api/sitios/', sitiosController.getAll);
app.post('/api/sitios/new', sitiosController.new);
app.get('/api/sitios/:id', sitiosController.getOne);
app.post('/api/sitios/edit-sitio', sitiosController.editSitio);
app.post('/api/sitios/delete', sitiosController.deleteSitio);
app.post('/api/sitios/delete-image', sitiosController.deleteImage);
app.get('/api/sitios/:id/comments', sitiosController.getComments);
app.post('/api/sitios/:id/post-comment', sitiosController.newComment);

var imagesController = require('./server/controllers/ImagesController.js');
app.post('/upload/sitios', multipartMiddleware, imagesController.postImage);
app.options('/upload/sitios', imagesController.options);
app.get('/upload/sitios', imagesController.getImage);
app.get('/admin/download/:identifier', imagesController.downloadImage);

app.listen('3000', function(){
	console.log('127.0.0.1:3000 is live!');
});