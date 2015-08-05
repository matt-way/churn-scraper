
var env = require('../config/env'),
	Channel = require('../models/channel');

// grab each channel and process synchronously
var query = Channel.model.find({}, {timeout:false});
Channel.model.eachStream(query, processChannel)
	.then(function(){
		console.log('scraping complete!');
	})
	.catch(function(err){
		console.log('Error processing channel:', err);
	});

function processChannel(channel){

	// go through each feed and get relevant video ids and times

	// sort the entire set of video ids by time

	// get the last n videos from the channel and remove duplicates from the addition set

	// go through each new video and add it to the channel

	console.log(channel.name);
}