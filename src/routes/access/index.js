const express = require('express');
const accessController = require('../../controllers/access.controller');
const handleAsync = require('../../helpers/handlerAsync');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// sign-up
router.post('/sign-up', handleAsync(accessController.signUp));

// login
router.post('/login', handleAsync(accessController.login));

// authentication
router.use(authentication);

// logout
router.post('/logout', handleAsync(accessController.logout));
router.post(
  '/handle-refreshtoken',
  handleAsync(accessController.handleRefreshToken)
);

module.exports = router;
