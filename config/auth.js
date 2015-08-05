
// middleware for dealing with CRUD auth

var env = require('./env');

exports.allowed = function(req, res, next){
	var key = env.accessKey;

	// if no key is set, allow the call
	if(!key){
		return next();
	}

	if(key && req.headers && req.headers.authorization){
		console.log(key, req.headers.authorization);
		if(key === req.headers.authorization){
				return next();
		}		
		return res.status(403).send({ error: 'Invalid admin credentials provided'});
	}
};