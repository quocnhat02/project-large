'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// signup
router.post('/shop/signup', handleAsync(accessController.signUp));

// sign in
router.post('/shop/login', handleAsync(accessController.login));

// authentication
router.use(authentication);

// logout
router.post('/shop/logout', handleAsync(accessController.logout));

// handleRefreshToken
router.post(
  '/shop/handle-refresh-token',
  handleAsync(accessController.handleRefreshToken)
);

module.exports = router;
