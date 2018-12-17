'use strict';

exports.homePage = (req, res) => {
  res.locals.title = 'andy Rules';
  
  res.render('index');
}