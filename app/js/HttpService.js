var app = angular.module('ViveTampico');

app.service('HttpService', function http($http, $q, $rootScope, transformRequestAsFormPost){
	var service = this;
	service.post = function(url, data){
		var defer = $q.defer();
		$http({
			url: $rootScope.URL + url,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			data: data,
			transformRequest: transformRequestAsFormPost,
		}).success(function(res){
		 	defer.resolve(res);
		}).error(function(err, status){
		 	defer.reject(err);
		})

		return defer.promise;
	}

	service.get = function(url){
		return $http.get($rootScope.URL + url);
	}

	return service;
});