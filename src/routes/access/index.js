const express = require('express');
const accessController = require('../../controllers/access.controller');
const { handleAsync } = require('../../auth/checkAuth');
const router = express.Router();

// signup
router.post('/shop/signup', handleAsync(accessController.signUp));

module.exports = router;
