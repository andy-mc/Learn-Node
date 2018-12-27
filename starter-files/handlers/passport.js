const passport = require('passport');
const mongoose = require('mongoose');

const User = mongoose.model('User');

// local strategy
passport.use(User.createStrategy());

// user.get(options.usernameField)
passport.serializeUser(User.serializeUser());
// self.findByUsername(username, cb);
passport.deserializeUser(User.deserializeUser());
