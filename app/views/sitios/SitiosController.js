var app = angular.module('ViveTampico');

app.controller('SitiosController', function($scope, $http, uiGmapGoogleMapApi, $location){
	$scope.sitios = [];
	$http.get('api/sitios/').success(function(data, status, headers, config) {
        $scope.sitios = data.docs;
        $scope.viewSitio($scope.sitios[0]);
    });

	$scope.viewSitio = function(sitio, index){
		$scope.sitio = sitio;
		$scope.index = index;
		$scope.map.center = { 
			latitude: $scope.sitio.latitud, 
			longitude: $scope.sitio.longitud
		};
		$scope.marker.coords = {
			latitude: $scope.sitio.latitud, 
			longitude: $scope.sitio.longitud
		};
	};

	$scope.editarSitio = function(){
		$location.path('sitios/'+$scope.sitio._id);
	}

	$scope.borrarSitio = function(){
		var obj = {
			sitio_id : $scope.sitio._id,
			sitio_nombre : $scope.sitio.nombre
		}
		$http.post('api/sitios/delete', obj).success(function(response){
			$scope.sitios.splice($scope.index, 1);	
		}).error(function(error){
			console.log(error);
		});
	}

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
      		draggable: false 
      	}
    };
});