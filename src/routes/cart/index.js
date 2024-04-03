'use strict';

const express = require('express');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();

router.post('', handleAsync(cartController.addToCart));
router.delete('', handleAsync(cartController.delete));
router.post('/update', handleAsync(cartController.update));
router.get('', handleAsync(cartController.listToCart));

module.exports = router;
