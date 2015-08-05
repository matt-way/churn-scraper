
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	env = require('./config/env'),
	DB = require('./db/db');

// express modules
app.use(bodyParser.json());
app.use(express.static('public'));

// load routes
require('./config/routes')(app);

// setup server
var port = env.port;
var server = app.listen(port, function(){
	var host = server.address().address;
	console.log('Churn scraper management server listening at http://%s:%s', host, port);
});
