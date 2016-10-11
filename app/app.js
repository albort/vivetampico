var app = angular.module('ViveTampico', [
	'ui.router',
	'uiGmapgoogle-maps',
	'flow'
]);

app.run(function($rootScope){
    $rootScope.URL = 'localhost:3000';
    $rootScope.user = null;
});

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyC4bnuXmsnsYbQHJPKOfJULrwc6hO6kC-o',
        libraries: ''
    });
});

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/sitios");
	$stateProvider
	.state('app', {
        abstract: true,
        templateUrl: 'app/templates/home.html',
        controller: 'AppController'
    })
	.state('app.sitios', {
		url: '/sitios',
		templateUrl: 'app/views/sitios/sitios.html',
		controller: 'SitiosController'
	})
	.state('app.nuevositio', {
		url: '/sitios/agregarsitio',
		templateUrl: 'app/views/sitios/agregar-sitio.html',
		controller: 'AgregarSitioController'
	})
	.state('app.editarsitio', {
		url: '/sitios/:id',
		templateUrl: 'app/views/sitios/editar-sitio.html',
		controller: 'EditarSitioController'
	});
});