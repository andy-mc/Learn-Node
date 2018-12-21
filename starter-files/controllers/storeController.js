const mongoose = require('mongoose');

const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.locals.title = 'andyPandy';
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: '🏪 Add Store'
  });
};

exports.createStore = async (req, res) => {
  const store = await new Store(req.body).save();
  req.flash(
    'success',
    `Store ${store.name.replace(/\w/, char =>
      char.toUpperCase()
    )} Saved Successfully !!`
  );

  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();

  res.render('stores', {
    title: 'Stores',
    stores
  });
};

exports.editStore = async (req, res) => {
  // 1. Find the store given the ID
  const store = await Store.findById(req.params.id);
  // 2. confirm the logged user is the owner of the store or data to edit
  // TODO
  // 3. Render out the edit form so the user can update their store
  res.render('editStore', {
    title: `🏪 Edit Store ${store.name}`,
    store
  });
};

exports.updateStore = async (req, res) => {
  req.body.tags = req.body.tags || [];

  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();

  req.flash(
    'success',
    `Succesfully updated <strong>${store.name.replace(/\w/, char =>
      char.toUpperCase()
    )}</strong>. <a href="/stores/${store.slug}">View Store →</a>`
  );

  res.redirect(`back`);
};
