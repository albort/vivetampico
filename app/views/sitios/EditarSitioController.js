var app = angular.module('ViveTampico');

app.controller('EditarSitioController', function($scope, $stateParams, $http, $location, uiGmapGoogleMapApi){
	$scope.init = function(){
        $scope.sitioID = $stateParams.id;
        $http.get('api/sitios/'+$scope.sitioID).success(function(data, status, headers, config) {
        	$scope.sitio = data.docs;
        	$scope.setData();
    	});
    };

    $scope.imagenBackground = {};
	$scope.imagenes = {};

    $scope.setData = function(){
    	$scope.map.center = { 
			latitude: $scope.sitio.latitud, 
			longitude: $scope.sitio.longitud
		};
		$scope.marker.coords = {
			latitude: $scope.sitio.latitud, 
			longitude: $scope.sitio.longitud
		};
    };

    $scope.guardar = function(){
    	var newImages = [];
    	angular.forEach($scope.imagenBackground.flow.files, function(value, key){
			$scope.sitio.imagenBackground = value.name;
		});
		angular.forEach($scope.imagenes.flow.files, function(value, key){
			newImages.push(value.name);
		});
    	var obj = {
			sitio : $scope.sitio,
			imagenes : newImages
		}
		$http.post('api/sitios/edit-sitio', obj).success(function(response){
			$location.path('#/sitios');
		}).error(function(error){
			console.log(error);
		});
	};

	$scope.deleteImage = function(index, img){
		var obj = {
			sitio : $scope.sitio._id,
			imgPath : img
		}
		$http.post('api/sitios/delete-image', obj).success(function(response){
			$scope.sitio.imagenes.splice(index, 1);
		}).error(function(error){
			console.log(error);
		});		
	};

    $scope.map = { 
		center: { 
			latitude: 22.2762272, 
			longitude: -97.8673318 
		}, 
		zoom: 15 
	};

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
            		labelContent: "lat: " + $scope.marker.coords.latitude + ' <br> ' + 'lon: ' + $scope.marker.coords.longitude,
            		labelAnchor: "100 0",
            		labelClass: "marker-labels"
          		};
        	}
      	}
    };

    $scope.init();
});