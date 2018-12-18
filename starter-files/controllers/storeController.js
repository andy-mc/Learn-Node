'use strict';

exports.homePage = (req, res) => {
  res.locals.title = 'andyPandy';
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', {title: '🏪 Add Store'});
}