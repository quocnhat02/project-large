const express = require('express');
const accessController = require('../../controllers/access.controller');

const router = express.Router();

// sign-up
router.post('/sign-up', accessController.signUp);

module.exports = router;
