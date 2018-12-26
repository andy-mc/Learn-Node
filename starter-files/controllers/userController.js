const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.loginForm = (req, res) => {
  res.render('login', {
    title: 'login'
  });
};

exports.registerForm = (req, res) => {
  res.render('register', {
    title: 'Register'
  });
};

exports.login = async (req, res) => {
  const user = await new User({ email: req.body.email }).save();
  res.send(user);
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name'); // clean input from malicious code
  req.checkBody('name', 'You must supply a name !!').notEmpty();
  req.checkBody('email', 'That email is not valid !!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    gmail_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password Cannot be Blank !!').notEmpty();
  req
    .checkBody('password-confirm', 'Confirmed Password Cannot be Blank !!')
    .notEmpty();
  req
    .checkBody('password-confirm', 'Oops! Your passwords do not match')
    .equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    });
    return; // stop the fn from running
  }
  // next(); // there where no errors
  res.send(req.body);
};
