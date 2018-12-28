const passport = require('passport');
const mongoose = require('mongoose');
const crypto = require('crypto');

const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login !!',
  successRedirect: '/',
  successFlash: 'You are now logged in !!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out !! 🙂');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'Ooops you must be logged in to do that !!');
  res.redirect('/login');
};

exports.forgot = async (req, res, next) => {
  // 1. See if a user with that email exists
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    req.flash(
      'success',
      'If you have an account with us, we will sent you an email for resetting your password !!'
    );
    res.redirect('back');
    return;
  }
  // 2. Set reset token with exp date on the user/account
  // gen something like 45720fa5d5d2c8194229bb4455ba9c0527dfe0fe
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();

  // 3. Send user an email with the token in a reset url
  // http://localhost:7777/account/reset/1c2e0211c743a9785de0445959396f84ad533593
  const resetURL = `http://${req.headers.host}/account/reset/${
    user.resetPasswordToken
  }`;

  req.flash(
    'success',
    `If you have an account with us, we will sent you an email
     for resetting your password !!
     <a href=${resetURL}>${resetURL}</a>`
  );

  // 4. redirect to login page
  res.redirect('/login');
};
