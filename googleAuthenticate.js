const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user')

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  

    // callbackURL: "http://localhost:3000/auth/google/callback"
passport.use(new GoogleStrategy({
    clientID: '928952573368-u2tuks6q3jsdg37m9srpk00mgp3rjgt9.apps.googleusercontent.com',
    clientSecret:'9wij992iKVe8ON6HOb95Ucja',
    callbackURL : "engageclone.herokuapp.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
        email: profile.emails[0].value
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.emails[0].value,
                provider: 'google',
                //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                google: profile._json
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            //found user. Return
            return done(err, user);
        }
    });
  }
));