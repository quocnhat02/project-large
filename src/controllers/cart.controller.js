'use strict';

const { SuccessResponse } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {
  // new
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Cart success',
      metadata: await CartService.addToCart(req.body),
    });
  };
  // update + -
  update = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Cart success',
      metadata: await CartService.addToCartV2(req.body),
    });
  };
  // delete
  delete = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete product from Cart success',
      metadata: await CartService.deleteUserCart(req.body),
    });
  };
  // list
  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Cart success',
      metadata: await CartService.getListUserCart(req.query),
    });
  };
}

module.exports = new CartController();
