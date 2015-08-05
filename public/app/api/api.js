
angular.module('churnScraper.api', [])
	.service('API', function($resource, $http, $localStorage){

		// auth header setup
		var authHeader = function(){
			return 'Bearer ' + $localStorage.scraperToken;
		};

		$http.defaults.headers.common['Authorization'] = authHeader;

		return {
			User: $resource('/user/:userId', { userId: '@id' }),
			Channel: $resource('/channel/:channelId', { channelId: '@id' }),
			Feed: $resource('/channel/:channelId/feed/:feedId', { channelId: '@channelId', feedId: '@feedId' })
		};
	});