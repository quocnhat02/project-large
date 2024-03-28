'use strict';

const express = require('express');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const discountController = require('../../controllers/discount.controller');
const router = express.Router();

// get amount discount
router.post('/amount', handleAsync(discountController.getDiscountAmount));
router.get(
  '/list-product-code',
  handleAsync(discountController.getAllDiscountCodesWithProduct)
);

// authentication
router.use(authentication);

router.post('/', handleAsync(discountController.createDiscountCode));
router.get('/', handleAsync(discountController.getAllDiscountCodes));

module.exports = router;
