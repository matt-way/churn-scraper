
// common mongoose plugins used throughout app

var P = require('bluebird'),
	_ = require('lodash');

// plugin used for looping through an entire collection using streams
// it is promise based, resolving once all items in the collection have resolved their item work function
exports.streams = function(schema, options){

	schema.statics.eachStream = function(query, worker){
		
		return new P(function(resolve, reject){
			var stream = query.stream();

			stream.on('data', function(item){
				stream.pause();
				P.resolve(worker(item)).finally(function(){
					stream.resume();
				});				
			}).on('error', function(err){
				reject(err);
			}).on('close', function(){
				resolve();
			});
		});		
	};
}