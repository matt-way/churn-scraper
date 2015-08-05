
// controller for managing CRUD channels

var Channel = require('../models/channel');

exports.add = function(req, res, next){
	var chan = new Channel.model(req.body);
	chan.saveAsync().spread(function(channel, numAffected){
		return res.json(channel);
	}).catch(next);
};

exports.get = function(req, res, next){
	Channel.model.findById(req.params.channelId).populate('feeds.author').execAsync().then(function(channel){
		if(channel){
			req.channel = channel;
			return next();
		}
		return next(new Error('Channel not found'));
	}).catch(next);
};

// assumes channel on req
exports.send = function(req, res, next){
	return res.json(req.channel.toObject());
};

exports.update = function(req, res, next){
	Channel.model.findByIdAsync(req.params.channelId).then(function(channel){
		if(channel){
			channel.name = req.body.name;
			return channel.saveAsync();
		}
	}).catch(next);
};

exports.getAll = function(req, res, next){
	Channel.model.findAsync({}).then(function(channels){
		return res.json(channels);
	}).catch(next);
};

exports.remove = function(req, res, next){
	Channel.model.findById(req.params.channelId).removeAsync().then(function(){
		return res.json({ success: true });
	}).catch(next);
};