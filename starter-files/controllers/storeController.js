'use strict';

exports.homePage = (req, res) => {
  res.locals.title = req.name;

  res.render('index');
}