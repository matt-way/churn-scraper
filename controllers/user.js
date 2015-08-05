
// controller for managing CRUD users

var User = require('../models/user');

exports.add = function(req, res, next){
	var chan = new User.model(req.body);
	chan.saveAsync().spread(function(user, numAffected){
		return res.json(user);
	}).catch(next);
};

exports.get = function(req, res, next){
	User.model.findByIdAsync(req.params.channelId).then(function(user){
		if(user){
			return res.json(user.toObject());
		}
		return next(new Error('User not found'));
	}).catch(next);
};

exports.update = function(req, res, next){
	User.model.findByIdAsync(req.params.userId).then(function(user){
		if(user){
			user.name = req.body.name;
			user.token = req.body.token;
			return user.saveAsync();
		}
	}).catch(next);
};

exports.getAll = function(req, res, next){
	User.model.findAsync({}).then(function(users){
		return res.json(users);
	}).catch(next);
};

exports.remove = function(req, res, next){
	User.model.findById(req.params.userId).removeAsync().then(function(){
		return res.json({ success: true });
	}).catch(next);
};