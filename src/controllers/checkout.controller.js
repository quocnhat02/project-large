'use strict';

const { SuccessResponse } = require('../core/success.response');
const CheckoutService = require('../services/checkout.service');

class CheckoutController {
  // review
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: 'Review cart success',
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
