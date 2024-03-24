const express = require('express');
const accessController = require('../../controllers/access.controller');
const { handleAsync } = require('../../helpers/handleAsync');
const router = express.Router();

// signup
router.post('/shop/signup', handleAsync(accessController.signUp));

// sign in
router.post('/shop/login', handleAsync(accessController.login));

// authentication

router.post('/shop/login', handleAsync(accessController.login));

module.exports = router;
