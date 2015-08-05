
// Churn API consumer

var P = require('bluebird'),
	requestJSON = require('request-json'),
	env = require('../config/env'),
	_ = require('lodash');

var client = requestJSON.createClient(env.api);
P.promisifyAll(client);

exports.getLatestVideos = function(channelId){
	
	var channelPart = 'channel/' + channelId;
	return client.getAsync(channelPart).spread(function(res, body){
		var videoPart = '/video/' + body.data.defaultVideoId + '/below';
		return client.getAsync(channelPart + videoPart).spread(function(res, body){
			var videos = _.map(body.data, function(item){
				return item.youtubeId;
			});
			return videos;
		});
	});
};

exports.addVideo = function(channelId, video){
	
	var videoURL = 'http://www.youtube.com/watch?v=' + video.id;
	var url = 'channel/' + channelId + '/video/add?url=' + videoURL;

	// set the auth token stuff
	client.headers['Authorization'] = 'Bearer ' + video.token;

	return client.postAsync(url, {}).spread(function(res, body){
		return body;
	});
};