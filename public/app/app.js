
var deps = [
	'ui.router',
	'ngResource',
	'ngStorage',
	'churnScraper.api',
	'churnScraper.channel',
	'churnScraper.user'
];

angular.module('churnScraper', deps)
	.config(function($stateProvider, $urlRouterProvider){

		$stateProvider
			.state('app', { url: '', abstract: true, templateUrl: '/app/app.html', controller: 'AppCtrl'})
			.state('app.channels', { url: '/channels', templateUrl: '/app/channel/channels.html', controller: 'ChannelsCtrl' })
			.state('app.channel', { url: '/channels/:channelId', templateUrl: '/app/channel/channel.html', controller: 'ChannelCtrl' })
			.state('app.users', { url: '/users', templateUrl: '/app/user/users.html', controller: 'UsersCtrl' });

		$urlRouterProvider.otherwise('/channels');
	})
	.run(function($rootScope){
		// catch ui-router errors
		$rootScope.$on('$stateChangeError', function(err){
			console.log(err);
		});
	})
	.controller('AppCtrl', function($scope, $localStorage){

		$scope.updateToken = function(token){
			$localStorage.scraperToken = token;
			$scope.accessToken = '';
		};
	});