var LocalStrategy   = require('passport-local').Strategy;
var User            = require('mongoose').model('User');
var passport        = require('passport');
var bcrypt          = require('bcrypt-nodejs');

var isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);
// Generates hash using bCrypt
var createHash      = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

/*
Login Flow

You run your authentication in your passport strategy login code.
The authentication will go to the database to find the user and create a User object.
With the User object, authentication will check to see if the user exists and if the password is correct.
If the check is good then authentication is done and returns the User object.
Passport will then run serializeUser and pass in the User object.
Behind the scenes, passport will load the User object into session req.user and also save only the unique ID of the User object into the cookie.

(1) Login --> [2] Database --> (3) serializeUser --> [4] Session --> [5] Cookie

Authenticated Flow

If the user is already logged in and makes a request, it will follow the "authenticated flow", which is instead of serializing the user,
you deserialize the user. But the difference is, deserializeUser is called a lot more times because it's called once per request.
Passport gets the ID from the cookie and run deserializeUser and pass in the ID.
It will go to the database and find the user by its ID. Passport will recreate the User object and then return the User object.
Behind the scenes, passport will then reload the User object into session req.user.

(1) Authenticated request --> [1] Cookie --> [2] Database --> (3) deserializeUser --> [4] Session
*/

// Using Passport Strategies
  passport.use('login', new LocalStrategy({
      passReqToCallback : true
    },
    (req, username, password, done) => {
      // check in mongo if a user with username exists or not
      User.findOne({ 'username' :  username },
        (err, user) => {

          // In case of any error, return using the done method
          if (err)
            return done(err);
          // Username does not exist, log error & redirect back
          if (!user){
            console.log('User Not Found with username '+ username);
            return done(null, false, req.flash('message', 'User Not found.'));
          }
          // User exists but wrong password, log the error
          if (!isValidPassword(user, password)){
            console.log('Invalid Password');
            return done(null, false, req.flash('message', 'Invalid Password'));
          }
          // User and password both match, return user from
          // done method which will be treated like success
          return done(null, user);
        }
      );
  }));

passport.use('signup', new LocalStrategy({
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  (req, username, password, done) => {

      // find a user in Mongo with provided username
      User.findOne({'username':username}, (err, user) => {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false,
             req.flash('message','User Already Exists'));
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);

          // save the user
          newUser.save((err) => {
            if (err){
              console.log('Error in Saving user: '+ err);
              throw err;
            }
            console.log('User Registration succesful');
            return done(null, newUser);
          });
        }
      });

    })
  );

  // Serializing and Deserializing User Instances

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User
    .findById(id)
    .select({ password: 0})     // Exclude field password
    .populate('teams', 'team')  // only return the team title
    .exec((err, user) => {
      user.lastLogin =  Date.now();
      user.save(function (err) {
        //if (err) return handleError(err);
        done(null, user);
      });
    });
  });
