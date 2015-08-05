
// Mongo db connection module

var P = require('bluebird'),
	mongoose = require('mongoose'),
	env = require('../config/env');

// setup promisified mongoose
P.promisifyAll(mongoose);
exports.mongoose = mongoose;

// db connection
mongoose.connect(env.DB.location, {
	user: env.DB.user,
	pass: env.DB.pass
});
