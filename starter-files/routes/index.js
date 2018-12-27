const express = require('express');

const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', authController.isLoggedIn, storeController.addStore);
router.post(
  '/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.post(
  '/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));
router.get('/tags', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
router.post(
  '/register',
  userController.validateRegister,
  catchErrors(userController.register),
  authController.login
);

router.get('/logout', authController.logout);

router.get(
  '/account',
  authController.isLoggedIn,
  catchErrors(userController.account)
);

router.post(
  '/account',
  authController.isLoggedIn, // this line is neccessary or not ?
  catchErrors(userController.updateAccount)
);

module.exports = router;
