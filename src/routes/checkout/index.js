'use strict';

const express = require('express');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const checkoutController = require('../../controllers/checkout.controller');
const router = express.Router();

// review checkout
router.post('/review', handleAsync(checkoutController.checkoutReview));

module.exports = router;
