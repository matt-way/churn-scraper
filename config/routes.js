
var Auth = require('./auth'),
	User = require('../controllers/user'),
	Channel = require('../controllers/channel'),
	Feed = require('../controllers/feed');

// server routes
module.exports = function(app){

	// users/tokens
	app.get('/user', Auth.allowed, User.getAll);
	app.post('/user', Auth.allowed, User.add);
	app.get('/user/:userId', Auth.allowed, User.get);
	app.post('/user/:userId', Auth.allowed, User.update);
	app.delete('/user/:userId', Auth.allowed, User.remove);

	// channels
	app.get('/channel', Auth.allowed, Channel.getAll);
	app.post('/channel', Auth.allowed, Channel.add);
	app.get('/channel/:channelId', Auth.allowed, Channel.get, Channel.send);
	app.post('/channel/:channelId', Auth.allowed, Channel.update);
	app.delete('/channel/:channelId', Auth.allowed, Channel.remove);

	// feeds
	app.post('/channel/:channelId/feed', Auth.allowed, Channel.get, Feed.add);
	app.post('/channel/:channelId/feed/:feedId', Auth.allowed, Channel.get, Feed.update);
	app.delete('/channel/:channelId/feed/:feedId', Auth.allowed, Channel.get, Feed.remove);
};