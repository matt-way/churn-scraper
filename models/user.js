
// model for a user/token setup that can be used for different feeds
// so that there is no duplication
var DB = require('../db/db');

var userSchema = DB.mongoose.Schema({
	name: String, // optional name given to this user
	token: String, // the churn token associated with this user
});

var KEY = 'User';
exports.name = KEY;
exports.schema = userSchema;
exports.model = DB.mongoose.model(KEY, exports.schema);