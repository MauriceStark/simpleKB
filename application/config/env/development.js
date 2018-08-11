var config = {};

config.mongodb = {
	hostname: process.env.MONGODB_PORT_27017_TCP_ADDR || "localhost",
	database: process.env.MONGODB_DATABASE 						|| "AppDatabase",
	port: 		process.env.MONGODB_PORT_27017_TCP_PORT || "27017",
	username: process.env.MONGODB_USERNAME,
	password: process.env.MONGODB_PASSWORD
}

config.mongoSession = {
	hostname: process.env.MONGODB_PORT_27017_TCP_ADDR || "localhost",
	database: process.env.DATABASE_SESSION 						|| "AppDatabase_Session",
	port: 		process.env.MONGODB_PORT_27017_TCP_PORT || "27017",
	username: process.env.MONGODB_USERNAME,
	password: process.env.MONGODB_PASSWORD
}

// config.mongodburi = "mongodb://" + config.mongodb.username + ":" + config.mongodb.password + "@" + config.mongodb.hostname + ":" + config.mongodb.port + "/" + config.mongodb.database;

config.mongodburi 			= "mongodb://" + config.mongodb.hostname + ":" + config.mongodb.port + "/" + config.mongodb.database;
config.mongoSessionuri 	= "mongodb://" + config.mongoSession.hostname + ":" + config.mongoSession.port + "/" + config.mongoSession.database;

config.sessionSecret = process.env.SESSION_SECRET || 'developmentSessionSecret';

module.exports = config;
