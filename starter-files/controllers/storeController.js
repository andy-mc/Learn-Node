const mongoose = require('mongoose');

const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

exports.homePage = (req, res) => {
  res.locals.title = 'andyPandy';
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: '🏪 Add Store'
  });
};

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      return next(null, true);
    }
    // TODO make this flash error fires with the rest below from
    // new Store(req.body).save(); errors CHALLENGE
    return next({ multerError: "That type of file isn't allowed !!" }, false);
  }
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  if (!req.file) return next();

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  return next();
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
  if (req.body.location) req.body.location.type = 'Point';

  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store
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

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });

  if (!store) return next();

  return res.render('store', {
    title: store.name,
    store
  });
};

exports.getStoresByTag = async (req, res) => {
  const tags = await Store.getTagsList();

  res.render('tag', {
    title: req.params.tag || 'Tags',
    tag: req.params.tag,
    tags
  });
};
