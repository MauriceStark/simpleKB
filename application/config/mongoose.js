module.exports = function(config) {

	var mongoose 	= require('mongoose');
	
	var db			 	= mongoose.connect(config.mongodburi, {
		useMongoClient: true,
		keepAlive: true, 		// Server attempt to reconnect #times
  	reconnectTries: 30 	// The number of milliseconds to wait before initiating keepAlive on the TCP socket.
	});

	var User 			= require('../app/models/User');
	var Serie 		= require('../app/models/Serie');
	var Solution 	= require('../app/models/Solution');
	var Team 			= require('../app/models/Team');

	return db;
};
