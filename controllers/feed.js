
// controller for managing CRUD feed items

var Channel = require('../models/channel'),
	Feed = require('../models/feed');

// add a new feed to a channel
// assumes channel on req
exports.add = function(req, res, next){
	console.log(req.body);
	console.log(req.channel.feeds);
	var feed = new Feed.model(req.body);
	req.channel.feeds.push(feed);
	console.log('---');
	console.log(req.channel.feeds);
	req.channel.saveAsync().spread(function(channel, numAffected){
		return res.json(channel);
	}).catch(next);
};

// update a feed
// assumes channel on req
exports.update = function(req, res, next){
	var feed = req.channel.feeds.id(req.params.feedId);

	if(!feed){
		return next(new Error('Feed not found'));
	}

	feed.name = req.body.name;
	feed.url = req.body.url;
	feed.author = req.body.author._id || req.body.author;

	req.channel.saveAsync().spread(function(channel, numAffected){
		return res.json(channel);
	}).catch(next);
};

// remove a feed
// assumes channel on req
exports.remove = function(req, res, next){
	req.channel.feeds.id(req.params.feedId).remove();
	req.channel.saveAsync().spread(function(channel, numAffected){
		return res.json(channel);
	}).catch(next);
};