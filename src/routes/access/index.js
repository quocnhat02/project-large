const express = require('express');
const accessController = require('../../controllers/access.controller');
const { handleAsync } = require('../../auth/checkAuth');

const router = express.Router();

// sign-up
router.post('/sign-up', handleAsync(accessController.signUp));

// login
router.post('/login', handleAsync(accessController.login));

module.exports = router;
