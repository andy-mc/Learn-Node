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
