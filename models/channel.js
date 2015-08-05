
// model for channel and related feeds
var DB = require('../db/db'),
	User = require('./user'),
	Feed = require('./feed'),
	Plugins = require('../db/plugins'),
	Schema = DB.mongoose.Schema;

// schema for a channel
var channelSchema = Schema({
	_id: String, // custom id used so that we can use regular churn channel ids
	name: String, // optional name that can be given to the channel scraper for ease of management
	feeds: [Feed.schema]
});

// add streaming plugins
channelSchema.plugin(Plugins.streams);

var KEY = 'Channel';
exports.name = KEY;
exports.schema = channelSchema;
exports.model = DB.mongoose.model(KEY, exports.schema);