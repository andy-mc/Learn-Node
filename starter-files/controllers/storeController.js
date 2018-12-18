'use strict';

exports.homePage = (req, res) => {
  res.locals.title = 'andyPandy';

  res.render('index');
}