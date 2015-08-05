
angular.module('churnScraper.user', [])
	.controller('UsersCtrl', function($scope, API){

		$scope.user = {};

		$scope.refreshUsers = function(){
			$scope.users = API.User.query();
		}
		$scope.refreshUsers();
		
		$scope.createUser = function(){
			var user = new API.User($scope.user);
			user.$save().then(function(result){
				console.log(result);
				$scope.user = {};
				$scope.refreshUsers();
			}, function(err){
				console.log(err);
				$scope.errors.push(JSON.stringify(err, undefined, 4));
			});
		};

		$scope.updateUser = function(index){
			var user = $scope.users[index];
			API.User.save({ userId: user._id }, user);
		};

		$scope.deleteUser = function(index){
			var user = $scope.users[index];
			API.User.delete({ userId: user._id }).$promise.then(function(){
				$scope.users.splice(index, 1);
			}, console.log);
		};

		$scope.closeError = function(index){
			$scope.errors.splice(index, 1);
		};
	});