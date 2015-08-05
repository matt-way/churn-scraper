
angular.module('churnScraper.channel', [])
	.controller('ChannelsCtrl', function($scope, $state, API){

		$scope.channel = {};
		$scope.errors = [];

		$scope.refreshChannels = function(){
			$scope.channels = API.Channel.query();
		}
		$scope.refreshChannels();
		
		$scope.createChannel = function(){
			var chan = new API.Channel($scope.channel);
			chan.$save().then(function(result){
				console.log(result);
				$state.go('app.channel', { channelId: result._id });
			}, function(err){
				console.log(err);
				$scope.errors.push(JSON.stringify(err, undefined, 4));
			});
		};

		$scope.loadChannel = function(id){
			$state.go('app.channel', { channelId: id });
		};

		$scope.updateChannel = function(index){
			var chan = $scope.channels[index];
			API.Channel.save({ channelId: chan._id }, chan);
		};

		$scope.deleteChannel = function(index){
			var chan = $scope.channels[index];
			API.Channel.delete({ channelId: chan._id }).$promise.then(function(){
				$scope.channels.splice(index, 1);
			}, console.log);
		};

		$scope.closeError = function(index){
			$scope.errors.splice(index, 1);
		};
	})
	.controller('ChannelCtrl', function($scope, $stateParams, API){

		$scope.feed = {};
		$scope.errors = [];
		$scope.users = API.User.query();
		
		$scope.refreshChannel = function(){
			API.Channel.get({ channelId: $stateParams.channelId }).$promise.then(function(channel){
				$scope.channel = channel;
			}, function(err){
				console.log(err);
			});	
		};	
		$scope.refreshChannel();	

		$scope.createFeed = function(){
			var feed = new API.Feed($scope.feed);
			feed.$save({ channelId: $scope.channel._id }).then(function(result){
				$scope.feed = {};
				$scope.refreshChannel();
			}, function(err){
				console.log(err);
				$scope.errors.push(JSON.stringify(err, undefined, 4));
			});
		};

		$scope.updateFeed = function(index){
			var feed = $scope.channel.feeds[index];
			API.Feed.save({ channelId: $scope.channel._id, feedId: feed._id }, feed);
		};

		$scope.deleteFeed = function(index){
			var feed = $scope.channel.feeds[index];
			API.Feed.delete({ channelId: $scope.channel._id, feedId: feed._id }).$promise.then(function(){
				$scope.refreshChannel();
			}, console.log);
		};
	});




