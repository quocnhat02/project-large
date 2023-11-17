const express = require('express');
const accessController = require('../../controllers/access.controller');
const { handleAsync } = require('../../auth/checkAuth');

const router = express.Router();

// sign-up
router.post('/sign-up', handleAsync(accessController.signUp));

module.exports = router;
