
var env = require('../config/env'),
	Channel = require('../models/channel'),
	Feed = require('./feed'),
	_ = require('lodash'),
	API = require('./api');

var P = require('bluebird');

// grab each channel and process synchronously
var query = Channel.model.find({}, {timeout:false}).populate('feeds.author');
Channel.model.eachStream(query, processChannel)
	.then(function(){
		console.log('scraping complete!');
	})
	.catch(function(err){
		console.log('Error processing channel list:', err);
	})
	.finally(function(){
		process.exit();
	});

function processChannel(channel){

	console.log('--- processing channel', channel.name);
	var videos = [];

	// go through each feed and get relevant video ids and times
	return P.each(channel.feeds, function(feed){
		return Feed.findVideos(feed).then(function(vids){
			// update the channel video list, adding the correct author token to each video item
			videos = videos.concat(_.map(vids, function(vid){
				vid.token = feed.author.token;
				return vid;
			}));

			// set the last processed date for the feed
			feed.lastItemTime = _.max(_.pluck(vids, 'time'));
		}).catch(function(err){
			console.log('- Error processing feed:', err);
		});
	}).then(function(){

		// sort the entire set of video ids by time
		videos = _.sortBy(videos, function(video){
			return video.time;
		});

		// get the latest videos from the channel
		return API.getLatestVideos(channel._id);
	}).then(function(latestVids){

		// remove duplicates from addition list that appear already in the channel latest
		videos = _.filter(videos, function(video){
			var id = video.id;
			return _.findIndex(latestVids, function(latest){
				return latest === id;
			}) < 0;
		});

		// go through each new video and add it to the channel
		return P.each(videos, function(video){
			return API.addVideo(channel._id, video).then(function(){
				console.log('added video:', video.id);
			});
		}).then(function(){
			console.log('--- completed processing channel', channel.name);
		});

	}).catch(function(err){
		console.log('error processing channel:', err, err.stack);
	});
}