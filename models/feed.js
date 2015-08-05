
// model for feed item inside channel

var DB = require('../db/db'),
	User = require('./user'),
	Schema = DB.mongoose.Schema;

// schema for feed item attached to a channel
var feedSchema = Schema({
	name: String, // name given to the feed
	url: String, // the rss url of the feed
	author: { type: Schema.Types.ObjectId, ref: User.name }, // the link to the author & token (user who is appending the videos)
	lastItemTime: Date // the time of the last processed item by the scraper (used for efficiency reasons)
});

var KEY = 'Feed';
exports.name = KEY;
exports.schema = feedSchema;
exports.model = DB.mongoose.model(KEY, exports.schema);