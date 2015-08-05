
// scraper module for finding youtube videos in rss feeds

var P = require('bluebird'),
	_ = require('lodash'),
	request = require("request"),
	FeedParser = require('feedparser');

var MAX_VIDEOS = 20;

// given a feed object, find any relevant youtube videos
exports.findVideos = function(feed){

	console.log('* processing feed:', feed.name, '-', feed.url);

	return getPosts(feed.url).then(function(posts){
		// remove any posts that fall outside the provided last time and sort
		var lastTime = feed.lastItemTime || 0;
		posts = _.sortBy(_.filter(posts, function(post){
			return post.time > lastTime;
		}), 'time');
		// only keep the last MAX total if too many were selected
		posts = posts.slice(Math.max(posts.length - MAX_VIDEOS, 0));
		return posts;
	}).then(getVideos);
};

function getPostTime(post){
	var datetime = post.date || post.pubdate;
	if(datetime){
		return datetime.getTime();
	}
	return 0;
}

function getPosts(url){

	return new P(function(resolve, reject){

		var req = request(url, { timeout: 25000, pool: false });
		req.setMaxListeners(50);
		
		var feedparser = new FeedParser();
		var posts = [];

		// Define our handlers
		req.on('error', reject);
		req.on('response', function(res) {
			var stream = this;			

			if (res.statusCode != 200){
				console.log(res.statusCode);

				return this.emit('error', new Error('Bad status code'));	
			} 

			// parse the feed
			stream.pipe(feedparser);
		});

		feedparser.on('error', reject);
		feedparser.on('end', function(){
			return resolve(posts);	
		});
		
		feedparser.on('readable', function() {
			var post;
			while (post = this.read()) {	
				// store the posts
				posts.push({
					post: post,
					time: getPostTime(post)
				});
			}
		});
	});	
}

function findVideoId(data){

	var reg = /(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@?&%=+\/\$_.-]*/;

	if(!data.link){
		return P.reject('No link for post');
	}

	var linkMatches = data.link.match(reg);
	if(linkMatches){
		return P.resolve(linkMatches[1]);
	}else{
		// delve deeper into the item
		return new P(function(resolve, reject){
			request(data.link, function(err, res, body){
				if(err){ return reject(err); }

				// attempt to extract the first youtube embed url from the page
				var matches = body.match(reg);			
				return resolve(matches ? matches[1] : null);
			});
		});
	}
}

// given a set of posts, find any applicable videos
function getVideos(posts){
	var videos = [];
	return P.each(posts, function(post){
		// find and process each video found for each post
		return findVideoId(post.post)
			.then(function(id){
				if(id){
					videos.push({
						id: id,
						time: post.time
					});	
				}				
				console.log('parsed item:', id);
			})
			.catch(function(err){
				console.log('error parsing post', err);
			});
	}).then(function(){
		return videos;
	});
}