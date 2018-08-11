var express = require('express');
var config 		= require('./config/env/development.js');

var configMongoose = require('./config/mongoose')(config);
var app = require('./config/express')(express, config);

const mongoose = require('mongoose');
//using es6 promises with mongoosejs queries
mongoose.Promise = global.Promise;
const User = mongoose.model('User');

User.count()
.exec()
.catch(err => next(err))
.then(result => {
  if (result == 1) {

    User.findOne((err, user) => {
      user.isAdmin = true;
      user.save(err => {

        if (user.isAdmin) {
          console.log("\x1b[32m*================================================================*");
          console.log("\x1b[32m*                   Nuevo Administrador Creado  ( ͡° ͜ʖ ͡°)         *");
          console.log("\x1b[32m*================================================================*");
        }

        if(err){
          console.log("\x1b[31m*================================================================*");
          console.log("\x1b[31m*                   ERROR al crear Administrador  \_(ʘ_ʘ)_/      *");
          console.log("\x1b[31m*================================================================*");
        }

      });
    });

  }
});



app.listen(process.env.PORT, function(){
console.log(`
\x1b[34m*================================================================*
\x1b[32m*                    Running Application                         *
\x1b[34m*================================================================*
 +----------------------+            ____
 | App                  |          .'    '.
 |                      |  <===    '.____.'
 |                      |          '.____.'
 |                      |          '.____.'
 |                      |  ===>    '.____.' \x1b[36m DB: \x1b[0m ${config.mongodb.hostname}:${config.mongodb.port}
 |                      |          '.____.' \x1b[36m DB NAME:\x1b[0m ${config.mongodb.database}
 +----------------------+
	`);
	 console.log('\x1b[36m%s: \x1b[0m' + process.env.NODE_ENV, "NODE_ENV");
	 console.log('\x1b[36m%s: \x1b[0m' + process.env.PORT, "PORT");
	 console.log('\x1b[36m%s: \x1b[0m' + process.env.COMMAND_SUPERVISORD, "COMMAND_SUPERVISORD");
	 console.log(`\x1b[34m*----------------------------------------------------------------*`);
});

module.exports = app;
