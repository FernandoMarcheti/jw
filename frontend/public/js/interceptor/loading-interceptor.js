(function(angular){
	'use strict';

	angular.module('sce').factory('loadingInterceptor', [ '$q', '$rootScope', function ($q, $rootScope) {	
		return {
			request: function (config) {
				$rootScope.loading = true;
				return config;
			},
			requestError: function (rejection) {
				$rootScope.loading = false;
				return $q.reject(rejection);
			},
			response: function (response) {
				$rootScope.loading = false;				
				return response;
			},
			responseError: function (rejection) {
				$rootScope.loading = false;
				return $q.reject(rejection);
			}
		};
	}])
})(angular);