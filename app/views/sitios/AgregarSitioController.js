var app = angular.module('ViveTampico');

app.controller('AgregarSitioController', function($scope, $http, $location, uiGmapGoogleMapApi){
	$scope.map = { 
		center: { 
			latitude: 22.2762272, 
			longitude: -97.8673318 
		}, 
		zoom: 12 
	};

	$scope.imagenBackground = {};
	$scope.imagenes = {};

	$scope.sitio = {
		nombre: "",
		subnombre: "",
		categoria: "Categoria",
		informacion: [],
		latitud: "",
		longitud: "",
		imagenBackground: "",
		imagenes: []
	}

	$scope.tCat = function(newValue){
		$scope.sitio.categoria = newValue;
	};

	$scope.plusInfo = function(){
		$scope.sitio.informacion.push({
			titulo: "",
			detalle: ""
		});
	}

	$scope.agregar = function(){
		angular.forEach($scope.imagenBackground.flow.files, function(value, key){
			$scope.sitio.imagenBackground = value.name;
		});
		angular.forEach($scope.imagenes.flow.files, function(value, key){
			$scope.sitio.imagenes.push(value.name);
		});
		$http.post('api/sitios/new', $scope.sitio).success(function(response){
			$location.path('#/sitios');
		}).error(function(error){
			console.log(error);
		});
	}

	$scope.marker = {
      	id: 0,
      	coords: {
        	latitude: 22.2762272,
        	longitude: -97.8673318
      	},
      	options: { 
      		draggable: true 
      	},
      	events: {
        	dragend: function (marker, eventName, args) {
          		var lat = marker.getPosition().lat();
          		var lon = marker.getPosition().lng();
          		$scope.sitio.latitud = lat;
          		$scope.sitio.longitud = lon;
          		$scope.marker.options = {
            		draggable: true,
            		labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
            		labelAnchor: "100 0",
            		labelClass: "marker-labels"
          		};
        	}
      	}
    };
});